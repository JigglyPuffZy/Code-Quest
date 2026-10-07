-- Class mode: teacher creates a room, students join with a code.
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.classroom_members (
  classroom_id uuid not null references public.classrooms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('teacher', 'student')),
  joined_at timestamptz not null default now(),
  primary key (classroom_id, user_id)
);

alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;

create policy "Anyone can read classrooms by code lookup"
  on public.classrooms for select using (true);

create policy "Teachers can create classrooms"
  on public.classrooms for insert with check (auth.uid() = teacher_id);

create policy "Members can read classroom roster"
  on public.classroom_members for select using (true);

create policy "Users can join or be added to classes"
  on public.classroom_members for insert with check (auth.uid() = user_id);

-- Guide progress sync on profiles (optional — app merges with localStorage)
alter table public.profiles add column if not exists guide_progress jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists lesson_notes jsonb not null default '[]'::jsonb;
