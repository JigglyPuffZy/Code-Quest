# Database setup

The application connects to an existing Supabase database using the environment settings described in the project README. No repository query runs automatically.

For a fresh project or schema recovery, copy the **entire SQL block below** into Supabase SQL Editor and run it as the project administrator. It includes profiles, auth helpers, classroom membership, duels, presence, learning-state storage and private Developer Lab co-op functions. This replaces the separate setup and upgrade scripts.

Do not run setup as part of a code cleanup. Review changes before applying this query to an existing database. Browser-local lab, review and tutorial records do not become cloud-synced by running it.

The query retains the existing policies for compatibility. In particular, the legacy public profiles policy also exposes profile email and lesson-note columns. This cleanup does not change those policies or apply any database changes.

```sql
-- DEV LADDER: ALL-IN-ONE SUPABASE DATABASE SETUP
-- Current workspace UI and page tutorials need no additional database tables.
-- Tutorial read status is browser-local; co-op setup is included below.
-- Paste this ENTIRE file into Supabase SQL Editor, then Run once.
-- Re-runnable for the schemas shipped with this repository.
-- Includes profiles/auth helpers, game preferences, classrooms, duels,
-- presence, Realtime publication, and private learning-state storage.
-- Run as the Supabase project database administrator.
-- This script does not connect browser-local features to cloud sync.
-- It does not configure environment variables or deploy the application.
-- Existing profile SELECT policies remain public for compatibility with the
-- current app. This also exposes legacy profile email/lesson_notes columns.
-- New learning_state rows are private to their owner through RLS.
-- If duplicate existing usernames are found, the transaction rolls back.
-- Missing profiles are created; colliding names use user_<UUID> fallbacks.

begin;

-- ============================================================
-- DevLadder — COMPLETE SUPABASE SETUP (paste all, then Run)
-- Dashboard → SQL → New query
-- Safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------
-- A) PROFILES TABLE (all columns used by the app)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null default 'Apprentice',
  email text,
  avatar text not null default 'nova',
  xp integer not null default 0,
  streak integer not null default 0,
  best_streak integer not null default 0,
  last_active date,
  completed_lessons jsonb not null default '[]'::jsonb,
  completed_challenges jsonb not null default '[]'::jsonb,
  completed_game_levels jsonb not null default '[]'::jsonb,
  skill_difficulty text not null default 'mid',
  game_track text not null default 'core',
  frontend_framework text not null default 'react',
  frontend_language text not null default 'typescript',
  backend_framework text not null default 'express',
  backend_language text not null default 'javascript',
  claimed_quests jsonb not null default '[]'::jsonb,
  unlocked_achievements jsonb not null default '[]'::jsonb,
  last_lesson_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add any missing columns on older databases
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar text not null default 'nova';
alter table public.profiles add column if not exists xp integer not null default 0;
alter table public.profiles add column if not exists streak integer not null default 0;
alter table public.profiles add column if not exists best_streak integer not null default 0;
alter table public.profiles add column if not exists last_active date;
alter table public.profiles add column if not exists completed_lessons jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists completed_challenges jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists completed_game_levels jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists skill_difficulty text not null default 'mid';
alter table public.profiles add column if not exists game_track text not null default 'core';
alter table public.profiles add column if not exists frontend_framework text not null default 'react';
alter table public.profiles add column if not exists frontend_language text not null default 'typescript';
alter table public.profiles add column if not exists backend_framework text not null default 'express';
alter table public.profiles add column if not exists backend_language text not null default 'javascript';
alter table public.profiles add column if not exists claimed_quests jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists unlocked_achievements jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists last_lesson_id text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.profiles add column if not exists guide_progress jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists lesson_notes jsonb not null default '[]'::jsonb;

-- ------------------------------------------------------------
-- B) CHECK USERNAME UNIQUENESS (do not rename existing accounts)
-- ------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from public.profiles
    group by lower(username) having count(*) > 1
  ) then
    raise exception 'Duplicate profile usernames exist. Resolve them before rerunning this setup; no changes were committed.';
  end if;
end;
$$;

-- ------------------------------------------------------------
-- C) ROW LEVEL SECURITY + POLICIES
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ------------------------------------------------------------
-- D) INDEXES (leaderboard + username login)
-- ------------------------------------------------------------
create index if not exists profiles_xp_idx on public.profiles (xp desc);
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));
create index if not exists profiles_email_idx on public.profiles (email);

-- ------------------------------------------------------------
-- E) TABLE PERMISSIONS
-- ------------------------------------------------------------
grant usage on schema public to postgres, anon, authenticated, service_role;
grant select, insert, update on table public.profiles to anon, authenticated;
grant all on table public.profiles to postgres, service_role;

-- ------------------------------------------------------------
-- F) AUTO-UPDATE updated_at ON PROFILE CHANGES
-- ------------------------------------------------------------
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- ------------------------------------------------------------
-- G) USERNAME LOGIN RPC
-- Used by: /api/auth/login and /api/auth/forgot-password
-- ------------------------------------------------------------
create or replace function public.login_email_for_username(target_username text)
returns text
language sql
security definer
set search_path = public
as $$
  select email
  from public.profiles
  where lower(username) = lower(trim(target_username))
  limit 1;
$$;

revoke all on function public.login_email_for_username(text) from public;
grant execute on function public.login_email_for_username(text) to anon, authenticated;

-- ------------------------------------------------------------
-- H) AUTO-CREATE PROFILE ON SIGNUP
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, avatar)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1), 'Apprentice'),
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'avatar', ''), 'nova')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    username = coalesce(nullif(public.profiles.username, ''), excluded.username),
    avatar = coalesce(nullif(public.profiles.avatar, ''), excluded.avatar),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ------------------------------------------------------------
-- I) BACKFILL EXISTING AUTH USERS
-- ------------------------------------------------------------

-- 1) Create missing profile rows with a collision-resistant fallback.
do $$
declare
  account record;
  wanted_name text;
begin
  for account in
    select u.* from auth.users u
    where not exists (select 1 from public.profiles p where p.id = u.id)
  loop
    wanted_name := coalesce(nullif(account.raw_user_meta_data ->> 'username', ''),
      nullif(split_part(account.email, '@', 1), ''), 'Apprentice');
    begin
      insert into public.profiles (id, username, email, avatar)
      values (account.id, wanted_name, account.email,
        coalesce(nullif(account.raw_user_meta_data ->> 'avatar', ''), 'nova'));
    exception when unique_violation then
      insert into public.profiles (id, username, email, avatar)
      values (account.id, 'user_' || replace(account.id::text, '-', ''), account.email,
        coalesce(nullif(account.raw_user_meta_data ->> 'avatar', ''), 'nova'))
      on conflict (id) do nothing;
    end;
  end loop;
end;
$$;

-- 2) Fill missing emails (needed for username login + forgot password)
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email = '');

-- Existing usernames are preserved. Missing emails are filled above.

-- ------------------------------------------------------------
-- J) OPTIONAL CHECK (uncomment to verify)
-- ------------------------------------------------------------
-- select id, username, email, xp, streak from public.profiles order by xp desc limit 20;

-- Class mode: teacher creates a room, students join with a code.

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

drop policy if exists "Anyone can read classrooms by code lookup" on public.classrooms;
create policy "Anyone can read classrooms by code lookup"
  on public.classrooms for select using (true);

drop policy if exists "Teachers can create classrooms" on public.classrooms;
create policy "Teachers can create classrooms"
  on public.classrooms for insert with check (auth.uid() = teacher_id);

drop policy if exists "Members can read classroom roster" on public.classroom_members;
create policy "Members can read classroom roster"
  on public.classroom_members for select using (true);

drop policy if exists "Users can join or be added to classes" on public.classroom_members;
create policy "Users can join or be added to classes"
  on public.classroom_members for insert with check (auth.uid() = user_id);

-- Guide progress sync on profiles (optional — app merges with localStorage)
alter table public.profiles add column if not exists guide_progress jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists lesson_notes jsonb not null default '[]'::jsonb;

-- Dev Ladder — duels + online presence (run in Supabase SQL Editor)

alter table public.profiles
  add column if not exists last_seen_at timestamptz;

create index if not exists profiles_last_seen_idx on public.profiles (last_seen_at desc);

create table if not exists public.duel_rooms (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid not null references public.profiles (id) on delete cascade,
  opponent_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'completed', 'declined', 'expired', 'cancelled')),
  challenge_id text not null,
  language text not null,
  winner_id uuid references public.profiles (id),
  challenger_passed boolean,
  opponent_passed boolean,
  challenger_submitted_at timestamptz,
  opponent_submitted_at timestamptz,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz,
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  target_wins integer not null default 1 check (target_wins in (1, 3, 5)),
  round_timer_sec integer not null default 120 check (round_timer_sec in (60, 120, 180, 300)),
  skill_difficulty text not null default 'mid'
    check (skill_difficulty in ('beginner', 'mid', 'expert', 'senior')),
  challenger_score integer not null default 0,
  opponent_score integer not null default 0,
  current_round integer not null default 1,
  round_ends_at timestamptz,
  round_winner_id uuid references public.profiles (id),
  constraint duel_rooms_distinct_players check (challenger_id <> opponent_id)
);

create index if not exists duel_rooms_challenger_idx on public.duel_rooms (challenger_id, status);
create index if not exists duel_rooms_opponent_idx on public.duel_rooms (opponent_id, status);
create index if not exists duel_rooms_status_idx on public.duel_rooms (status, created_at desc);

alter table public.duel_rooms enable row level security;

drop policy if exists "Participants can read their duels" on public.duel_rooms;
create policy "Participants can read their duels"
  on public.duel_rooms for select
  using (auth.uid() = challenger_id or auth.uid() = opponent_id);

drop policy if exists "Users can create duels as challenger" on public.duel_rooms;
create policy "Users can create duels as challenger"
  on public.duel_rooms for insert
  with check (auth.uid() = challenger_id);

drop policy if exists "Participants can update their duels" on public.duel_rooms;
create policy "Participants can update their duels"
  on public.duel_rooms for update
  using (auth.uid() = challenger_id or auth.uid() = opponent_id)
  with check (auth.uid() = challenger_id or auth.uid() = opponent_id);

alter table public.duel_rooms replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'duel_rooms'
  ) then
    alter publication supabase_realtime add table public.duel_rooms;
  end if;
end $$;


alter table public.duel_rooms
  add column if not exists target_wins integer not null default 1 check (target_wins in (1, 3, 5)),
  add column if not exists round_timer_sec integer not null default 120 check (round_timer_sec in (60, 120, 180, 300)),
  add column if not exists skill_difficulty text not null default 'mid'
    check (skill_difficulty in ('beginner', 'mid', 'expert', 'senior')),
  add column if not exists challenger_score integer not null default 0,
  add column if not exists opponent_score integer not null default 0,
  add column if not exists current_round integer not null default 1,
  add column if not exists round_ends_at timestamptz,
  add column if not exists round_winner_id uuid references public.profiles (id);

-- Optional cloud storage for Learning Planner data.
-- The current app stores these new features in the browser.
-- This migration prepares storage; app-side synchronization is still required.
-- Run in the Supabase SQL Editor. No existing profile data is changed.

create table if not exists public.learning_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  guide_progress jsonb not null
    default '{"read":{},"practiced":{},"passedByLesson":{}}'::jsonb
    check (jsonb_typeof(guide_progress) = 'object'),
  lesson_notes jsonb not null default '[]'::jsonb
    check (jsonb_typeof(lesson_notes) = 'array'),
  review_queue jsonb not null default '[]'::jsonb
    check (jsonb_typeof(review_queue) = 'array'),
  practice_log jsonb not null default '[]'::jsonb
    check (jsonb_typeof(practice_log) = 'array'),
  project_work jsonb not null default '{}'::jsonb
    check (jsonb_typeof(project_work) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.learning_state enable row level security;

revoke all on public.learning_state from anon, authenticated;
grant select, insert, update, delete on public.learning_state to authenticated;

drop policy if exists "Owners manage learning state" on public.learning_state;
create policy "Owners manage learning state"
  on public.learning_state
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.set_learning_state_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists learning_state_updated_at on public.learning_state;
create trigger learning_state_updated_at
  before update on public.learning_state
  for each row execute function public.set_learning_state_updated_at();


-- Explicit grants for the existing authenticated app flows.
grant select, insert on public.classrooms to authenticated;
grant select, insert, update on public.classroom_members to authenticated;
grant select, insert, update on public.duel_rooms to authenticated;
grant all on public.classrooms, public.classroom_members, public.duel_rooms,
  public.learning_state to service_role;

-- DEVELOPER LAB CO-OP SETUP
-- Developer Lab: private two-person co-op rooms and atomic role handoffs.

create table if not exists public.lab_coop_rooms (
  id uuid primary key default gen_random_uuid(),
  join_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  creator_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid references auth.users(id) on delete set null,
  driver_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null check (mission_id in ('lab-sum', 'lab-count', 'lab-largest', 'lab-unique', 'lab-discount', 'lab-greet')),
  code text not null default '' check (char_length(code) <= 8000),
  version integer not null default 0,
  round integer not null default 1,
  last_review text not null default '' check (char_length(last_review) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  check (partner_id is null or partner_id <> creator_id),
  check (driver_id = creator_id or driver_id = partner_id)
);
create index if not exists lab_coop_creator_idx on public.lab_coop_rooms(creator_id, created_at desc);
alter table public.lab_coop_rooms enable row level security;
revoke all on public.lab_coop_rooms from anon, authenticated;
grant select on public.lab_coop_rooms to authenticated;
grant all on public.lab_coop_rooms to service_role;
drop policy if exists "Lab participants read their room" on public.lab_coop_rooms;
create policy "Lab participants read their room" on public.lab_coop_rooms
  for select to authenticated
  using ((select auth.uid()) = creator_id or (select auth.uid()) = partner_id);

-- Writes go through these RPCs; direct client writes are not granted.
-- SECURITY DEFINER is needed to claim an unjoined room without making it public.
-- Every RPC explicitly checks auth, membership/role, expiry, and revision.
create or replace function public.lab_create_room(p_mission_id text, p_code text)
returns setof public.lab_coop_rooms
language plpgsql security definer set search_path = ''
as $$
declare caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Sign in to create a co-op room.'; end if;
  if p_code is null or char_length(p_code) > 8000 then raise exception 'Code must be at most 8000 characters.'; end if;
  if p_mission_id is null or p_mission_id not in ('lab-sum', 'lab-count', 'lab-largest', 'lab-unique', 'lab-discount', 'lab-greet') then
    raise exception 'Choose a supported detective mission.';
  end if;
  if (select count(*) from public.lab_coop_rooms where creator_id = caller and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'Room limit reached. Try again later.';
  end if;
  return query insert into public.lab_coop_rooms(creator_id, driver_id, mission_id, code)
    values (caller, caller, p_mission_id, p_code) returning *;
end;
$$;

create or replace function public.lab_join_room(p_join_code text)
returns setof public.lab_coop_rooms
language plpgsql security definer set search_path = ''
as $$
declare caller uuid := auth.uid(); target public.lab_coop_rooms%rowtype;
begin
  if caller is null then raise exception 'Sign in to join a co-op room.'; end if;
  select * into target from public.lab_coop_rooms
    where join_code = upper(trim(p_join_code)) and expires_at > now() for update;
  if not found then raise exception 'Invalid or expired room code.'; end if;
  if caller = target.creator_id or caller = target.partner_id then
    return query select * from public.lab_coop_rooms where id = target.id;
    return;
  end if;
  if target.partner_id is not null then raise exception 'This room already has two learners.'; end if;
  return query update public.lab_coop_rooms set partner_id = caller, version = version + 1, updated_at = now()
    where id = target.id returning *;
end;
$$;

create or replace function public.lab_save_code(p_room_id uuid, p_expected_version integer, p_code text)
returns setof public.lab_coop_rooms
language plpgsql security definer set search_path = ''
as $$
declare caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Sign in to save co-op work.'; end if;
  if p_code is null or char_length(p_code) > 8000 then raise exception 'Code must be at most 8000 characters.'; end if;
  return query update public.lab_coop_rooms set code = p_code, version = version + 1, updated_at = now()
    where id = p_room_id and driver_id = caller
      and (creator_id = caller or partner_id = caller)
      and version = p_expected_version and expires_at > now() returning *;
  if not found then raise exception 'Room changed, expired, or you are not the driver. Load the latest revision before saving.'; end if;
end;
$$;

create or replace function public.lab_review_and_swap(p_room_id uuid, p_expected_version integer, p_note text)
returns setof public.lab_coop_rooms
language plpgsql security definer set search_path = ''
as $$
declare caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Sign in to review co-op work.'; end if;
  if p_note is null or char_length(trim(p_note)) < 10 or char_length(p_note) > 2000 then
    raise exception 'Write a review between 10 and 2000 characters.';
  end if;
  return query update public.lab_coop_rooms
    set driver_id = caller, last_review = trim(p_note), round = round + 1, version = version + 1, updated_at = now()
    where id = p_room_id and partner_id is not null and driver_id <> caller
      and (creator_id = caller or partner_id = caller)
      and version = p_expected_version and expires_at > now() returning *;
  if not found then raise exception 'Room changed, expired, or you are not the reviewer. Load the latest revision.'; end if;
end;
$$;

revoke all on function public.lab_create_room(text, text) from public, anon, authenticated;
revoke all on function public.lab_join_room(text) from public, anon, authenticated;
revoke all on function public.lab_save_code(uuid, integer, text) from public, anon, authenticated;
revoke all on function public.lab_review_and_swap(uuid, integer, text) from public, anon, authenticated;
grant execute on function public.lab_create_room(text, text) to authenticated;
grant execute on function public.lab_join_room(text) to authenticated;
grant execute on function public.lab_save_code(uuid, integer, text) to authenticated;
grant execute on function public.lab_review_and_swap(uuid, integer, text) to authenticated;

notify pgrst, 'reload schema';

-- Ask the Data API to refresh its table/column cache.
notify pgrst, 'reload schema';
commit;

-- Confirm the expected tables exist after the transaction commits.
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'classrooms', 'classroom_members',
    'duel_rooms', 'learning_state', 'lab_coop_rooms')
order by table_name;
```
