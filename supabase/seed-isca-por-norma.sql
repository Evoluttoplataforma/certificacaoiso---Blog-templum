-- Fase 4: isca "destaque" por norma (sidebar dos artigos)
alter table public.blog_templum_categories add column if not exists isca_slug text;

update public.blog_templum_categories set isca_slug='e-book-lucre-com-a-iso'                                            where name='Qualidade e Inovação';
update public.blog_templum_categories set isca_slug='e-book-guia-pbqp-h'                                                where name='Construção Civil';
update public.blog_templum_categories set isca_slug='e-book-seguranca-de-alimentos'                                     where name='Segurança dos Alimentos';
update public.blog_templum_categories set isca_slug='analise-critica-pela-direcao-iso-14001-guia-completo-e-pratico'    where name='Meio Ambiente';
update public.blog_templum_categories set isca_slug='e-book-a-nova-iso-45001'                                           where name='Saúde e Segurança do Trabalho';
update public.blog_templum_categories set isca_slug='planilha-relatorio-de-nao-conformidade'                           where name='Auditoria';
update public.blog_templum_categories set isca_slug='iso-27001-o-guia-completo-para-mapeamento-de-processos'           where name='Segurança e Compliance';
update public.blog_templum_categories set isca_slug='e-book-okr'                                                        where name='Gestão e Marketing';
update public.blog_templum_categories set isca_slug='inteligencia-artificial-como-transformar-sua-empresa-com-ia-na-pratica' where name='IA';
update public.blog_templum_categories set isca_slug='analise-critica-pela-direcao-iso-14001-guia-completo-e-pratico'    where name='ESG';
update public.blog_templum_categories set isca_slug='e-book-lucre-com-a-iso'                                            where name='Transportes e Logística';
