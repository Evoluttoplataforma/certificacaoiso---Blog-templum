-- ============================================================================
-- Pulso — as consultas de leitura. Rodar no SQL editor do Supabase.
-- 2026-08-27
--
-- Baseline a bater: 0,78 lead/dia (18–26/08/2026, form-blog + consultoria-artigo),
-- sobre ~360 sessões/dia = 0,22% de conversão.
--
-- ⚠ CORTE DA MEDIÇÃO: **2026-08-28 11:46 UTC**. Tudo ANTES disso está contaminado e
-- não serve para taxa nenhuma. Na primeira noite no ar, 64% das exibições foram
-- crawler (94 delas em exatos 8,2s, 99% de rolagem, 83 páginas, sem referrer, e ZERO
-- dispensa — público humano não tem 0% de dispensa), e no celular a caixinha nascia
-- aos 50s por estrangulamento do setTimeout em aba de fundo. Os dois defeitos foram
-- corrigidos nesse horário. Some `and created_at > '2026-08-28 11:46+00'` a qualquer
-- consulta abaixo antes de tirar conclusão.
--
-- Como ler o conjunto:
--   · taxa de resposta < 5% em 7 dias  → o FORMATO está errado, não a pergunta;
--   · resposta alta e (3) perto de zero → o problema é a OFERTA, não o público.
--     É aí, e só aí, que a conversa sobre reativar as iscas volta a fazer sentido.
-- ============================================================================


-- 1) O A/B: qual momento responde mais? -------------------------------------
-- Denominador é `visto` (por isso a caixinha registra a exibição também).
select
  variante,
  count(*) filter (where evento = 'visto')     as apareceu,
  count(*) filter (where evento = 'resposta')  as respondeu,
  count(*) filter (where evento = 'dispensa')  as fechou,
  round(100.0 * count(*) filter (where evento = 'resposta')
              / nullif(count(*) filter (where evento = 'visto'), 0), 1) as taxa_resposta_pct
from blog_templum_pulso
where created_at > now() - interval '7 days'
group by variante
order by variante;


-- 1b) O GATILHO: aparece pouco, ou aparece e é fechado? ---------------------
-- A pergunta que decide se o Pulso continua no celular. Desde 29/08 há um gatilho
-- por device, e as duas leituras pedem decisões OPOSTAS:
--   · poucas exibições e dispensa baixa  → o gatilho não pega ninguém: tirar o
--     componente do device (ou trocar o gatilho);
--   · muitas exibições e dispensa alta   → pega e incomoda: mudar a FORMA.
-- `gatilho` é nulo em tudo gravado antes de 2026-08-29 — o filtro abaixo é de rigor.
select
  coalesce(gatilho, '(antes de 29/08)') as gatilho,
  device,
  count(*) filter (where evento = 'visto')     as apareceu,
  count(*) filter (where evento = 'resposta')  as respondeu,
  count(*) filter (where evento = 'dispensa')  as fechou,
  round(100.0 * count(*) filter (where evento = 'resposta')
              / nullif(count(*) filter (where evento = 'visto'), 0), 1) as taxa_resposta_pct,
  round(100.0 * count(*) filter (where evento = 'dispensa')
              / nullif(count(*) filter (where evento = 'visto'), 0), 1) as taxa_dispensa_pct
from blog_templum_pulso
where created_at > '2026-08-29 00:00+00'
group by 1, 2
order by apareceu desc;


-- 2) QUEM CHEGA E O QUE QUER — a pergunta original ---------------------------
select
  resposta,
  count(*) as respostas,
  round(100.0 * count(*) / sum(count(*)) over (), 1) as pct,
  count(*) filter (where device = 'mobile') as no_celular,
  round(avg(scroll_pct)) as scroll_medio,
  round(avg(ms_ate_acao) / 1000.0) as segundos_ate_responder
from blog_templum_pulso
where evento = 'resposta' and created_at > now() - interval '7 days'
group by resposta
order by respostas desc;

-- 2b) O mesmo recorte por norma — é onde se decide QUAL oferta vale a pena.
select
  coalesce(nullif(norma, ''), '(sem norma)') as norma,
  count(*) as respostas,
  count(*) filter (where resposta = 'vou-implantar') as vou_implantar,
  count(*) filter (where resposta = 'travei')        as travei,
  count(*) filter (where resposta = 'pesquisando')   as pesquisando,
  count(*) filter (where resposta = 'carreira')      as carreira
from blog_templum_pulso
where evento = 'resposta' and created_at > now() - interval '14 days'
group by 1
having count(*) >= 5
order by respostas desc;

-- 2c) As páginas que mais trazem gente de intenção alta. Pauta editorial:
--     é aqui que vale investir conteúdo e CTA, não no que só tem pageview.
select
  page,
  count(*) filter (where resposta in ('vou-implantar', 'travei')) as quentes,
  count(*) as respostas
from blog_templum_pulso
where evento = 'resposta' and created_at > now() - interval '14 days'
group by page
having count(*) filter (where resposta in ('vou-implantar', 'travei')) > 0
order by quentes desc
limit 25;


-- 3) O NÚMERO QUE DECIDE: resposta → lead ------------------------------------
-- Cruza pelo visitor_id, que é o mesmo __ci_uid nas duas tabelas.
-- Só conta o lead que veio DEPOIS da resposta (senão a caixinha leva crédito por
-- lead que já existia).
select
  p.resposta,
  count(distinct p.visitor_id) as pessoas,
  count(distinct l.visitor_id) as viraram_lead,
  round(100.0 * count(distinct l.visitor_id)
              / nullif(count(distinct p.visitor_id), 0), 1) as conversao_pct
from blog_templum_pulso p
left join blog_templum_leads l
  on l.visitor_id = p.visitor_id
 and l.visitor_id <> ''
 and l.created_at >= p.created_at
where p.evento = 'resposta'
  and coalesce(p.visitor_id, '') <> ''
  and p.created_at > now() - interval '30 days'
group by p.resposta
order by viraram_lead desc;


-- 4) Higiene: a caixinha está aparecendo onde deveria? ------------------------
-- Só deve haver linha de página de ARTIGO. /form, /presentes/*, /buscar/, home e
-- categoria não podem aparecer aqui.
-- `/categoria/%` com a barra, e não `/categoria%`: existe artigo cujo slug COMEÇA com
-- a palavra (/categoria-diamante-do-pqta-premia-55-cartorios-no-pais/), e o prefixo
-- solto acusava ele como se o portão tivesse vazado. Falso positivo em consulta de
-- higiene é pior que consulta nenhuma — manda caçar bug que não existe.
select page, count(*) as vistos
from blog_templum_pulso
where evento = 'visto' and created_at > now() - interval '2 days'
  and (page = '/' or page like '/form/%' or page = '/form'
       or page like '/presentes/%' or page like '/buscar/%'
       or page like '/categoria/%')
group by page;


-- 5) O DEGRAU QUE FALTAVA: resposta → clique no passo 2 -----------------------
-- Acrescentado em 28/08/2026. No primeiro dia o clique no CTA do passo 2 só
-- existia como evento do Clarity, e "0 lead do pulso" era ambíguo: não dava para
-- saber se a oferta estava errada ou se ninguém tinha chegado a clicar. Agora dá.
select
  resposta,
  count(*) filter (where evento = 'resposta') as responderam,
  count(*) filter (where evento = 'clique')   as clicaram,
  round(100.0 * count(*) filter (where evento = 'clique')
              / nullif(count(*) filter (where evento = 'resposta'), 0), 1) as aceitou_o_passo_pct
from blog_templum_pulso
where created_at > '2026-08-28 11:46+00'
group by resposta
having resposta is not null
order by responderam desc;

-- 5b) Para onde foram: 'form' | 'whatsapp' | 'leitura' | 'audio'.
select resposta, destino, count(*) as cliques
from blog_templum_pulso
where evento = 'clique' and created_at > '2026-08-28 11:46+00'
group by resposta, destino
order by cliques desc;
