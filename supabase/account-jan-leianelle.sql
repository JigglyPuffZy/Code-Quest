-- ============================================================
-- DevLadder — Jan Leianelle Mari P Delacruz
-- Supabase → SQL → New query → Run ONE section at a time
--
-- Login username: Jan Leianelle
-- Password:      Reina123
--
-- ⚠️ Replace YOUR_EMAIL@example.com with your real recovery email.
-- ⚠️ Delete or redact this file after setup (contains your password).
-- ============================================================

-- ------------------------------------------------------------
-- STEP 1 — Check if account already exists (run first)
-- ------------------------------------------------------------
select
  p.id,
  p.username,
  p.email,
  p.avatar,
  p.xp,
  p.streak,
  p.created_at
from public.profiles p
where lower(p.username) like '%jan%'
   or lower(coalesce(p.email, '')) like '%jan%'
   or lower(coalesce(p.email, '')) like '%delacruz%'
order by p.created_at desc;


-- ------------------------------------------------------------
-- STEP 2A — CREATE account (only if STEP 1 returned no rows)
-- Set your email below, then run this block.
-- ------------------------------------------------------------
/*
create extension if not exists pgcrypto;

do $$
declare
  v_email text := 'YOUR_EMAIL@example.com';
  v_password text := 'Reina123';
  v_username text := 'Jan Leianelle';
  v_full_name text := 'Jan Leianelle Mari P Delacruz';
  v_user_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    crypt(v_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'username', v_username,
      'avatar', 'nova',
      'full_name', v_full_name
    ),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    v_user_id,
    v_email,
    jsonb_build_object(
      'sub', v_user_id::text,
      'email', v_email,
      'email_verified', true
    ),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.profiles (id, username, email, avatar)
  values (v_user_id, v_username, v_email, 'nova')
  on conflict (id) do update
  set
    username = excluded.username,
    email = excluded.email,
    avatar = excluded.avatar,
    updated_at = now();

  raise notice 'Account created. Log in with username: %', v_username;
end $$;

select id, username, email, avatar, xp from public.profiles
where lower(username) = lower('Jan Leianelle');
*/


-- ------------------------------------------------------------
-- STEP 2B — RESET password (if account already exists from signup)
-- Run this if STEP 1 found your account but login fails.
-- ------------------------------------------------------------
/*
create extension if not exists pgcrypto;

update auth.users
set
  encrypted_password = crypt('Reina123', gen_salt('bf')),
  updated_at = now()
where id = (
  select id
  from public.profiles
  where lower(username) = lower('Jan Leianelle')
  limit 1
);

select username, email from public.profiles
where lower(username) = lower('Jan Leianelle');
*/


-- ------------------------------------------------------------
-- STEP 3 — Log in at http://localhost:3000/login
--   Username: Jan Leianelle
--   Password: Reina123
-- ------------------------------------------------------------
