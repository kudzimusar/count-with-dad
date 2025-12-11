-- Initial Schema Migration for Count to 100 App
-- This migration creates all necessary tables, functions, triggers, and RLS policies

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table with comprehensive child and parent data
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  child_name text not null,
  child_age integer not null check (child_age >= 2 and child_age <= 12),
  child_avatar text not null default '🦁',
  child_gender text check (child_gender in ('boy', 'girl', 'other', 'prefer-not-to-say')),
  parent_email text,
  parent_relationship text check (parent_relationship in ('parent', 'guardian', 'teacher', 'caregiver', 'other')),
  registered_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Progress tracking table
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  highest_count integer default 0,
  stars integer default 0,
  puzzle_level integer default 1,
  math_level integer default 1,
  challenge_level integer default 1,
  puzzles_solved integer default 0,
  math_solved integer default 0,
  unlocked_puzzle_levels integer default 1,
  unlocked_math_levels integer default 1,
  completed_numbers integer[] default array[]::integer[],
  correct_answers_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Session history for detailed tracking
create table if not exists public.session_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date timestamptz not null default now(),
  duration integer not null, -- in seconds
  screen text not null check (screen in ('counting', 'puzzle', 'math', 'parent')),
  mode text check (mode in ('order', 'challenge', 'free')),
  score integer not null default 0,
  created_at timestamptz default now()
);

-- Feedback collection
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('difficulty', 'bug', 'suggestion', 'feature', 'other')),
  message text not null,
  context jsonb, -- For storing additional context like level, screen, etc.
  created_at timestamptz default now()
);

-- Analytics events for detailed tracking
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_name text not null,
  event_data jsonb, -- Flexible storage for event-specific data
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.session_history enable row level security;
alter table public.feedback enable row level security;
alter table public.analytics_events enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view own progress" on public.progress;
drop policy if exists "Users can insert own progress" on public.progress;
drop policy if exists "Users can update own progress" on public.progress;
drop policy if exists "Users can view own sessions" on public.session_history;
drop policy if exists "Users can insert own sessions" on public.session_history;
drop policy if exists "Users can view own feedback" on public.feedback;
drop policy if exists "Users can insert feedback" on public.feedback;
drop policy if exists "Users can insert analytics" on public.analytics_events;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- RLS Policies for progress
create policy "Users can view own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress for update
  using (auth.uid() = user_id);

-- RLS Policies for session_history
create policy "Users can view own sessions"
  on public.session_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.session_history for insert
  with check (auth.uid() = user_id);

-- RLS Policies for feedback
create policy "Users can view own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert feedback"
  on public.feedback for insert
  with check (true); -- Allow any authenticated user to submit feedback

-- RLS Policies for analytics_events
create policy "Users can insert analytics"
  on public.analytics_events for insert
  with check (true); -- Allow any authenticated user to track events

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing triggers if they exist
drop trigger if exists profiles_updated_at on public.profiles;
drop trigger if exists progress_updated_at on public.progress;
drop trigger if exists on_auth_user_created on auth.users;

-- Triggers for updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger progress_updated_at
  before update on public.progress
  for each row execute function public.handle_updated_at();

-- Function to create profile and progress on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- This will be populated later by the app during onboarding
  insert into public.profiles (user_id, child_name, child_age, child_avatar)
  values (new.id, 'New User', 5, '🦁')
  on conflict (user_id) do nothing;
  
  insert into public.progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Indexes for performance
create index if not exists idx_session_history_user_date on public.session_history(user_id, date desc);
create index if not exists idx_analytics_events_user on public.analytics_events(user_id, created_at desc);
create index if not exists idx_feedback_created on public.feedback(created_at desc);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

