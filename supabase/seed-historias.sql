-- Histórias de clientes: segmento de empresa + empresa + cargo + destaque
alter table public.blog_templum_historias add column if not exists segment text;
alter table public.blog_templum_historias add column if not exists company text;
alter table public.blog_templum_historias add column if not exists role    text;
alter table public.blog_templum_historias add column if not exists featured boolean default false;
