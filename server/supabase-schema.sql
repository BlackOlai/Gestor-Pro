-- Supabase initial schema for ConsultIA
-- Run this in Supabase SQL editor (or via CLI) in the 'public' schema

-- Users table (sync with Firebase user)
create table if not exists public.users_app (
  id text primary key,
  email text unique,
  name text,
  created_at timestamptz default now()
);

-- Chats table (1:N user -> chats)
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.users_app(id) on delete set null,
  expert_context jsonb,
  created_at timestamptz default now()
);

-- Chat messages table (1:N chat -> messages)
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chats(id) on delete cascade,
  role text check (role in ('user','assistant','system')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Optional: Activity logs (for auditing/analytics)
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.users_app(id) on delete set null,
  action text not null,
  payload jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.users_app enable row level security;
alter table public.chats enable row level security;
alter table public.chat_messages enable row level security;

-- Policies (assuming anonymous read is not allowed; only owner can read/write)
-- You will authenticate users at the backend using service role; frontend access can be restricted or opened as needed.

-- users_app: a user can select/update only their own row
create policy if not exists "users_select_own" on public.users_app
  for select
  using (auth.uid() = id);

create policy if not exists "users_update_own" on public.users_app
  for update
  using (auth.uid() = id);

-- chats: owner can read/insert rows tied to their user_id
create policy if not exists "chats_read_own" on public.chats
  for select
  using (user_id = auth.uid());

create policy if not exists "chats_insert_own" on public.chats
  for insert
  with check (user_id = auth.uid());

-- chat_messages: allow read/insert only for messages of chats the user owns
create policy if not exists "chat_messages_read_own" on public.chat_messages
  for select
  using (exists (
    select 1 from public.chats c where c.id = chat_id and c.user_id = auth.uid()
  ));

create policy if not exists "chat_messages_insert_own" on public.chat_messages
  for insert
  with check (exists (
    select 1 from public.chats c where c.id = chat_id and c.user_id = auth.uid()
  ));

-- Notes:
-- 1) If you call Supabase from the backend using SERVICE_ROLE, RLS is bypassed automatically for those operations.
-- 2) If you plan to access these tables directly from the frontend with anon key, keep RLS policies enabled.
-- 3) gen_random_uuid() requires pgcrypto extension. Enable it if not enabled:
--    create extension if not exists pgcrypto;
