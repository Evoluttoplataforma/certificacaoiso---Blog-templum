-- Despublica os 6 posts DUPLICADOS confirmados (conteúdo ≥94% idêntico a um canônico
-- que permanece publicado). Vira 'draft' → some do build e do sitemap. Os redirects
-- (public/_redirects) mandam o slug antigo p/ o canônico (301), sem 404.
update public.blog_templum_posts set status = 'draft' where slug in (
  'principais-vantagens-da-certificacao-iso-9001-para-pequenas-empresas-parte-1-2',
  'certificacao-iso-27001-qual-e-a-infraestrutura-necessaria-2',
  'quais-os-maiores-riscos-de-nao-ter-a-iso-45001-implementada-2',
  'algumas-palavras-sobre-iso-9001-e-padronizacao-2',
  'certificacao-iso-as-principais-normas',
  'dicas-para-uma-implementacao-bem-sucedida'
);

-- Anula o excerpt COPIADO de 20 posts (mantém o original em 1 de cada grupo).
-- A descrição passa a vir de um trecho único do conteúdo (normalize em posts.js).
update public.blog_templum_posts set excerpt = null where slug in (
  'como-fazer-uma-pesquisa-de-satisfacao-sem-gastar-nada-2',
  'pbqp-h',
  'dicas-para-uma-implementacao-bem-sucedida',
  'relacao-do-lgpd-com-a-iso-27001-2',
  'siac-2021-o-que-mudou',
  'pgr-e-gro-que-voce-precisa-saber-parte-01',
  'siac-2021-o-que-mudou-2',
  'certificacao-iso-27001-qual-e-a-infraestrutura-necessaria-2',
  'pgr-e-gro-que-voce-precisa-saber-parte-01-2',
  'pack-gestao',
  'quais-sao-mudancas-mais-significativas-na-revisao-2015-da-iso-9001-2',
  'qual-e-melhor-opcao-para-implementacao-iso-9001-2',
  'iso-90012015-o-envolvimento-da-alta-direcao-no-sgq-2',
  'algumas-palavras-sobre-iso-9001-e-padronizacao-2',
  'principais-vantagens-da-certificacao-iso-9001-para-pequenas-empresas-parte-1',
  'principais-vantagens-da-certificacao-iso-9001-para-pequenas-empresas-parte-1-2-2',
  'iso-14001',
  'certificacao-iso-as-principais-normas',
  'mapeamento-de-processos-kaizen',
  'video-escopo-do-sistema-de-gestao-da-qualidade-2'
);
