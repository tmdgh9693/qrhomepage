-- Run this once in Supabase SQL Editor.
-- This table is separate from survey responses and is read-only for anon/authenticated users.

create table if not exists public.project_keepalive (
  id smallint primary key,
  purpose text not null default 'project keepalive'
);

insert into public.project_keepalive (id, purpose)
values (1, 'project keepalive')
on conflict (id) do nothing;

alter table public.project_keepalive enable row level security;

revoke all on table public.project_keepalive from anon, authenticated;
grant select on table public.project_keepalive to anon, authenticated;

drop policy if exists "Allow keepalive read" on public.project_keepalive;

create policy "Allow keepalive read"
on public.project_keepalive
for select
to anon, authenticated
using (true);
