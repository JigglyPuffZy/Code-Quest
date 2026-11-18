-- Developer Lab: private two-person co-op rooms and atomic role handoffs.
-- Run once in Supabase SQL Editor (also included in all-in-one-setup.sql).
begin;

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
commit;
