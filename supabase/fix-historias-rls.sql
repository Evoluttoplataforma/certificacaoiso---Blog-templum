-- Garante que visitante anônimo pode ENVIAR história (sempre como 'pending')
alter table public.blog_templum_historias enable row level security;
grant insert on public.blog_templum_historias to anon;
drop policy if exists "hist_anon_insert" on public.blog_templum_historias;
create policy "hist_anon_insert" on public.blog_templum_historias
  for insert to anon with check (status = 'pending');
