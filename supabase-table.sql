-- One-time setup (HUMAN STEP, DK): run in the Supabase SQL editor of the shared
-- training project zpblcnhnndhajekljide (same project as src/integrations/supabase/client.ts).
-- Template: mes-training-pack skill, PACK_CONVENTIONS.md §Publishing recipe step 6.
-- Until this table exists the app still works — submissions fall back to localStorage.

create table public.team_submissions_pharma (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  team_name text not null,
  submission_time timestamptz not null,
  responses jsonb not null
);
alter table public.team_submissions_pharma enable row level security;
create policy "anon_insert_pharma" on public.team_submissions_pharma
  for insert to anon, authenticated with check (true);
create policy "anon_select_pharma" on public.team_submissions_pharma
  for select to anon, authenticated using (true);
