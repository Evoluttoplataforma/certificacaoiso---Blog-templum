-- ============================================================================
-- Blog Templum / certificacaoiso.com.br — schema (projeto Supabase dedicado)
-- Prefixo de todas as tabelas: blog_templum_
-- Rodar no SQL Editor do Supabase. Idempotente (IF NOT EXISTS / OR REPLACE).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Categorias
-- ---------------------------------------------------------------------------
create table if not exists public.blog_templum_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  color       text,
  icon        text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Posts (conteúdo = markdown no campo content)
-- ---------------------------------------------------------------------------
create table if not exists public.blog_templum_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  content          text,                       -- markdown
  excerpt          text,
  tldr             text,                        -- "Resposta rápida" (answer-first)
  faq              jsonb default '[]'::jsonb,   -- [{pergunta, resposta}]
  featured_image   text,
  author_name      text default 'Equipe Templum',
  category_id      uuid references public.blog_templum_categories(id) on delete set null,
  category_name    text,                        -- desnormalizado (categoria primária)
  tags             text[] default '{}',         -- categorias extras
  status           text not null default 'draft' check (status in ('draft','published')),
  published_at     timestamptz,
  seo_title        text,
  seo_description  text,
  seo_keywords     text[] default '{}',
  og_image         text,
  canonical_url    text,
  reading_time_min integer,
  wp_id            integer,                      -- rastreio da migração WordPress
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
create index if not exists blog_templum_posts_status_idx     on public.blog_templum_posts (status);
create index if not exists blog_templum_posts_published_idx  on public.blog_templum_posts (published_at desc);
create index if not exists blog_templum_posts_category_idx   on public.blog_templum_posts (category_id);

-- ---------------------------------------------------------------------------
-- Colaboradores (liga auth.users → papel). "Adicionar colaborador" = inserir aqui.
-- ---------------------------------------------------------------------------
create table if not exists public.blog_templum_members (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- Comentários (opcional) — anônimo cria "pending"; admin aprova no CMS.
-- ---------------------------------------------------------------------------
create table if not exists public.blog_templum_comments (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid references public.blog_templum_posts(id) on delete cascade,
  author_name  text not null,
  author_email text,
  content      text not null,
  status       text not null default 'pending' check (status in ('pending','approved','spam')),
  created_at   timestamptz default now()
);
create index if not exists blog_templum_comments_post_idx on public.blog_templum_comments (post_id, status);

-- ---------------------------------------------------------------------------
-- updated_at automático nos posts
-- ---------------------------------------------------------------------------
create or replace function public.blog_templum_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_blog_templum_posts_updated on public.blog_templum_posts;
create trigger trg_blog_templum_posts_updated
  before update on public.blog_templum_posts
  for each row execute function public.blog_templum_touch_updated_at();

-- ============================================================================
-- RLS — público lê só o publicado; quem está logado gerencia tudo.
-- ============================================================================
alter table public.blog_templum_categories enable row level security;
alter table public.blog_templum_posts      enable row level security;
alter table public.blog_templum_members    enable row level security;
alter table public.blog_templum_comments   enable row level security;

-- Categorias: leitura pública, escrita só logado
drop policy if exists "cat_public_read" on public.blog_templum_categories;
create policy "cat_public_read" on public.blog_templum_categories for select using (true);
drop policy if exists "cat_auth_write" on public.blog_templum_categories;
create policy "cat_auth_write" on public.blog_templum_categories for all to authenticated using (true) with check (true);

-- Posts: público lê só published; logado faz tudo
drop policy if exists "posts_public_read" on public.blog_templum_posts;
create policy "posts_public_read" on public.blog_templum_posts for select using (status = 'published');
drop policy if exists "posts_auth_all" on public.blog_templum_posts;
create policy "posts_auth_all" on public.blog_templum_posts for all to authenticated using (true) with check (true);

-- Membros: só logado vê/gerencia
drop policy if exists "members_auth" on public.blog_templum_members;
create policy "members_auth" on public.blog_templum_members for all to authenticated using (true) with check (true);

-- Comentários: anônimo cria pending; público lê approved; logado gerencia
drop policy if exists "comments_public_read" on public.blog_templum_comments;
create policy "comments_public_read" on public.blog_templum_comments for select using (status = 'approved');
drop policy if exists "comments_anon_insert" on public.blog_templum_comments;
create policy "comments_anon_insert" on public.blog_templum_comments for insert to anon with check (status = 'pending');
drop policy if exists "comments_auth_all" on public.blog_templum_comments;
create policy "comments_auth_all" on public.blog_templum_comments for all to authenticated using (true) with check (true);
