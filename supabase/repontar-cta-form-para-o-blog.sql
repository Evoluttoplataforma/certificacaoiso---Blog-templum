-- APLICADO em 18/08/2026 no projeto yfpdrckyuxltvznqfqgh. Referência versionada.
--
-- O QUE FEZ: trocou os 846 links de templum.com.br/form dentro do conteúdo de 654 posts
-- (publicados + drafts) pelo /form DO BLOG, e anexou &norma=<rótulo> onde a norma do post
-- é identificável (312 posts).
--
-- POR QUE: enquanto o CTA saía para o site, o lead nascia como lead DO SITE — o blog não
-- aparecia como origem — e o visitor_id do Clarity não atravessa domínio (localStorage é
-- por origem), então a jornada se partia exatamente no passo da conversão.
--
-- BACKUP: blog_templum_posts_bkp_cta_form guarda o content original. Rollback:
--   update blog_templum_posts p set content = b.content
--   from blog_templum_posts_bkp_cta_form b where b.id = p.id;
--
-- A norma vem de tmp_norma_do_post(), que replica src/data/normas.js — a fonte é o JS e
-- este SQL foi GERADO a partir dele. Conferido antes de rodar: a distribuição por norma
-- ficou idêntica à do build (ISO 9001 192, PBQP-H 69, ISO 14001 20, LGPD 16, ISO 27001 16,
-- ISO 45001 15, ISO 37001 12, ISO 22000 11, FSSC 22000 5, HACCP 3...). Os objetos
-- auxiliares (tmp_padroes_norma, tmp_norma_do_post) foram dropados no fim.

-- 1) host + path. O `/?` do padrão cobre as duas formas que existiam no conteúdo
--    (/form?utm... e /form/?utm...) sem gerar barra dupla. O segundo replace pega os
--    links sem querystring, delimitados por aspas, espaço ou '<'.
update public.blog_templum_posts
set content = regexp_replace(
      regexp_replace(content, 'https?://(?:www\.)?templum\.com\.br/form/?\?', 'https://certificacaoiso.com.br/form/?', 'g'),
      'https?://(?:www\.)?templum\.com\.br/form/?(?=["''[:space:]<])', 'https://certificacaoiso.com.br/form/', 'g')
where content ilike '%templum.com.br/form%';

-- 2) &norma=<rótulo>, para o /form abrir no contexto do artigo em vez de genérico.
--    Usa &amp; porque parte dos links já escapava as UTMs assim; é HTML válido nos dois
--    casos e o navegador entrega a query correta.
update public.blog_templum_posts p
set content = regexp_replace(p.content,
      '(https://certificacaoiso\.com\.br/form/\?[^"''[:space:]<>]*)',
      '\1&amp;norma=' || replace(n.norma, ' ', '%20'), 'g')
from (
  select id, public.tmp_norma_do_post(slug, title, category_name, tags) as norma
  from public.blog_templum_posts where content ilike '%certificacaoiso.com.br/form%'
) n
where n.id = p.id and n.norma is not null and p.content not ilike '%norma=%';

-- Verificado depois: 0 link antigo, 0 barra dupla, 0 URL com norma duplicada,
-- 0 norma vazia, 312/312 dos posts com norma identificável enriquecidos.
