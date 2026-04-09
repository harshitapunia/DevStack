-- ╔═══════════════════════════════════════════════════════════════╗
-- ║  DevStakes — Supabase Database Schema                       ║
-- ║  Run this in the Supabase SQL Editor                        ║
-- ╚═══════════════════════════════════════════════════════════════╝

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Roadmaps table ─────────────────────────────────────────────
create table if not exists public.roadmaps (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null default 'Untitled Roadmap',
  summary     text default '',
  nodes       jsonb not null default '[]'::jsonb,
  edges       jsonb not null default '[]'::jsonb,
  stats       jsonb not null default '{"total":0,"completed":0,"percentage":0}'::jsonb,
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Indexes ────────────────────────────────────────────────────
create index if not exists idx_roadmaps_user_id on public.roadmaps(user_id);
create index if not exists idx_roadmaps_is_public on public.roadmaps(is_public);

-- ─── Row Level Security ─────────────────────────────────────────
alter table public.roadmaps enable row level security;

-- Users can read their own roadmaps
create policy "Users can view own roadmaps"
  on public.roadmaps for select
  using (auth.uid() = user_id);

-- Anyone can view public roadmaps
create policy "Anyone can view public roadmaps"
  on public.roadmaps for select
  using (is_public = true);

-- Users can insert their own roadmaps
create policy "Users can create roadmaps"
  on public.roadmaps for insert
  with check (auth.uid() = user_id);

-- Users can update their own roadmaps
create policy "Users can update own roadmaps"
  on public.roadmaps for update
  using (auth.uid() = user_id);

-- Users can delete their own roadmaps
create policy "Users can delete own roadmaps"
  on public.roadmaps for delete
  using (auth.uid() = user_id);

-- ─── Auto-update updated_at ─────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_roadmap_updated
  before update on public.roadmaps
  for each row execute function public.handle_updated_at();
