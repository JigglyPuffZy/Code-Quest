-- Optional cloud storage for Learning Planner data.
-- The current app stores these new features in the browser.
-- This migration prepares storage; app-side synchronization is still required.
-- Run in the Supabase SQL Editor. No existing profile data is changed.

begin;

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

commit;
