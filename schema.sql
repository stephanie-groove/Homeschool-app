-- Reading Path: run this once in Supabase → SQL Editor → New query → Run.

-- 1) One row of saved progress per parent account
create table if not exists public.family_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.family_state enable row level security;

drop policy if exists "own state: read"   on public.family_state;
drop policy if exists "own state: insert" on public.family_state;
drop policy if exists "own state: update" on public.family_state;
drop policy if exists "own state: delete" on public.family_state;
create policy "own state: read"   on public.family_state for select using (auth.uid() = user_id);
create policy "own state: insert" on public.family_state for insert with check (auth.uid() = user_id);
create policy "own state: update" on public.family_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own state: delete" on public.family_state for delete using (auth.uid() = user_id);

-- 2) Coach usage log, used for the daily message limit
create table if not exists public.coach_usage (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists coach_usage_user_time on public.coach_usage (user_id, created_at desc);
alter table public.coach_usage enable row level security;
drop policy if exists "own usage: read"   on public.coach_usage;
drop policy if exists "own usage: insert" on public.coach_usage;
create policy "own usage: read"   on public.coach_usage for select using (auth.uid() = user_id);
create policy "own usage: insert" on public.coach_usage for insert with check (auth.uid() = user_id);

-- 3) Private storage for lesson videos and story photos (max 50 MB each)
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', false, 52428800)
on conflict (id) do nothing;

drop policy if exists "own media: read"   on storage.objects;
drop policy if exists "own media: upload" on storage.objects;
drop policy if exists "own media: update" on storage.objects;
drop policy if exists "own media: delete" on storage.objects;
create policy "own media: read"   on storage.objects for select to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own media: upload" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own media: update" on storage.objects for update to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own media: delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
