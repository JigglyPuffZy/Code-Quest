-- DevLadder profile storage.
-- For Supabase SQL Editor, use: supabase/run-in-sql-editor.sql (complete + idempotent)

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

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create index if not exists profiles_xp_idx on public.profiles (xp desc);
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));
create index if not exists profiles_email_idx on public.profiles (email);

alter table public.profiles add column if not exists email text;

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
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
