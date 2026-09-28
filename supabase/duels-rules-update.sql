-- Dev Ladder — duel rules: series length, round timer, difficulty (run after duels-update.sql)

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
