"use client";

import { usePlayer } from "@/components/player/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ClassroomRow = {
  id: string;
  code: string;
  name: string;
  teacher_id: string;
  created_at: string;
};

type MemberRow = {
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: { username: string } | null;
};

export default function ClassPage() {
  const { player, email, supabaseEnabled } = usePlayer();
  const [className, setClassName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [myClass, setMyClass] = useState<ClassroomRow | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function loadClass() {
    if (!player?.id || !supabaseEnabled) return;
    const supabase = createClient();
    const { data: membership } = await supabase
      .from("classroom_members")
      .select("classroom_id, role")
      .eq("user_id", player.id)
      .maybeSingle();
    if (!membership) {
      setMyClass(null);
      setMembers([]);
      return;
    }
    const { data: room } = await supabase
      .from("classrooms")
      .select("*")
      .eq("id", membership.classroom_id)
      .maybeSingle();
    setMyClass(room as ClassroomRow | null);
    const { data: roster } = await supabase
      .from("classroom_members")
      .select("user_id, role, joined_at, profiles(username)")
      .eq("classroom_id", membership.classroom_id);
    setMembers((roster as unknown as MemberRow[]) ?? []);
  }

  useEffect(() => {
    void loadClass();
  }, [player?.id, supabaseEnabled]);

  async function createClass() {
    if (!player?.id || !className.trim()) return;
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      const { data: room, error } = await supabase
        .from("classrooms")
        .insert({ name: className.trim(), code, teacher_id: player.id })
        .select("*")
        .single();
      if (error) throw error;
      await supabase.from("classroom_members").insert({
        classroom_id: room.id,
        user_id: player.id,
        role: "teacher",
      });
      setMessage(`Class created! Share code: ${code}`);
      await loadClass();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not create class. Run supabase/classrooms-update.sql first.");
    } finally {
      setBusy(false);
    }
  }

  async function joinClass() {
    if (!player?.id || !joinCode.trim()) return;
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { data: room, error: findError } = await supabase
        .from("classrooms")
        .select("*")
        .eq("code", joinCode.trim().toUpperCase())
        .maybeSingle();
      if (findError || !room) throw new Error("Invalid class code.");
      await supabase.from("classroom_members").upsert({
        classroom_id: room.id,
        user_id: player.id,
        role: "student",
      });
      setMessage(`Joined ${room.name}!`);
      await loadClass();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not join class.");
    } finally {
      setBusy(false);
    }
  }

  if (!supabaseEnabled) {
    return (
      <p className="text-sm text-muted">
        Class mode needs Supabase.{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>{" "}
        after your teacher sets up the database.
      </p>
    );
  }

  if (!email) {
    return (
      <p className="text-sm text-muted">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>{" "}
        to create or join a class.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">For teachers &amp; students</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Class mode</h1>
        <p className="mt-2 text-sm text-muted">
          Teachers create a class and share a code. Students join and show up on the roster.
        </p>
      </header>

      {message ? (
        <p className="mb-4 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
          {message}
        </p>
      ) : null}

      {myClass ? (
        <article className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-start gap-3">
            <GraduationCap className="size-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold">{myClass.name}</h2>
              <p className="text-sm text-muted">
                Class code: <span className="font-mono font-bold text-ink">{myClass.code}</span>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
              <Users size={12} />
              Roster ({members.length})
            </p>
            <ul className="divide-y divide-line rounded-xl border border-line">
              {members.map((m) => (
                <li key={m.user_id} className="flex items-center justify-between px-3 py-2.5 text-sm">
                  <span className="font-medium">{m.profiles?.username ?? "Student"}</span>
                  <span className="text-xs capitalize text-muted">{m.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-bold">Create a class</h2>
            <p className="mt-1 text-sm text-muted">For teachers — get a join code for students.</p>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Class name"
              className="mt-3 w-full rounded-xl border border-line px-3 py-2 text-sm"
            />
            <Button className="mt-3 w-full" disabled={busy} onClick={() => void createClass()}>
              Create class
            </Button>
          </article>
          <article className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-bold">Join a class</h2>
            <p className="mt-1 text-sm text-muted">Enter the code from your teacher.</p>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="mt-3 w-full rounded-xl border border-line px-3 py-2 font-mono text-sm uppercase"
            />
            <Button className="mt-3 w-full" variant="ghost" disabled={busy} onClick={() => void joinClass()}>
              Join class
            </Button>
          </article>
        </div>
      )}
    </div>
  );
}
