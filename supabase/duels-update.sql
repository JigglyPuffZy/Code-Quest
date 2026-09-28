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

create policy "Participants can read their duels"
  on public.duel_rooms for select
  using (auth.uid() = challenger_id or auth.uid() = opponent_id);

create policy "Users can create duels as challenger"
  on public.duel_rooms for insert
  with check (auth.uid() = challenger_id);

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
