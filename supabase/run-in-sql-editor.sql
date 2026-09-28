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

-- ------------------------------------------------------------
-- B) FIX DUPLICATE USERNAMES (required before unique index)
-- ------------------------------------------------------------
with ranked as (
  select
    id,
    username,
    row_number() over (
      partition by lower(trim(username))
      order by created_at nulls last, id
    ) as rn
  from public.profiles
)
update public.profiles p
set username = p.username || '_' || left(replace(p.id::text, '-', ''), 4)
from ranked r
where p.id = r.id
  and r.rn > 1;

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

-- 1) Create missing profile rows
insert into public.profiles (id, username, email, avatar)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'username', ''), split_part(u.email, '@', 1), 'Apprentice'),
  u.email,
  coalesce(nullif(u.raw_user_meta_data ->> 'avatar', ''), 'nova')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 2) Fill missing emails (needed for username login + forgot password)
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email = '');

-- 3) Fill missing usernames from auth metadata
update public.profiles p
set username = coalesce(nullif(u.raw_user_meta_data ->> 'username', ''), split_part(u.email, '@', 1), 'Apprentice')
from auth.users u
where p.id = u.id
  and (p.username is null or p.username = '' or p.username = 'Apprentice');

-- ------------------------------------------------------------
-- J) OPTIONAL CHECK (uncomment to verify)
-- ------------------------------------------------------------
-- select id, username, email, xp, streak from public.profiles order by xp desc limit 20;
