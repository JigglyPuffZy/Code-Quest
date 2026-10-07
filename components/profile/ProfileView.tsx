"use client";

import { Avatar } from "@/components/player/Avatar";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { RingProgress } from "@/components/ui/RingProgress";
import { usernameError } from "@/lib/username";
import {
  BookOpen,
  Flame,
  Medal,
  ScrollText,
  Swords,
  Target,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink outline-none focus:border-primary/40";

export function ProfileView() {
  const { player, email, xp, level, supabaseEnabled, updateProfile, signOut } = usePlayer();
  const router = useRouter();
  const [username, setUsername] = useState(player?.username ?? "");
  const [avatar, setAvatar] = useState(player?.avatar ?? "nova");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!player) return null;

  const xpPct = level.needed ? (level.into / level.needed) * 100 : 0;

  const stats = [
    { label: "Lessons", value: player.completedLessons.length, icon: BookOpen, soft: "bg-emerald-50", accent: "text-emerald-600" },
    { label: "Challenges", value: player.completedChallenges.length, icon: Swords, soft: "bg-rose-50", accent: "text-rose-600" },
    { label: "Quests", value: player.claimedQuests.length, icon: ScrollText, soft: "bg-violet-50", accent: "text-violet-600" },
    { label: "Badges", value: player.unlockedAchievements.length, icon: Medal, soft: "bg-amber-50", accent: "text-amber-600" },
    { label: "Streak", value: player.streak, icon: Flame, soft: "bg-orange-50", accent: "text-orange-600" },
    { label: "Best streak", value: player.bestStreak, icon: Target, soft: "bg-sky-50", accent: "text-sky-600" },
  ];

  async function save() {
    const problem = usernameError(username);
    setError(problem);
    setMessage("");
    if (problem) return;
    setSaving(true);
    try {
      await updateProfile({ username, avatar });
      setMessage("Profile saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile hero */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface-2">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Avatar id={player.avatar} size="lg" className="!h-16 !w-16 !text-2xl" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Your profile</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">{player.username}</h1>
              <p className="mt-1 text-sm text-muted">
                Level {level.level} · {level.title} rank
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:ml-auto">
            <div className="text-right">
              <p className="text-xs font-medium text-muted">Total XP</p>
              <p className="text-xl font-bold tabular-nums text-ink">{xp.toLocaleString()}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                {level.into} / {level.needed} to level {level.level + 1}
              </p>
            </div>
            <RingProgress value={xpPct} size={72} stroke={5}>
              <div className="text-center">
                <p className="text-lg font-bold leading-none text-primary">{level.level}</p>
                <p className="text-[8px] font-bold uppercase text-muted">lvl</p>
              </div>
            </RingProgress>
          </div>
        </div>

        {!supabaseEnabled ? (
          <div className="border-t border-line bg-surface px-6 py-3">
            <p className="text-xs text-muted">
              <span className="font-semibold text-ink">Demo mode.</span> Progress is saved on this device only — create an account to sync across devices.
            </p>
          </div>
        ) : email ? (
          <div className="border-t border-line bg-surface px-6 py-3">
            <p className="text-xs text-muted">
              Signed in as <span className="font-medium text-ink">{player.username}</span>
            </p>
          </div>
        ) : null}
      </section>

      {/* Stats */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-ink">Your progress</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-line bg-surface p-4 text-center"
            >
              <span className={`mx-auto grid h-9 w-9 place-items-center rounded-lg ${stat.soft}`}>
                <stat.icon size={16} className={stat.accent} />
              </span>
              <p className="mt-2 text-xl font-bold tabular-nums text-ink">{stat.value}</p>
              <p className="mt-0.5 text-[11px] font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Edit */}
      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="mb-5 flex items-center gap-2">
          <Trophy size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-ink">Customize</h2>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted">Display name</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              maxLength={20}
              placeholder="How others see you"
            />
            <p className="mt-1.5 text-[11px] text-muted">This is your name, not your rank. Ranks like &ldquo;{level.title}&rdquo; come from XP.</p>
          </label>

          <div>
            <span className="mb-2 block text-xs font-medium text-muted">Avatar</span>
            <AvatarPicker value={avatar} onChange={setAvatar} size="md" />
          </div>

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {message ? <p className="text-sm font-medium text-ok">{message}</p> : null}

          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <Button onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => void signOut().then(() => {
                router.push("/login");
                router.refresh();
              })}
            >
              Log out
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
