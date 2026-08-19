-- Iscas descontinuadas + CTA da Olívia — gerado por scripts/gera-sql-iscas-olivia.mjs
-- 2026-08-19. NÃO editar à mão: regere o arquivo.

begin;

-- 1. Backup do conteúdo que este script altera (some só com drop explícito).
create table if not exists blog_templum_posts_bkp_20260819_iscas as
select id, slug, content, now() as bkp_at from blog_templum_posts where false;
insert into blog_templum_posts_bkp_20260819_iscas (id, slug, content, bkp_at)
select id, slug, content, now() from blog_templum_posts
where slug in ('planilha-fluxo-de-caixa', 'planilha-analise-swot', 'planilha-mapeamento-de-processos-sgi', 'e-book-iso-14001-2015', 'e-book-como-ganhar-lucro-com-a-iso', 'e-book-a-nova-iso-45001', 'e-book-tudo-sobre-a-transicao-da-iso-90012015', 'e-book-pbqp-h-e-a-norma-de-desempenho', 'e-book-gestao-do-relacionamento-com-clientes', 'pack-gestao', 'pbqp-h-economizar-na-implementacao-pode-sair-caro', 'pbqp-h-nivel-a', 'perguntas-frequentes-sobre-o-pbqp-h', 'tudo-que-o-construtor-precisa-saber-sobre-a-certificacao-pbqp-h', 'fluxo-de-caixa-em-tempos-de-crise', 'okr-o-que-e-ebook', 'planilha-mapeamento-de-processos', 'planilha-perigos-e-riscos', 'planilha-planejamento-para-integracao-de-normas', 'pequenas-empresas-e-iso-14001', 'perguntas-frequentes', 'haccp-o-que-e', '5w2h-usando-para-transformar-os-riscos-em-oportunidades', 'missao-visao-valores', 'tipos-planejamento-estrategico-2', 'e-book-mitos-e-verdades-pbqp-h', 'e-book-programa-casa-verde-amarela-oportunidade-em-meio-a-crise-para-construtoras', 'quanto-custa-iso-9001')
  and not exists (select 1 from blog_templum_posts_bkp_20260819_iscas b where b.id = blog_templum_posts.id);

-- 2. As 23 iscas ativas saem do ar. O build gera /presentes/<slug> a partir de
--    active=true, então isto some com as páginas; os 301 estão em public/_redirects.
update blog_templum_iscas set active = false where active;

-- 3. Lixo do RD Station impresso como TEXTO no meio do artigo (6 posts). O plugin
--    de isca deixou "window.fd('form', {...})" visível pro leitor quando o WordPress
--    foi exportado — sempre logo abaixo da promessa de download.
update blog_templum_posts
set content = regexp_replace(content, '<p>window\.fd\([^<]*</p>\s*', '', 'g')
where content like '%window.fd(%';

-- 4. Promessas de download → CTA da Olívia.
update blog_templum_posts set content = replace(content, $sql$<p><strong>Baixe o e-book preenchendo o formulário abaixo e entenda mais sobre o PBQP-H.</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre PBQP-H?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=pbqp-h-economizar-na-implementacao-pode-sair-caro&amp;norma=PBQP-H">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'pbqp-h-economizar-na-implementacao-pode-sair-caro';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Baixe o e-book preenchendo o formulário abaixo e entenda mais sobre o PBQP-H.</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre PBQP-H?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=pbqp-h-nivel-a&amp;norma=PBQP-H">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'pbqp-h-nivel-a';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Baixe o e-book preenchendo o formulário abaixo e entenda mais sobre o PBQP-H.</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre PBQP-H?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=perguntas-frequentes-sobre-o-pbqp-h&amp;norma=PBQP-H">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'perguntas-frequentes-sobre-o-pbqp-h';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Baixe o e-book preenchendo o formulário abaixo e entenda mais sobre o PBQP-H.</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre PBQP-H?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=tudo-que-o-construtor-precisa-saber-sobre-a-certificacao-pbqp-h&amp;norma=PBQP-H">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'tudo-que-o-construtor-precisa-saber-sobre-a-certificacao-pbqp-h';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Baixe o e-book preenchendo o formulário e entenda mais sobre a metodologia OKR.</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=fluxo-de-caixa-em-tempos-de-crise">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'fluxo-de-caixa-em-tempos-de-crise';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Descubra como a Templum pode ajudar você a implementar o OKR e liberar todo o potencial do seu negócio. Faça o download do ebook agora e inicie sua jornada rumo à excelência em gestão de metas!</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=okr-o-que-e-ebook">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'okr-o-que-e-ebook';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Conheça a Templum e descubra como podemos ajudar você a otimizar seus processos e liberar todo o potencial do seu negócio. Faça o download agora e inicie sua jornada rumo à excelência operacional!</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=planilha-mapeamento-de-processos">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'planilha-mapeamento-de-processos';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Descubra como a Templum pode ajudar você a proteger seu negócio e garantir a segurança dos seus colaboradores. Faça o download agora e inicie sua jornada rumo à excelência em segurança e conformidade!</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=planilha-perigos-e-riscos">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'planilha-perigos-e-riscos';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Descubra como a Templum pode ajudar você a integrar normas e liberar todo o potencial do seu negócio. Faça o download agora e inicie sua jornada rumo à conformidade e excelência!</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=planilha-planejamento-para-integracao-de-normas">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'planilha-planejamento-para-integracao-de-normas';
update blog_templum_posts set content = replace(content, $sql$<p>Conheça os detalhes da ISO 14001. <a href="/e-book-iso-14001-2015/">Baixe o nosso e-book</a> e conheça com mais detalhes e quais as formas de implementação da ISO 14001.</p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre ISO 14001?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=pequenas-empresas-e-iso-14001&amp;norma=ISO%2014001">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'pequenas-empresas-e-iso-14001';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Quer saber mais sobre a ISO 9001?</strong> <a href="https://templum.com.br/e-book-certificacao-iso-para-empresarios/">Baixe o nosso e-book sobre a Certificação ISO para empresários</a>.</p>$sql$, $sql$<p><strong>Quer saber mais sobre a ISO 9001?</strong> <a href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=perguntas-frequentes&amp;norma=ISO%209001">Fale com a Olívia, especialista da Templum</a>.</p>$sql$)
where slug = 'perguntas-frequentes';
update blog_templum_posts set content = replace(content, $sql$<p>Saiba como a ISO 22000 impacta na sua organização<br>Os cuidados que seu produto deve ter na distribuição para seus clientes baixe o e-book</p>
$sql$, $sql$$sql$)
where slug = 'haccp-o-que-e';
update blog_templum_posts set content = replace(content, $sql$<p><strong>Bônus: Download planilha gratuita!</strong></p>
$sql$, $sql$$sql$)
where slug = '5w2h-usando-para-transformar-os-riscos-em-oportunidades';
update blog_templum_posts set content = replace(content, $sql$ Para ajudar nesse processo, sugerimos o download de um e-book gratuito sobre descomplicar o planejamento estratégico.$sql$, $sql$$sql$)
where slug = 'missao-visao-valores';
update blog_templum_posts set content = replace(content, $sql$<p>Para aprofundar ainda mais seu conhecimento sobre essas estratégias, recomendamos o download de um e-book gratuito sobre marketing digital, que pode ajudar a entender melhor as estratégias de planejamento estratégico e operacional.</p>
$sql$, $sql$$sql$)
where slug = 'tipos-planejamento-estrategico-2';

-- 5. Cascas: o corpo era só a capa do material. Vira linha honesta + CTA.
--    A guarda de length() é de propósito: se alguém escrever conteúdo de verdade
--    nesses posts entre gerar e rodar o SQL, o UPDATE não apaga o trabalho.
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=planilha-fluxo-de-caixa">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'planilha-fluxo-de-caixa' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=planilha-analise-swot">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'planilha-analise-swot' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=planilha-mapeamento-de-processos-sgi">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'planilha-mapeamento-de-processos-sgi' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre ISO 14001?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=e-book-iso-14001-2015&amp;norma=ISO%2014001">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'e-book-iso-14001-2015' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=e-book-como-ganhar-lucro-com-a-iso">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'e-book-como-ganhar-lucro-com-a-iso' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre ISO 45001?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=e-book-a-nova-iso-45001&amp;norma=ISO%2045001">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'e-book-a-nova-iso-45001' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre ISO 9001?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=e-book-tudo-sobre-a-transicao-da-iso-90012015&amp;norma=ISO%209001">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'e-book-tudo-sobre-a-transicao-da-iso-90012015' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre PBQP-H?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=e-book-pbqp-h-e-a-norma-de-desempenho&amp;norma=PBQP-H">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'e-book-pbqp-h-e-a-norma-de-desempenho' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=e-book-gestao-do-relacionamento-com-clientes">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'e-book-gestao-do-relacionamento-com-clientes' and length(content) < 1000;
update blog_templum_posts set content = $sql$<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>
<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Quer ajuda para certificar sua empresa?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=pack-gestao">Falar com a Olívia</a>
</div>
</div>$sql$
where slug = 'pack-gestao' and length(content) < 1000;

-- 6. Capa do material (imagem do e-book/planilha que não existe mais).
update blog_templum_posts set content = replace(content, $sql$<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=e-book-mitos-e-verdades-pbqp-h&amp;norma=PBQP-H"><img src="/wp-content/uploads/2022/09/E-book-_Mitos-e-Verdades_do-PBQP-H.webp" alt="Consultoria da Templum — solicite uma proposta"></a></p>
$sql$, $sql$$sql$)
where slug = 'e-book-mitos-e-verdades-pbqp-h';
update blog_templum_posts set content = replace(content, $sql$<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=planilha-mapeamento-de-processos"><img src="/wp-content/uploads/2021/04/tartaruga-turbinada.webp" alt="Tartaruga turbinada"></a></p>
$sql$, $sql$$sql$)
where slug = 'planilha-mapeamento-de-processos';
update blog_templum_posts set content = replace(content, $sql$<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=planilha-perigos-e-riscos"><img src="/wp-content/uploads/2021/04/PLANILHA_Perigos-e-Riscos.webp" alt="PLANILHA Perigos e Riscos"></a></p>
$sql$, $sql$$sql$)
where slug = 'planilha-perigos-e-riscos';
update blog_templum_posts set content = replace(content, $sql$<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=planilha-planejamento-para-integracao-de-normas"><img src="/wp-content/uploads/2021/04/planilha_Planejamento-para_Integrac%E2%95%A0oa%E2%95%A0ao-de-Normas.webp" alt="Planilha Planejamento para Integrac%E2%95%A0oa%E2%95%A0ao de Normas"></a></p>
$sql$, $sql$$sql$)
where slug = 'planilha-planejamento-para-integracao-de-normas';
update blog_templum_posts set content = replace(content, $sql$<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=e-book-programa-casa-verde-amarela-oportunidade-em-meio-a-crise-para-construtoras"><img src="/wp-content/uploads/2022/09/E-book-_Programa-Casa_Verde-Amarela.webp" alt="Consultoria da Templum — solicite uma proposta"></a></p>
$sql$, $sql$$sql$)
where slug = 'e-book-programa-casa-verde-amarela-oportunidade-em-meio-a-crise-para-construtoras';

-- 7. quanto-custa-iso-9001: bloco inteiro do e-book (capa + h2 + bullets do que
--    vinha no PDF + "baixe abaixo"). Trocar só a última linha deixaria a lista órfã.
update blog_templum_posts set content = replace(content, $sql$<p><img src="/wp-content/uploads/2024/06/ebook-como-ganhar-lucro-com-a-iso.webp" alt="E-book: como ganhar lucro com a ISO" loading="lazy"></p>
<h2>E-book: Como ganhar lucro com a ISO</h2>
<p>Saiba como uma norma ISO pode contribuir para a sua empresa.</p>
<ul>
<li>A gestão empresarial</li>
<li>Como desenvolver uma estratégia empresarial?</li>
<li>Relação da ISO 9001 como o lucro da sua empresa</li>
<li>E muito +!</li>
</ul>
<p><strong>Baixe o e-book abaixo e inicie o processo de certificação da sua empresa!</strong></p>$sql$, $sql$<div class="cta-olivia">
<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">
<div>
<strong>Dúvida sobre ISO 9001?</strong>
<p>A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.</p>
<a class="btn btn--primary" href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=quanto-custa-iso-9001&amp;norma=ISO%209001">Falar com a Olívia</a>
</div>
</div>$sql$)
where slug = 'quanto-custa-iso-9001';

commit;
