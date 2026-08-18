-- APLICADO em 18/08/2026 no projeto yfpdrckyuxltvznqfqgh (migration
-- add_visitor_id_to_blog_templum_leads). Este arquivo é a referência versionada.
--
-- visitor_id guarda o MESMO UUID first-party que o blog envia ao Microsoft Clarity em
-- clarity("identify", ...) — gerado no navegador e persistido em localStorage.__ci_uid
-- (ver src/layouts/Base.astro). Com ele dá para sair de um lead e chegar na GRAVAÇÃO da
-- sessão que o gerou, e nas visitas anteriores do mesmo visitante. Sem ele, lead e
-- comportamento eram dois mundos separados.
--
-- Não é PII e não identifica pessoa: é um identificador de navegador, que morre se o
-- visitante limpar o storage. Por isso pode ir para o Clarity sem discussão de LGPD.
--
-- A policy leads_anon_insert tem `with check (true)`, então aceita a coluna nova sem
-- alteração. O INSERT do blog continua com Prefer: return=minimal — anon NÃO tem SELECT
-- nesta tabela, e pedir return=representation faria o insert falhar.
alter table public.blog_templum_leads
  add column if not exists visitor_id text;

comment on column public.blog_templum_leads.visitor_id is
  'UUID first-party do visitante (localStorage __ci_uid), igual ao custom-id enviado ao Microsoft Clarity via clarity("identify"). Permite achar a gravacao da sessao que gerou o lead. Nao e PII.';

-- Acesso previsto: todos os leads de um visitante (jornada multi-visita).
create index if not exists blog_templum_leads_visitor_id_idx
  on public.blog_templum_leads (visitor_id)
  where visitor_id is not null;
