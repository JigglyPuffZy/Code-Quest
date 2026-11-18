"use client";
import { usePlayer } from "@/components/player/PlayerProvider";
import { labButton, labInput, labPanel } from "@/components/lab/LabShell";
import { detectiveMissions, getLabMission } from "@/lib/lab/missions";
import { coopError, coopRole, type CoopRoom } from "@/lib/lab/coop";
import { runVisibleTests } from "@/lib/execute/client";
import { createClient } from "@/lib/supabase/client";
import { storageKey } from "@/lib/storage-keys";
import { useLearningClock } from "@/lib/learning/client";
import type { GradeResponse } from "@/lib/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function CoopQuest() {
  const { email, supabaseEnabled } = usePlayer();
  if (!email || !supabaseEnabled) return <section className={labPanel}><h2 className="text-xl font-bold">Code together, review together.</h2><p className="mt-3 text-sm text-muted">Co-op rooms require two signed-in accounts and the Developer Lab Supabase migration. Solo lab missions work without a connection.</p><Link href="/login" className={`${labButton} mt-4`}>Sign in for co-op</Link><Link href="/lab/detective" className={`${labButton} ml-2 mt-4`}>Try a solo mission</Link></section>;
  return <CoopSession />;
}

function CoopSession() {
  const { player } = usePlayer();
  const id = player!.id;
  const lastRoomKey = storageKey("lab-coop", id);
  const [roomId, setRoomId] = useState(() => { try { return window.localStorage.getItem(lastRoomKey) ?? ""; } catch { return ""; } });
  const [room, setRoom] = useState<CoopRoom | null>(null);
  const [missionId, setMissionId] = useState(detectiveMissions[0].id);
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState("");
  const [draftVersion, setDraftVersion] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [review, setReview] = useState("");
  const [testResult, setTestResult] = useState<{ result: GradeResponse; code: string; version: number } | null>(null);
  const testController = useRef<AbortController | null>(null);
  const now = useLearningClock();

  useEffect(() => {
    if (!roomId) return;
    let disposed = false;
    let loading = false;
    async function refresh() {
      if (loading || document.visibilityState !== "visible") return;
      loading = true;
      try {
        const { data, error } = await createClient().from("lab_coop_rooms").select("*").eq("id", roomId).maybeSingle();
        if (disposed) return;
        if (error) setMessage(coopError(error.message));
        else if (data) setRoom((current) => {
          const incoming = data as CoopRoom;
          if (current && current.id !== roomId) return current;
          return current && current.version > incoming.version ? current : incoming;
        });
        else setMessage("Room not found or your account is not a participant. Join using its code.");
      } catch (issue) { if (!disposed) setMessage(issue instanceof Error ? issue.message : "Could not refresh the room."); }
      finally { loading = false; }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5000);
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { disposed = true; window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, [roomId]);
  useEffect(() => () => { testController.current?.abort(); }, []);

  const mission = room ? getLabMission(room.mission_id) : undefined;
  const role = room ? coopRole(room, id) : "outside";
  const code = room ? (dirty ? draft : room.code) : "";
  const expired = room ? Date.parse(room.expires_at) <= now : false;
  const conflict = room && dirty && draftVersion !== room.version;
  const currentResult = testResult && testResult.code === code && testResult.version === room?.version ? testResult.result : null;

  function openRoom(next: CoopRoom) {
    testController.current?.abort();
    setRoom(next); setRoomId(next.id); setDirty(false); setTestResult(null); setReview("");
    try { window.localStorage.setItem(lastRoomKey, next.id); } catch { /* Session remains usable without storage. */ }
  }
  async function connect(join: boolean) {
    setBusy(true); setMessage("");
    try {
      const client = createClient();
      const selected = getLabMission(missionId)!;
      const { data, error } = join
        ? await client.rpc("lab_join_room", { p_join_code: joinCode.trim().toUpperCase() })
        : await client.rpc("lab_create_room", { p_mission_id: missionId, p_code: selected.exercise.starterCode });
      if (error) throw new Error(coopError(error.message));
      if (!data?.[0]) throw new Error("The room could not be opened.");
      openRoom(data[0] as CoopRoom);
      setMessage(join ? "Joined. The driver writes code; the reviewer checks it." : "Room created. Share the room code with your partner.");
    } catch (issue) { setMessage(issue instanceof Error ? issue.message : "Could not open the room."); }
    finally { setBusy(false); }
  }
  async function save(swap: boolean) {
    if (!room) return;
    setBusy(true); setMessage("");
    try {
      const { data, error } = swap
        ? await createClient().rpc("lab_review_and_swap", { p_room_id: room.id, p_expected_version: room.version, p_note: review.trim() })
        : await createClient().rpc("lab_save_code", { p_room_id: room.id, p_expected_version: dirty ? draftVersion : room.version, p_code: code });
      if (error) throw new Error(coopError(error.message));
      if (!data?.[0]) throw new Error("The room changed. Load the latest revision and retry.");
      openRoom(data[0] as CoopRoom);
      setMessage(swap ? "Review saved. Roles swapped for the next turn." : "Code saved to the shared room.");
    } catch (issue) { setMessage(issue instanceof Error ? issue.message : "Could not update the room."); }
    finally { setBusy(false); }
  }
  async function testCode() {
    if (!mission || !room || testController.current) return;
    const controller = new AbortController(); testController.current = controller;
    const testedCode = code; const version = room.version;
    setBusy(true); setMessage("");
    try {
      const result = await runVisibleTests("challenge", mission.id, testedCode, undefined, undefined, controller.signal);
      if (!controller.signal.aborted) setTestResult({ result, code: testedCode, version });
    } catch (issue) { if (!controller.signal.aborted) setMessage(issue instanceof Error ? issue.message : "The sandbox could not run the tests."); }
    finally { if (testController.current === controller) { testController.current = null; setBusy(false); } }
  }

  return <div className="space-y-5"><section className={labPanel}><h2 className="text-2xl font-bold">Co-op coding quest</h2><p className="mt-3 text-sm leading-6 text-muted">Two learners, one codebase. Only the driver can save code. The reviewer tests the shared revision and leaves feedback before taking the next turn. Rooms sync every five seconds and expire after seven days.</p>
    <div className="mt-5 grid gap-5 md:grid-cols-2"><div><label htmlFor="coop-mission" className="text-sm font-semibold">Create a room for</label><select id="coop-mission" value={missionId} onChange={(event) => setMissionId(event.target.value)} className={`${labInput} mt-2`}>{detectiveMissions.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><button type="button" disabled={busy || dirty} onClick={() => void connect(false)} className={`${labButton} mt-3`}>Create private room</button></div><div><label htmlFor="coop-code" className="text-sm font-semibold">Join with a room code</label><input id="coop-code" maxLength={12} className={`${labInput} mt-2 font-mono uppercase`} value={joinCode} onChange={(event) => setJoinCode(event.target.value)} autoComplete="off" /><button type="button" disabled={busy || dirty || !/^[A-Z0-9]{12}$/i.test(joinCode.trim())} onClick={() => void connect(true)} className={`${labButton} mt-3`}>Join room</button></div></div>
    <p role="status" className="mt-4 text-sm text-primary">{message}</p>
  </section>
  {room && mission ? <section className={`${labPanel} space-y-4`}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-sm font-bold text-primary">ROOM {room.join_code}</p><h3 className="mt-2 text-xl font-bold">{mission.title}</h3></div><p className="rounded-full border border-line px-3 py-2 text-xs font-semibold">You are the {role} · Turn {room.round} · Revision {room.version}</p></div><p className="text-sm text-muted">{room.partner_id ? "Both learners have joined this room." : "Waiting for a partner to join with the code above."} {expired ? "This room has expired. Create a new one to continue." : ""}</p><p className="text-sm leading-6">{mission.exercise.prompt}</p>
    <label htmlFor="coop-editor" className="block text-sm font-semibold">{role === "driver" ? "Your shared code" : "Driver's shared code (read only)"}</label><textarea id="coop-editor" maxLength={8000} spellCheck={false} readOnly={role !== "driver" || expired} className={`${labInput} min-h-72 font-mono`} value={code} onChange={(event) => { if (!dirty) setDraftVersion(room.version); setDraft(event.target.value); setDirty(true); setTestResult(null); }} />
    <p className="text-xs text-muted">{dirty ? "Your draft has unsaved changes. Save before your partner reviews it." : "Showing the latest shared code."}</p>{conflict ? <p role="alert" className="text-sm text-danger">A newer room revision exists. Your draft is preserved. Copy it before loading the shared revision; stale saves are rejected.</p> : null}
    <div className="flex flex-wrap gap-2">{role === "driver" ? <button type="button" className={labButton} disabled={busy || !dirty || Boolean(conflict) || expired} onClick={() => void save(false)}>Save shared code</button> : null}<button type="button" className={labButton} disabled={busy || expired} onClick={() => void testCode()}>Run mission tests</button>{dirty ? <button type="button" className={labButton} disabled={busy} onClick={() => { setDirty(false); setTestResult(null); }}>Discard draft and load shared revision</button> : null}</div>
    {currentResult ? <div aria-live="polite" className="space-y-2 rounded-xl border border-line p-4"><p className="font-semibold">{currentResult.passed ? "All mission tests passed" : "Some tests failed"}</p>{currentResult.tests.map((test, index) => <div key={index} className="text-xs"><p className={test.passed ? "text-ok" : "text-danger"}>{test.passed ? "✓" : "×"} {test.name}</p>{!test.passed ? <pre className="mt-1 overflow-auto whitespace-pre-wrap">Expected: {test.expected}{"\n"}Actual: {test.actual}</pre> : null}</div>)}</div> : null}
    {room.last_review ? <blockquote className="rounded-xl border border-line bg-surface-2 p-4 text-sm"><p className="mb-2 font-semibold">Latest review</p>{room.last_review}</blockquote> : null}
    {role === "reviewer" && !expired ? <div><label htmlFor="coop-review" className="block text-sm font-semibold">Review the shared revision</label><textarea id="coop-review" maxLength={2000} value={review} onChange={(event) => setReview(event.target.value)} placeholder="Explain what works, an edge case you checked, and what you will improve next." className={`${labInput} mt-2 min-h-28`} /><button type="button" disabled={busy || review.trim().length < 10 || !currentResult?.passed || dirty} className={`${labButton} mt-3`} onClick={() => void save(true)}>Approve review and take driver role</button><p className="mt-2 text-xs text-muted">Run tests on the shared revision successfully before approving. Review approval is peer feedback and does not award XP or certify the solution.</p></div> : null}
  </section> : null}</div>;
}
