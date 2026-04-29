-- ============================================================
-- EFFICIO — Supabase Database Setup
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- 1. TASKS TABLE
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  tab text not null check (tab in ('daily', 'weekly', 'monthly', 'yearly')),
  tag_id text,
  due_date date,
  locked boolean default false,
  completed boolean default false,
  completed_at timestamptz,
  penalised boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. SCORES TABLE
create table if not exists public.scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  week_start date not null,
  week_end date not null,
  score integer default 100 check (score >= 0 and score <= 200),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, week_start)
);

-- 3. ACHIEVEMENTS TABLE
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  type text check (type in ('gold', 'platinum', 'streak', 'level')),
  earned_at timestamptz default now()
);

-- 4. TAGS TABLE (user-defined tags)
create table if not exists public.tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#85B07A',
  created_at timestamptz default now()
);

-- 5. SETTINGS TABLE
create table if not exists public.settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  reminder_time text default '23:50',
  sound_enabled boolean default true,
  notifications_enabled boolean default false,
  timezone text default 'UTC',
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — users only see their own data
-- ============================================================

alter table public.tasks enable row level security;
alter table public.scores enable row level security;
alter table public.achievements enable row level security;
alter table public.tags enable row level security;
alter table public.settings enable row level security;

-- Tasks policies
create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

-- Scores policies
create policy "Users can view own scores" on public.scores for select using (auth.uid() = user_id);
create policy "Users can insert own scores" on public.scores for insert with check (auth.uid() = user_id);
create policy "Users can update own scores" on public.scores for update using (auth.uid() = user_id);

-- Achievements policies
create policy "Users can view own achievements" on public.achievements for select using (auth.uid() = user_id);
create policy "Users can insert own achievements" on public.achievements for insert with check (auth.uid() = user_id);

-- Tags policies
create policy "Users can manage own tags" on public.tags for all using (auth.uid() = user_id);

-- Settings policies
create policy "Users can manage own settings" on public.settings for all using (auth.uid() = user_id);

-- ============================================================
-- HELPFUL: auto-update updated_at timestamps
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_tasks_updated before update on public.tasks
  for each row execute procedure public.handle_updated_at();

create trigger on_scores_updated before update on public.scores
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
