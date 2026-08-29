-- ============================================================================
-- Pulso — a caixinha de 1 clique dos artigos (src/components/Pulso.astro)
-- 2026-08-27
--
-- POR QUE ESTA TABELA EXISTE, e não uma tag do Clarity:
-- tag custom do Clarity NÃO sai na Data Export API. `dimension1=CustomTag` não dá
-- erro — é ignorado em silêncio e devolve o total sem agrupar, o que é fácil
-- confundir com "não tem dado" (testado com token real em 19/08/2026). O Clarity
-- serve para ASSISTIR a sessão de quem respondeu; o número sai daqui.
--
-- ATÉ TRÊS LINHAS POR PESSOA, de propósito: uma em `visto` (a caixinha apareceu) e
-- outra no clique (`resposta` ou `dispensa`), e uma terceira em `clique` quando a
-- pessoa aceita o próximo passo. Sem a linha de `visto` não existe denominador, e
-- "37 pessoas responderam" não vira taxa nenhuma. A ~360 sessões por dia isso é
-- ruído para o Postgres e é a diferença entre medir e adivinhar.
--
-- `visitor_id` é o MESMO __ci_uid que blog_templum_leads.visitor_id guarda (ver
-- src/layouts/Base.astro). É o que permite responder a única pergunta que decide
-- se a caixinha fica: quem respondeu o quê virou lead?
-- ============================================================================

create table if not exists public.blog_templum_pulso (
  id            uuid primary key default gen_random_uuid(),
  -- __ci_uid do visitante. Vazio quando o localStorage está bloqueado (aba
  -- privada) — a linha entra igual, só não cruza com lead.
  visitor_id    text,
  -- 'visto' | 'resposta' | 'dispensa' | 'clique'
  evento        text not null,
  -- 'pesquisando' | 'vou-implantar' | 'travei' | 'carreira'. Nulo em 'visto'.
  -- Em 'clique' repete a resposta que levou ao passo 2 — é o que liga o clique à
  -- pergunta, sem precisar de um join da tabela com ela mesma.
  resposta      text,
  -- 'form' | 'whatsapp' | 'leitura' | 'audio'. Só em 'clique'. Sem esta coluna não dá
  -- para separar "a oferta está errada" de "ninguém chegou a clicar" — que é a
  -- pergunta que decide o próximo passo do funil.
  destino       text,
  -- 'engajamento' | 'saida' — era o braço do A/B, sorteado pelo hash do visitor_id.
  -- O A/B morreu em 29/08/2026 (saida 7,1% x engajamento 1,0% em 309 exibições) e
  -- hoje isto é sempre 'saida' fora de `?pulso=`. A coluna FICA: é o que mantém o
  -- histórico legível.
  variante      text,
  -- Qual gatilho abriu a caixinha. Sem esta coluna não dá para separar "o gatilho
  -- não pega ninguém" de "pega e a pessoa fecha" — e as duas leituras pedem decisões
  -- OPOSTAS (tirar o Pulso do celular, ou mudar a forma dele). Repetida em TODAS as
  -- linhas da mesma exibição, igual `resposta` é repetida em 'clique'.
  --   'rolagem'  25% do artigo          (braço engajamento)
  --   'relogio'  20s, só desktop        (braço engajamento)
  --   'mouseout' ponteiro sai pelo topo (braço saida, desktop)
  --   'ocioso'   45s parado após 25%    (braço saida, celular)
  -- Nula em tudo gravado antes de 2026-08-29.
  gatilho       text,
  page          text,
  norma         text,
  categoria     text,
  device        text,          -- 'mobile' | 'desktop'
  referrer_host text,          -- só o host; URL inteira de referrer é PII em potencial
  ms_ate_acao   integer,       -- desde o load da página
  scroll_pct    integer,
  created_at    timestamptz default now()
);

-- A tabela nasceu em 27/08 sem `gatilho`; o create acima só vale para instalação
-- nova, então o alter idempotente é o que atualiza quem já tem a tabela de pé.
alter table public.blog_templum_pulso add column if not exists gatilho text;

create index if not exists blog_templum_pulso_created_idx  on public.blog_templum_pulso (created_at desc);
create index if not exists blog_templum_pulso_visitor_idx  on public.blog_templum_pulso (visitor_id);
create index if not exists blog_templum_pulso_evento_idx   on public.blog_templum_pulso (evento);
create index if not exists blog_templum_pulso_gatilho_idx  on public.blog_templum_pulso (gatilho);

-- RLS: mesmo desenho de blog_templum_leads — anônimo escreve, só logado lê.
alter table public.blog_templum_pulso enable row level security;

drop policy if exists "pulso_anon_insert" on public.blog_templum_pulso;
create policy "pulso_anon_insert" on public.blog_templum_pulso
  for insert to anon with check (evento in ('visto', 'resposta', 'dispensa', 'clique'));

drop policy if exists "pulso_auth_all" on public.blog_templum_pulso;
create policy "pulso_auth_all" on public.blog_templum_pulso
  for all to authenticated using (true) with check (true);
