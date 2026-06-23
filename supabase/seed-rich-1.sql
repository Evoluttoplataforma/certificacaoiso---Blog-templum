-- PARTE 1/6 — colunas novas (rode primeiro)
alter table public.blog_templum_leads add column if not exists company text;
alter table public.blog_templum_leads add column if not exists page text;
alter table public.blog_templum_iscas add column if not exists headline text;
alter table public.blog_templum_iscas add column if not exists subhead text;
alter table public.blog_templum_iscas add column if not exists benefits jsonb;
alter table public.blog_templum_iscas add column if not exists steps jsonb;
alter table public.blog_templum_iscas add column if not exists cta_title text;
alter table public.blog_templum_iscas add column if not exists cta_copy text;
alter table public.blog_templum_iscas add column if not exists cta_items jsonb;
alter table public.blog_templum_iscas add column if not exists faq jsonb;
