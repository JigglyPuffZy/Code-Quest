-- ============================================================
-- CodeQuest — GAME TRACKS UPDATE (new query file)
-- Run in Supabase SQL Editor after run-in-sql-editor.sql
-- Safe to run multiple times.
-- ============================================================

-- Game progress (if not added yet)
alter table public.profiles add column if not exists completed_game_levels jsonb not null default '[]'::jsonb;

-- Skill difficulty (if not added yet)
alter table public.profiles add column if not exists skill_difficulty text not null default 'mid';

-- Game track + stack preferences
alter table public.profiles add column if not exists game_track text not null default 'core';
alter table public.profiles add column if not exists frontend_framework text not null default 'react';
alter table public.profiles add column if not exists frontend_language text not null default 'typescript';
alter table public.profiles add column if not exists backend_framework text not null default 'express';
alter table public.profiles add column if not exists backend_language text not null default 'javascript';

-- Optional: constrain known values (skip if you prefer loose text)
-- alter table public.profiles add constraint profiles_game_track_check
--   check (game_track in ('core', 'frontend', 'backend'));

comment on column public.profiles.game_track is 'Active game campaign: core | frontend | backend';
comment on column public.profiles.frontend_framework is 'react | vue | angular | svelte';
comment on column public.profiles.frontend_language is 'javascript | typescript';
comment on column public.profiles.backend_framework is 'express | django | spring | fastapi';
comment on column public.profiles.backend_language is 'javascript | python | java';
