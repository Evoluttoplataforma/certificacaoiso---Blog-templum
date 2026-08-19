-- Iscas descontinuadas — parte 2 (19/08/2026). Complemento de
-- descontinua-iscas-cta-olivia.sql, que é GERADO por scripts/gera-sql-iscas-olivia.mjs.
-- Isto aqui é escrito à mão: são achados que só apareceram DEPOIS de rodar a parte 1,
-- conferindo o resultado. Já aplicado; fica como registro do que mudou no conteúdo.

begin;

-- 1. Promessa de download que sobrou em duas planilhas. A extração da parte 1 olhava um
--    parágrafo por post e cortava em 300 caracteres — estas estavam num SEGUNDO parágrafo,
--    e o parágrafo inteiro falava do material ("Com essa ferramenta poderosa..."), então
--    trocar só a frase deixaria o resto sem sujeito.
update blog_templum_posts set content = replace(content,
$sql$<p>Não deixe a segurança do seu negócio ao acaso. Assuma o controle da identificação de perigos e da avaliação de riscos, garantindo um ambiente de trabalho seguro e eficiente. Baixe agora nossa Planilha de Identificação de Perigos e Avaliação de Riscos e comece a transformar a segurança do seu negócio. Com essa ferramenta poderosa, você estará preparado para identificar riscos, implementar ações corretivas e garantir a segurança contínua.</p>$sql$,
$sql$<p>Não deixe a segurança do seu negócio ao acaso. Assuma o controle da identificação de perigos e da avaliação de riscos, garantindo um ambiente de trabalho seguro e eficiente. Fale com a Olívia e veja como estruturar isso na prática, com apoio de quem implanta a norma no dia a dia.</p>$sql$)
where slug = 'planilha-perigos-e-riscos';

update blog_templum_posts set content = replace(content,
$sql$<p>Não deixe a conformidade ao acaso. Assuma o controle do processo de integração de normas e garanta a excelência em gestão. Baixe agora nossa Planilha de Planejamento para Integração de Normas e comece a transformar seu negócio. Com essa ferramenta poderosa, você estará preparado para enfrentar desafios regulatórios, otimizar processos e garantir o sucesso sustentável da sua empresa.</p>$sql$,
$sql$<p>Não deixe a conformidade ao acaso. Assuma o controle do processo de integração de normas e garanta a excelência em gestão. Fale com a Olívia e veja como estruturar isso na prática, com apoio de quem implanta a norma no dia a dia.</p>$sql$)
where slug = 'planilha-planejamento-para-integracao-de-normas';

-- 2. "Gancho Final" era anotação de quem redigiu o texto com IA, publicada como <h4>
--    em 3 posts. Não é seção do artigo; é instrução de roteiro que vazou pro leitor.
update blog_templum_posts
set content = replace(content, $sql$<h4>Gancho Final</h4>
$sql$, $sql$$sql$)
where content like '%Gancho Final%';

-- 3. A <meta name="description"> de 16 destes posts era o markdown da capa —
--    "!(/wp-content/uploads/2021/04/PLANILHA…webp)(https://templum.com.br/form?…)".
--    Isso ia pro Google como descrição da página, com caminho de imagem e a URL ANTIGA
--    do formulário do site. lib/posts.js usa `excerpt || snippetFrom(content)`, então
--    limpar o excerpt faz a descrição vir do conteúdo real.
update blog_templum_posts set excerpt = null
where id in (select id from blog_templum_posts_bkp_20260819_iscas)
  and (excerpt like '%wp-content%' or excerpt like '%utmsource%');

-- 4. Nas 10 cascas o "conteúdo real" é o próprio aviso de descontinuado, e o snippet
--    automático viraria a descrição pela metade. Aqui vale escrever a frase.
update blog_templum_posts
set seo_description = 'Este material foi descontinuado. Fale com a Olívia, especialista da Templum, e receba orientação prática sobre certificação — sem custo e sem compromisso.'
where slug in ('planilha-fluxo-de-caixa','planilha-analise-swot','planilha-mapeamento-de-processos-sgi',
  'e-book-iso-14001-2015','e-book-como-ganhar-lucro-com-a-iso','e-book-a-nova-iso-45001',
  'e-book-tudo-sobre-a-transicao-da-iso-90012015','e-book-pbqp-h-e-a-norma-de-desempenho',
  'e-book-gestao-do-relacionamento-com-clientes','pack-gestao')
  and coalesce(seo_description,'') = '';

commit;

-- NÃO resolvido aqui, de propósito (mexe em title, que é decisão de SEO/negócio):
--   · 13 outros posts publicados ainda têm excerpt com caminho de imagem (29 no total);
--     os 16 acima são só os que este trabalho tocou.
--   · dois títulos trocados na migração do WordPress:
--       e-book-tudo-sobre-a-transicao-da-iso-90012015 → title "Diagnóstico: Faça um
--         diagnóstico da sua empresa"
--       planilha-fluxo-de-caixa                       → title "Assistente virtual da templum"
