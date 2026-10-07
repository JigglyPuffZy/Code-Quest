"use client";

import { avatarById } from "@/lib/avatars";
import { heartbeatPresence } from "@/lib/duels/client";
import { storageKey } from "@/lib/storage-keys";
import { getChallenge, getLesson } from "@/lib/curriculum/index";
import { parseGameLevelId, xpForGameLevel } from "@/lib/game";
import { getQuest } from "@/lib/curriculum/quests";
import {
  createPlayer,
  grantAchievements,
  levelFromXp,
  markChallengeComplete,
  markGameLevelComplete,
  markLessonComplete,
  markQuestClaimed,
  mergePlayers,
  rememberLesson as rememberLessonOn,
  totalXp,
  touchStreak,
  withProfile,
} from "@/lib/gamification";
import {
  clearGuest,
  loadGuestOrCreate,
  readGuest,
  readUserCache,
  writeGuest,
  writeUserCache,
} from "@/lib/player/storage";
import { exportGuideProgress, importGuideProgress } from "@/lib/guides/progress";
import { exportLessonNotes, importLessonNotes } from "@/lib/learning/notes";
import {
  extractGuideProgress,
  extractLessonNotes,
  missingTable,
  playerToRow,
  rowToPlayer,
  type ProfileRow,
} from "@/lib/player/profile";
import { questStatus } from "@/lib/progress";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { SkillDifficulty } from "@/lib/difficulty";
import type {
  BackendFrameworkId,
  BackendLanguage,
  FrontendFrameworkId,
  FrontendLanguage,
  GameTrackId,
} from "@/lib/game/tracks";
import type { Achievement, LevelInfo, Player } from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Toast = {
  id: string;
  title: string;
  detail: string;
};

type PlayerContextValue = {
  player: Player | null;
  ready: boolean;
  error: string | null;
  supabaseEnabled: boolean;
  email: string | null;
  xp: number;
  level: LevelInfo;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    avatar: string,
  ) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (patch: { username: string; avatar: string }) => Promise<void>;
  setLocalIdentity: (username: string, avatar: string) => void;
  completeLesson: (id: string) => { awarded: boolean; xp: number };
  completeChallenge: (id: string) => { awarded: boolean; xp: number };
  completeGameLevel: (id: string) => { awarded: boolean; xp: number };
  claimQuest: (id: string) => { awarded: boolean; xp: number };
  rememberLesson: (id: string) => void;
  setSkillDifficulty: (difficulty: SkillDifficulty) => void;
  setGameTrack: (track: GameTrackId) => void;
  setFrontendStack: (patch: {
    framework: FrontendFrameworkId;
    language: FrontendLanguage;
  }) => void;
  setBackendStack: (patch: {
    framework: BackendFrameworkId;
    language: BackendLanguage;
  }) => void;
  refresh: () => Promise<void>;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const emptyLevel: LevelInfo = { level: 1, title: "Initiate", into: 0, needed: 80 };
const PERSIST_DEBOUNCE_MS = 750;

function isBenignAuthError(error: unknown) {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return message.includes("auth session missing") || message.includes("session not found");
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  if (isBenignAuthError(error)) return "";
  if (missingTable(message)) {
    return "Supabase is connected, but the profiles table is missing. Run supabase/schema.sql in the SQL editor.";
  }
  return message;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [supabaseEnabled, setSupabaseEnabled] = useState(isSupabaseConfigured);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const playerRef = useRef<Player | null>(null);
  const emailRef = useRef<string | null>(null);
  const enabledRef = useRef(isSupabaseConfigured());
  const saveQueue = useRef(Promise.resolve());
  const persistDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushNotices = useCallback((previous: Player, next: Player, fresh: Achievement[], extra?: Toast) => {
    const notices: Toast[] = [];
    if (extra) notices.push(extra);
    const before = levelFromXp(totalXp(previous)).level;
    const after = levelFromXp(totalXp(next));
    if (after.level > before) {
      notices.push({
        id: crypto.randomUUID(),
        title: `Level ${after.level}`,
        detail: `You reached ${after.title}.`,
      });
    }
    fresh.forEach((achievement) => {
      notices.push({
        id: crypto.randomUUID(),
        title: "Achievement unlocked",
        detail: `${achievement.title} · +${achievement.xp} XP`,
      });
    });
    if (!notices.length) return;
    setToasts((current) => [...notices, ...current].slice(0, 4));
  }, []);

  const enqueuePersist = useCallback(() => {
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(async () => {
        const latest = playerRef.current;
        if (!latest) return;
        if (emailRef.current && enabledRef.current) {
          writeUserCache(latest);
          const { error: saveError } = await createClient()
            .from("profiles")
            .upsert(
              playerToRow(latest, emailRef.current, {
                guideProgress: exportGuideProgress(),
                lessonNotes: exportLessonNotes(),
              }),
            );
          if (saveError) {
            const detail = friendlyError(saveError);
            if (detail) {
              setToasts((current) => [
                { id: crypto.randomUUID(), title: "Could not sync progress", detail },
                ...current,
              ].slice(0, 4));
            }
          }
          return;
        }
        writeGuest(latest);
      });
  }, []);

  const persist = useCallback(
    (next: Player, immediate = false) => {
      playerRef.current = next;
      if (persistDebounceRef.current) {
        clearTimeout(persistDebounceRef.current);
        persistDebounceRef.current = null;
      }
      if (immediate) {
        enqueuePersist();
        return;
      }
      persistDebounceRef.current = setTimeout(() => {
        persistDebounceRef.current = null;
        enqueuePersist();
      }, PERSIST_DEBOUNCE_MS);
    },
    [enqueuePersist],
  );

  const applyPlayer = useCallback(
    (next: Player, immediate = false) => {
      playerRef.current = next;
      setPlayer(next);
      persist(next, immediate);
    },
    [persist],
  );

  const loadAccount = useCallback(async () => {
    const supabase = createClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError && !isBenignAuthError(sessionError)) throw sessionError;

    const user = sessionData.session?.user;
    if (!user) {
      emailRef.current = null;
      setEmail(null);
      const guest = grantAchievements(touchStreak(loadGuestOrCreate())).player;
      applyPlayer(guest);
      return;
    }

    emailRef.current = user.email ?? null;
    setEmail(user.email ?? null);

    const cached = readUserCache(user.id);
    if (cached) {
      playerRef.current = cached;
      setPlayer(cached);
    }

    const { data: row, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    let next = row
      ? rowToPlayer(row as ProfileRow)
      : createPlayer({
          id: user.id,
          username: String(user.user_metadata?.username || user.email?.split("@")[0] || "Apprentice"),
          avatar: String(user.user_metadata?.avatar || "nova"),
        });

    const guest = readGuest();
    const mergeKey = storageKey("merged", user.id);
    if (guest && !window.localStorage.getItem(mergeKey)) {
      next = mergePlayers(guest, next);
      window.localStorage.setItem(mergeKey, "1");
      clearGuest();
    }

    if (row) {
      const remoteGuide = extractGuideProgress(row as ProfileRow);
      if (remoteGuide) importGuideProgress(remoteGuide);
      const remoteNotes = extractLessonNotes(row as ProfileRow);
      if (remoteNotes.length) importLessonNotes(remoteNotes);
    }

    next = grantAchievements(touchStreak(next)).player;
    const { error: saveError } = await supabase
      .from("profiles")
      .upsert(
        playerToRow(next, user.email ?? null, {
          guideProgress: exportGuideProgress(),
          lessonNotes: exportLessonNotes(),
        }),
      );
    if (saveError) throw saveError;
    writeUserCache(next);
    playerRef.current = next;
    setPlayer(next);
    setError(null);
  }, [applyPlayer]);

  const refresh = useCallback(async () => {
    setError(null);
    if (!enabledRef.current) {
      const guest = grantAchievements(touchStreak(loadGuestOrCreate())).player;
      applyPlayer(guest);
      return;
    }
    await loadAccount();
  }, [applyPlayer, loadAccount]);

  useEffect(() => {
    let cancelled = false;
    const enabled = isSupabaseConfigured();
    enabledRef.current = enabled;
    setSupabaseEnabled(enabled);

    (async () => {
      try {
        if (!enabled) {
          const guest = grantAchievements(touchStreak(loadGuestOrCreate())).player;
          if (cancelled) return;
          applyPlayer(guest, true);
          return;
        }

        const supabase = createClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (user) {
          const cached = readUserCache(user.id);
          if (cached && !cancelled) {
            emailRef.current = user.email ?? null;
            setEmail(user.email ?? null);
            playerRef.current = cached;
            setPlayer(cached);
            setReady(true);
          }
        }

        await loadAccount();
      } catch (loadError) {
        if (!cancelled) {
          const message = friendlyError(loadError);
          if (message) setError(message);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyPlayer, loadAccount]);

  useEffect(() => {
    if (!supabaseEnabled || !email) return;
    function syncLearning() {
      enqueuePersist();
    }
    window.addEventListener("devladder:guide-progress-updated", syncLearning);
    window.addEventListener("devladder:notes-updated", syncLearning);
    return () => {
      window.removeEventListener("devladder:guide-progress-updated", syncLearning);
      window.removeEventListener("devladder:notes-updated", syncLearning);
    };
  }, [supabaseEnabled, email, enqueuePersist]);

  useEffect(() => {
    if (!supabaseEnabled || !email) return;
    void heartbeatPresence();
    const timer = window.setInterval(() => {
      void heartbeatPresence();
    }, 45_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void heartbeatPresence();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [supabaseEnabled, email]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      const supabase = createClient();
      const trimmedUsername = username.trim();

      const { data: emailValue, error: profileError } = await supabase.rpc("login_email_for_username", {
        target_username: trimmedUsername,
      });

      if (profileError) {
        throw new Error("Could not look up that username. Run supabase/run-in-sql-editor.sql in Supabase.");
      }

      const email = typeof emailValue === "string" ? emailValue.trim() : "";
      if (!email) {
        throw new Error("No account found for that username. Create one on the sign up page.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const message = signInError.message.toLowerCase();
        if (message.includes("email not confirmed")) {
          throw new Error("Confirm your email first, then log in with your username.");
        }
        if (message.includes("invalid login credentials")) {
          throw new Error("Username or password is incorrect.");
        }
        throw new Error(signInError.message || "Could not log in.");
      }

      setError(null);
      await loadAccount();
    },
    [loadAccount],
  );

  const signUp = useCallback(
    async (nextEmail: string, password: string, username: string, avatar: string) => {
      const supabase = createClient();
      const trimmedUsername = username.trim();
      const trimmedEmail = nextEmail.trim();

      const { data: takenEmail, error: lookupError } = await supabase.rpc("login_email_for_username", {
        target_username: trimmedUsername,
      });
      if (lookupError) {
        throw new Error("Could not check username. Run supabase/run-in-sql-editor.sql in Supabase.");
      }
      if (typeof takenEmail === "string" && takenEmail.trim()) {
        throw new Error("That username is already taken. Log in or pick another.");
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { username: trimmedUsername, avatar },
        },
      });
      if (signUpError) throw signUpError;

      if (data.user?.id && data.session) {
        const starter = createPlayer({
          id: data.user.id,
          username: trimmedUsername,
          avatar,
        });
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(playerToRow(starter, trimmedEmail));
        if (profileError) throw profileError;
      }

      if (!data.session) return { needsConfirmation: true };

      await loadAccount();
      return { needsConfirmation: false };
    },
    [loadAccount],
  );

  const signOut = useCallback(async () => {
    if (enabledRef.current) {
      await createClient().auth.signOut();
    }
    clearGuest();
    emailRef.current = null;
    setEmail(null);
    playerRef.current = null;
    setPlayer(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: { username: string; avatar: string }) => {
      const current = playerRef.current;
      if (!current) return;
      const next = withProfile(current, {
        username: patch.username.trim(),
        avatar: avatarById(patch.avatar).id,
      });
      applyPlayer(next, true);
      if (emailRef.current && enabledRef.current) {
        await createClient().auth.updateUser({
          data: { username: next.username, avatar: next.avatar },
        });
      }
    },
    [applyPlayer],
  );

  const setLocalIdentity = useCallback(
    (username: string, avatar: string) => {
      const current = playerRef.current ?? createPlayer();
      applyPlayer(
        withProfile(current, {
          username,
          avatar: avatarById(avatar).id,
        }),
      );
    },
    [applyPlayer],
  );

  const completeLesson = useCallback(
    (id: string) => {
      const current = playerRef.current;
      const xp = getLesson(id)?.xp ?? 0;
      if (!current) return { awarded: false, xp: 0 };
      const result = markLessonComplete(current, id);
      if (!result.awarded) return { awarded: false, xp: 0 };
      setPlayer(result.player);
      persist(result.player, true);
      pushNotices(current, result.player, result.fresh);
      return { awarded: true, xp };
    },
    [persist, pushNotices],
  );

  const completeChallenge = useCallback(
    (id: string) => {
      const current = playerRef.current;
      const xp = getChallenge(id)?.xp ?? 0;
      if (!current) return { awarded: false, xp: 0 };
      const result = markChallengeComplete(current, id);
      if (!result.awarded) return { awarded: false, xp: 0 };
      setPlayer(result.player);
      persist(result.player, true);
      pushNotices(current, result.player, result.fresh);
      return { awarded: true, xp };
    },
    [persist, pushNotices],
  );

  const completeGameLevel = useCallback(
    (id: string) => {
      const current = playerRef.current;
      if (!current) return { awarded: false, xp: 0 };
      const key = parseGameLevelId(id);
      const xp = key ? xpForGameLevel(key.level, key.difficulty) : 0;
      if (!key) return { awarded: false, xp: 0 };
      const result = markGameLevelComplete(current, id);
      if (!result.awarded) return { awarded: false, xp: 0 };
      setPlayer(result.player);
      persist(result.player, true);
      pushNotices(current, result.player, result.fresh);
      return { awarded: true, xp };
    },
    [persist, pushNotices],
  );

  const claimQuest = useCallback(
    (id: string) => {
      const current = playerRef.current;
      const quest = getQuest(id);
      if (!current || !quest) return { awarded: false, xp: 0 };
      const status = questStatus(quest, current);
      if (!status.done || status.claimed) return { awarded: false, xp: 0 };
      const result = markQuestClaimed(current, id);
      if (!result.awarded) return { awarded: false, xp: 0 };
      setPlayer(result.player);
      persist(result.player, true);
      pushNotices(current, result.player, result.fresh, {
        id: crypto.randomUUID(),
        title: "Quest claimed",
        detail: `${quest.title} · +${quest.xp} XP`,
      });
      return { awarded: true, xp: quest.xp };
    },
    [persist, pushNotices],
  );

  const rememberLesson = useCallback(
    (id: string) => {
      const current = playerRef.current;
      if (!current) return;
      const next = rememberLessonOn(current, id);
      if (next === current) return;
      setPlayer(next);
      persist(next);
    },
    [persist],
  );

  const setSkillDifficulty = useCallback(
    (difficulty: SkillDifficulty) => {
      const current = playerRef.current;
      if (!current || current.skillDifficulty === difficulty) return;
      const next = withProfile(current, { skillDifficulty: difficulty });
      setPlayer(next);
      persist(next);
    },
    [persist],
  );

  const setGameTrack = useCallback(
    (track: GameTrackId) => {
      const current = playerRef.current;
      if (!current || current.gameTrack === track) return;
      const next = withProfile(current, { gameTrack: track });
      setPlayer(next);
      persist(next);
    },
    [persist],
  );

  const setFrontendStack = useCallback(
    (patch: { framework: FrontendFrameworkId; language: FrontendLanguage }) => {
      const current = playerRef.current;
      if (!current) return;
      const next = withProfile(current, {
        frontendFramework: patch.framework,
        frontendLanguage: patch.language,
      });
      setPlayer(next);
      persist(next);
    },
    [persist],
  );

  const setBackendStack = useCallback(
    (patch: { framework: BackendFrameworkId; language: BackendLanguage }) => {
      const current = playerRef.current;
      if (!current) return;
      const next = withProfile(current, {
        backendFramework: patch.framework,
        backendLanguage: patch.language,
      });
      setPlayer(next);
      persist(next);
    },
    [persist],
  );

  const xp = player ? totalXp(player) : 0;
  const level = player ? levelFromXp(xp) : emptyLevel;

  const value = useMemo<PlayerContextValue>(
    () => ({
      player,
      ready,
      error,
      supabaseEnabled,
      email,
      xp,
      level,
      toasts,
      dismissToast,
      signIn,
      signUp,
      signOut,
      updateProfile,
      setLocalIdentity,
      completeLesson,
      completeChallenge,
      completeGameLevel,
      claimQuest,
      rememberLesson,
      setSkillDifficulty,
      setGameTrack,
      setFrontendStack,
      setBackendStack,
      refresh,
    }),
    [
      player,
      ready,
      error,
      supabaseEnabled,
      email,
      xp,
      level,
      toasts,
      dismissToast,
      signIn,
      signUp,
      signOut,
      updateProfile,
      setLocalIdentity,
      completeLesson,
      completeChallenge,
      completeGameLevel,
      claimQuest,
      rememberLesson,
      setSkillDifficulty,
      setGameTrack,
      setFrontendStack,
      setBackendStack,
      refresh,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider.");
  }
  return context;
}
