-- ============================================================================
-- Blog Templum — Fase 3: iscas, banners, histórias, leads
-- Rodar no SQL Editor (projeto yfpdrckyuxltvznqfqgh). Idempotente.
-- ============================================================================

-- ---------- Iscas (materiais p/ baixar) ----------
create table if not exists public.blog_templum_iscas (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  type        text,                 -- ebook, planilha, webinar...
  cta         text,
  file_url    text,
  description text,
  downloads   integer default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ---------- Banners ----------
create table if not exists public.blog_templum_banners (
  id         uuid primary key default gen_random_uuid(),
  title      text,
  image_url  text,
  link_url   text,
  position   text default 'sidebar', -- home, sidebar, artigo...
  active     boolean default true,
  created_at timestamptz default now()
);

-- ---------- Histórias / cases ----------
create table if not exists public.blog_templum_historias (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text,
  author_name text,
  status      text not null default 'pending' check (status in ('pending','approved')),
  created_at  timestamptz default now()
);

-- ---------- Leads (captura) ----------
create table if not exists public.blog_templum_leads (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text not null,
  phone      text,
  source     text,
  isca_id    uuid references public.blog_templum_iscas(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists blog_templum_leads_created_idx on public.blog_templum_leads (created_at desc);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.blog_templum_iscas     enable row level security;
alter table public.blog_templum_banners   enable row level security;
alter table public.blog_templum_historias enable row level security;
alter table public.blog_templum_leads     enable row level security;

-- Iscas: público lê ativas; logado gerencia
drop policy if exists "iscas_public_read" on public.blog_templum_iscas;
create policy "iscas_public_read" on public.blog_templum_iscas for select using (active = true);
drop policy if exists "iscas_auth_all" on public.blog_templum_iscas;
create policy "iscas_auth_all" on public.blog_templum_iscas for all to authenticated using (true) with check (true);

-- Banners: público lê ativos; logado gerencia
drop policy if exists "banners_public_read" on public.blog_templum_banners;
create policy "banners_public_read" on public.blog_templum_banners for select using (active = true);
drop policy if exists "banners_auth_all" on public.blog_templum_banners;
create policy "banners_auth_all" on public.blog_templum_banners for all to authenticated using (true) with check (true);

-- Histórias: público lê aprovadas; anônimo pode enviar (pending); logado gerencia
drop policy if exists "hist_public_read" on public.blog_templum_historias;
create policy "hist_public_read" on public.blog_templum_historias for select using (status = 'approved');
drop policy if exists "hist_anon_insert" on public.blog_templum_historias;
create policy "hist_anon_insert" on public.blog_templum_historias for insert to anon with check (status = 'pending');
drop policy if exists "hist_auth_all" on public.blog_templum_historias;
create policy "hist_auth_all" on public.blog_templum_historias for all to authenticated using (true) with check (true);

-- Leads: anônimo cria; só logado lê/gerencia
drop policy if exists "leads_anon_insert" on public.blog_templum_leads;
create policy "leads_anon_insert" on public.blog_templum_leads for insert to anon with check (true);
drop policy if exists "leads_auth_all" on public.blog_templum_leads;
create policy "leads_auth_all" on public.blog_templum_leads for all to authenticated using (true) with check (true);
