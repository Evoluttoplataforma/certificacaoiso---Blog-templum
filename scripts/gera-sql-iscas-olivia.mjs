// Gera supabase/descontinua-iscas-cta-olivia.sql (19/08/2026).
//
// Contexto: a Templum parou de oferecer e-book/planilha como isca. O blog ficou com
// promessas de download em 3 formatos: (1) 11 "posts" que eram só a capa do material,
// (2) 6 posts de material com conteúdo real, (3) 14 posts normais com a promessa no meio
// do texto. Este script produz o SQL que troca tudo por um CTA de "falar com a Olívia",
// que é a pessoa que já assina o CTA do float e do sidebar.
//
// Por que gerar SQL em vez de dar UPDATE direto: conteúdo de 1.037 posts em produção não
// se edita às cegas. O script CONFERE cada fragmento no banco antes de emitir a linha —
// se o texto mudou no CMS, ele avisa em vez de gerar um replace() que não casa nada.
// Roda: node scripts/gera-sql-iscas-olivia.mjs   (leitura anônima, não escreve no banco)
import { writeFileSync } from "node:fs";
import { normaDaPagina, NORMAS_VALIDAS } from "../src/data/normas.js";

const SB = "https://yfpdrckyuxltvznqfqgh.supabase.co";
const K = "sb_publishable_Yfg9Ts5WRqD4Gc3jeWAS2A_-YWZrtiQ";
const H = { apikey: K, Authorization: `Bearer ${K}` };

// --- CTA da Olívia -------------------------------------------------------------------
// Uma pessoa com nome e rosto, e não "um especialista": é o mesmo rosto que o leitor já
// viu no float e no sidebar, então a promessa do clique é a mesma em todo o blog.
// olivia-float.webp (3KB) e não o PNG de 267KB — isto entra no meio do artigo.
function cta(slug, norma) {
  const qs = `utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=${slug}` +
    (norma ? `&amp;norma=${encodeURIComponent(norma)}` : "");
  // A norma aparece só no título, nunca dentro de uma frase com artigo: "até a PBQP-H"
  // está errado (é O PBQP-H) e "a ISO 9001" está certo. Concordar gênero norma por norma
  // seria mais uma tabela pra manter — o título resolve sem a armadilha.
  const titulo = norma ? `Dúvida sobre ${norma}?` : "Quer ajuda para certificar sua empresa?";
  const texto = "A Olívia é especialista em certificação na Templum. Conte o cenário da sua empresa e ela responde com o caminho até o certificado — sem custo e sem compromisso.";
  return [
    '<div class="cta-olivia">',
    '<img src="/assets/team/olivia-float.webp" alt="Olívia, especialista da Templum" width="72" height="72" loading="lazy">',
    "<div>",
    `<strong>${titulo}</strong>`,
    `<p>${texto}</p>`,
    `<a class="btn btn--primary" href="/form/?${qs}">Falar com a Olívia</a>`,
    "</div>",
    "</div>",
  ].join("\n");
}

// Corpo inteiro dos posts que eram só a capa do material.
function corpoDeCasca(slug, norma) {
  return `<p>Este material foi descontinuado. Em vez de um PDF, agora você fala direto com quem implanta a norma na prática — de graça e sem compromisso.</p>\n${cta(slug, norma)}`;
}

// --- Alvos ---------------------------------------------------------------------------
// CASCAS: corpo era só a capa do e-book/planilha (100–348 caracteres, 1 imagem, nenhum
// texto). Ficam com uma linha honesta + o CTA. Os dois que já têm 301 no _redirects
// (e-book-a-seguranca-de-alimentos… e e-book-regularizar-a-sua-empresa…) estão fora:
// a página não é servida, editar o conteúdo não mudaria nada.
const CASCAS = [
  "planilha-fluxo-de-caixa",
  "planilha-analise-swot",
  "planilha-mapeamento-de-processos-sgi",
  "e-book-iso-14001-2015",
  "e-book-como-ganhar-lucro-com-a-iso",
  "e-book-a-nova-iso-45001",
  "e-book-tudo-sobre-a-transicao-da-iso-90012015",
  "e-book-pbqp-h-e-a-norma-de-desempenho",
  "e-book-gestao-do-relacionamento-com-clientes",
  "pack-gestao", // 882 chars: capa + duas linhas de promessa, sem conteúdo próprio
];

// TROCAS: fragmento exato → substituto. `null` remove o fragmento.
const PBQP = "<p><strong>Baixe o e-book preenchendo o formulário abaixo e entenda mais sobre o PBQP-H.</strong></p>";
const TROCAS = [
  { slugs: ["pbqp-h-economizar-na-implementacao-pode-sair-caro", "pbqp-h-nivel-a",
            "perguntas-frequentes-sobre-o-pbqp-h", "tudo-que-o-construtor-precisa-saber-sobre-a-certificacao-pbqp-h"],
    old: PBQP, norma: "PBQP-H" },
  { slugs: ["fluxo-de-caixa-em-tempos-de-crise"],
    old: "<p><strong>Baixe o e-book preenchendo o formulário e entenda mais sobre a metodologia OKR.</strong></p>" },
  { slugs: ["okr-o-que-e-ebook"],
    old: "<p><strong>Descubra como a Templum pode ajudar você a implementar o OKR e liberar todo o potencial do seu negócio. Faça o download do ebook agora e inicie sua jornada rumo à excelência em gestão de metas!</strong></p>" },
  { slugs: ["planilha-mapeamento-de-processos"],
    old: "<p><strong>Conheça a Templum e descubra como podemos ajudar você a otimizar seus processos e liberar todo o potencial do seu negócio. Faça o download agora e inicie sua jornada rumo à excelência operacional!</strong></p>" },
  { slugs: ["planilha-perigos-e-riscos"],
    old: "<p><strong>Descubra como a Templum pode ajudar você a proteger seu negócio e garantir a segurança dos seus colaboradores. Faça o download agora e inicie sua jornada rumo à excelência em segurança e conformidade!</strong></p>" },
  { slugs: ["planilha-planejamento-para-integracao-de-normas"],
    old: "<p><strong>Descubra como a Templum pode ajudar você a integrar normas e liberar todo o potencial do seu negócio. Faça o download agora e inicie sua jornada rumo à conformidade e excelência!</strong></p>" },
  { slugs: ["pequenas-empresas-e-iso-14001"],
    old: '<p>Conheça os detalhes da ISO 14001. <a href="/e-book-iso-14001-2015/">Baixe o nosso e-book</a> e conheça com mais detalhes e quais as formas de implementação da ISO 14001.</p>',
    norma: "ISO 14001" },
  // Dentro de <blockquote>: um bloco visual aqui quebraria a citação. Troca em prosa.
  { slugs: ["perguntas-frequentes"],
    old: '<p><strong>Quer saber mais sobre a ISO 9001?</strong> <a href="https://templum.com.br/e-book-certificacao-iso-para-empresarios/">Baixe o nosso e-book sobre a Certificação ISO para empresários</a>.</p>',
    novo: '<p><strong>Quer saber mais sobre a ISO 9001?</strong> <a href="/form/?utm_source=blog&amp;utm_medium=cta-olivia&amp;utm_campaign=perguntas-frequentes&amp;norma=ISO%209001">Fale com a Olívia, especialista da Templum</a>.</p>' },
  // Promessas soltas, sem material e sem link: só saem. O texto ao redor continua de pé.
  { slugs: ["haccp-o-que-e"],
    old: "<p>Saiba como a ISO 22000 impacta na sua organização<br>Os cuidados que seu produto deve ter na distribuição para seus clientes baixe o e-book</p>\n", novo: "" },
  { slugs: ["5w2h-usando-para-transformar-os-riscos-em-oportunidades"],
    old: "<p><strong>Bônus: Download planilha gratuita!</strong></p>\n", novo: "" },
  { slugs: ["missao-visao-valores"],
    old: " Para ajudar nesse processo, sugerimos o download de um e-book gratuito sobre descomplicar o planejamento estratégico.", novo: "" },
  // Rascunho (status=draft): não está no ar, mas publicaria com a promessa morta dentro.
  { slugs: ["tipos-planejamento-estrategico-2"], draft: true,
    old: "<p>Para aprofundar ainda mais seu conhecimento sobre essas estratégias, recomendamos o download de um e-book gratuito sobre marketing digital, que pode ajudar a entender melhor as estratégias de planejamento estratégico e operacional.</p>\n", novo: "" },
];

// Capas de material a remover (imagem do e-book/planilha que não existe mais). Só nestes
// posts, por fragmento exato: o padrão <p><a href="…/form/…"><img></a></p> também é usado
// por banner de consultoria em centenas de posts, que continuam válidos.
const CAPAS = ["e-book-mitos-e-verdades-pbqp-h", "planilha-mapeamento-de-processos",
  "planilha-perigos-e-riscos", "planilha-planejamento-para-integracao-de-normas",
  "e-book-programa-casa-verde-amarela-oportunidade-em-meio-a-crise-para-construtoras"];

// --- Geração -------------------------------------------------------------------------
const slugs = [...new Set([...CASCAS, ...TROCAS.flatMap((t) => t.slugs), ...CAPAS,
  "quanto-custa-iso-9001"])];
const posts = await (await fetch(
  `${SB}/rest/v1/blog_templum_posts?slug=in.(${slugs.join(",")})&select=slug,title,category_name,tags,content`,
  { headers: H })).json();
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

const norma = (slug, forcada) => {
  if (forcada) return forcada;
  const p = bySlug[slug];
  if (!p) return "";
  const n = normaDaPagina({ title: p.title, slug, categories: [p.category_name, ...(p.tags || [])].filter(Boolean) });
  return n && NORMAS_VALIDAS.includes(n) ? n : "";
};
const q = (s) => `$sql$${s}$sql$`;
const avisos = [];
const sql = [];

sql.push(`-- Iscas descontinuadas + CTA da Olívia — gerado por scripts/gera-sql-iscas-olivia.mjs`,
  `-- ${new Date().toISOString().slice(0, 10)}. NÃO editar à mão: regere o arquivo.`, "", "begin;", "");

sql.push(`-- 1. Backup do conteúdo que este script altera (some só com drop explícito).`,
  `create table if not exists blog_templum_posts_bkp_20260819_iscas as`,
  `select id, slug, content, now() as bkp_at from blog_templum_posts where false;`,
  `insert into blog_templum_posts_bkp_20260819_iscas (id, slug, content, bkp_at)`,
  `select id, slug, content, now() from blog_templum_posts`,
  `where slug in (${slugs.map((s) => `'${s}'`).join(", ")})`,
  `  and not exists (select 1 from blog_templum_posts_bkp_20260819_iscas b where b.id = blog_templum_posts.id);`, "");

sql.push(`-- 2. As 23 iscas ativas saem do ar. O build gera /presentes/<slug> a partir de`,
  `--    active=true, então isto some com as páginas; os 301 estão em public/_redirects.`,
  `update blog_templum_iscas set active = false where active;`, "");

sql.push(`-- 3. Lixo do RD Station impresso como TEXTO no meio do artigo (6 posts). O plugin`,
  `--    de isca deixou "window.fd('form', {...})" visível pro leitor quando o WordPress`,
  `--    foi exportado — sempre logo abaixo da promessa de download.`,
  `update blog_templum_posts`,
  `set content = regexp_replace(content, '<p>window\\.fd\\([^<]*</p>\\s*', '', 'g')`,
  `where content like '%window.fd(%';`, "");

sql.push(`-- 4. Promessas de download → CTA da Olívia.`);
for (const t of TROCAS) {
  for (const s of t.slugs) {
    const p = bySlug[s];
    if (!p) { avisos.push(`${s}: não veio na leitura anônima${t.draft ? " (é draft, esperado)" : " — CONFERIR"}`); }
    else if (!p.content.includes(t.old)) { avisos.push(`${s}: fragmento NÃO encontrado — pulado`); continue; }
    const novo = t.novo !== undefined ? t.novo : cta(s, norma(s, t.norma));
    sql.push(`update blog_templum_posts set content = replace(content, ${q(t.old)}, ${q(novo)})`,
      `where slug = '${s}';`);
  }
}
sql.push("");

sql.push(`-- 5. Cascas: o corpo era só a capa do material. Vira linha honesta + CTA.`,
  `--    A guarda de length() é de propósito: se alguém escrever conteúdo de verdade`,
  `--    nesses posts entre gerar e rodar o SQL, o UPDATE não apaga o trabalho.`);
for (const s of CASCAS) {
  const p = bySlug[s];
  if (!p) { avisos.push(`${s}: casca não encontrada — pulada`); continue; }
  if (p.content.length > 1000) { avisos.push(`${s}: ${p.content.length} chars, não é casca — pulada`); continue; }
  sql.push(`update blog_templum_posts set content = ${q(corpoDeCasca(s, norma(s)))}`,
    `where slug = '${s}' and length(content) < 1000;`);
}
sql.push("");

sql.push(`-- 6. Capa do material (imagem do e-book/planilha que não existe mais).`);
for (const s of CAPAS) {
  const p = bySlug[s];
  if (!p) { avisos.push(`${s}: não encontrado — capa não removida`); continue; }
  const m = p.content.match(/<p><a href="[^"]*\/form\/[^"]*"><img[^>]*><\/a><\/p>\n?/);
  if (!m) { avisos.push(`${s}: capa não casou — pulado`); continue; }
  sql.push(`update blog_templum_posts set content = replace(content, ${q(m[0])}, ${q("")})`,
    `where slug = '${s}';`);
}
sql.push("");

sql.push(`-- 7. quanto-custa-iso-9001: bloco inteiro do e-book (capa + h2 + bullets do que`,
  `--    vinha no PDF + "baixe abaixo"). Trocar só a última linha deixaria a lista órfã.`);
{
  const p = bySlug["quanto-custa-iso-9001"];
  const ini = p?.content.indexOf('<p><img src="/wp-content/uploads/2024/06/ebook-como-ganhar-lucro');
  const fim = p?.content.indexOf("</strong></p>", p.content.indexOf("Baixe o e-book abaixo"));
  if (!p || ini < 0 || fim < 0) avisos.push("quanto-custa-iso-9001: bloco do e-book não localizado — pulado");
  else {
    const bloco = p.content.slice(ini, fim + "</strong></p>".length);
    sql.push(`update blog_templum_posts set content = replace(content, ${q(bloco)}, ${q(cta("quanto-custa-iso-9001", "ISO 9001"))})`,
      `where slug = 'quanto-custa-iso-9001';`);
  }
}
sql.push("", "commit;", "");

writeFileSync("supabase/descontinua-iscas-cta-olivia.sql", sql.join("\n"));
console.log(`posts lidos: ${posts.length}/${slugs.length}`);
console.log(`statements: ${sql.filter((l) => l.startsWith("update ") || l.startsWith("insert ")).length}`);
console.log(avisos.length ? "\nAVISOS:\n  " + avisos.join("\n  ") : "\nsem avisos: todos os fragmentos casaram");
