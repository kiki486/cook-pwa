-- 在 Supabase Dashboard → SQL Editor 中完整运行一次。
-- 该方案不允许匿名访问；只有 Supabase Auth 中已创建的用户可以读写。

create table if not exists public.cook_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint cook_state_singleton check (id = 'shared')
);

insert into public.cook_state (id, payload)
values ('shared', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.cook_state enable row level security;

revoke all on table public.cook_state from anon;
grant select, update on table public.cook_state to authenticated;

drop policy if exists "authenticated users read shared cook state" on public.cook_state;
create policy "authenticated users read shared cook state"
on public.cook_state
for select
to authenticated
using (id = 'shared');

drop policy if exists "authenticated users update shared cook state" on public.cook_state;
create policy "authenticated users update shared cook state"
on public.cook_state
for update
to authenticated
using (id = 'shared')
with check (id = 'shared');

-- 开启 cook_state 的 Realtime 数据变更广播。
do $$
begin
  alter publication supabase_realtime add table public.cook_state;
exception
  when duplicate_object then null;
end $$;
