#!/usr/bin/env node
/**
 * PBQP-H SEO/GEO/E-E-A-T (set/2026): hub + satellites.
 * - seo_title / seo_description
 * - FAQ curta no hub (FAQPage)
 * - tabela A/B, bloco experiência, mitos do ebook, CTA cadastro
 * - CTAs ebook nos satellites do mapa
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
{
  const envPath = path.join(ROOT, ".env");
  if (existsSync(envPath)) {
    for (const linha of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const t = linha.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const SB = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY no .env");
  process.exit(1);
}

const EBOOK =
  "https://templum.com.br/presentes/e-book-mitos-e-verdades-do-pbqp-h/?utm_source=blog&utm_medium=cta-ebook&utm_campaign=pbqp-h-ebook";

function ebookCta(slug, gancho) {
  return `<p><strong>Guia PBQP-H e GERIC:</strong> ${gancho} <a href="${EBOOK}&utm_content=${slug}">Baixe o ebook gratuito</a> (cadastro rápido) e veja o caminho até o crédito e a certificação.</p>\n`;
}

async function getPost(slug) {
  const url = `${SB}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id,slug,content,seo_title,seo_description,tldr,faq`;
  const res = await fetch(url, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`GET ${slug}: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  if (!rows[0]) throw new Error(`Post não encontrado: ${slug}`);
  return rows[0];
}

async function patch(slug, body) {
  const res = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`PATCH ${slug}: ${res.status} ${await res.text()}`);
  console.log("ok", slug, Object.keys(body).join(","));
}

function insertOnce(content, marker, insertion) {
  if (content.includes(insertion.trim().slice(0, 80))) return content;
  if (!content.includes(marker)) throw new Error(`Marker não encontrado: ${marker.slice(0, 60)}…`);
  return content.replace(marker, `${marker}${insertion}`);
}

function replaceOnce(content, from, to) {
  if (!content.includes(from)) throw new Error(`Trecho não encontrado: ${from.slice(0, 60)}…`);
  return content.replace(from, to);
}

const hubFaq = [
  {
    pergunta: "Quais empresas podem ter o PBQP-H?",
    resposta:
      "<p>Qualquer empresa que execute obras pode buscar o PBQP-H, desde que a atividade de construção conste no contrato social e o CNAE seja de construção. O porte não é critério: o SiAC avalia processos e evidências em obra.</p>",
  },
  {
    pergunta: "Preciso implementar o Nível B e o Nível A?",
    resposta:
      "<p>Não. A construtora escolhe o nível na auditoria. O Nível B cobre cerca de 70% dos requisitos; o Nível A cobre 100%. Para crédito GERIC e participação no Minha Casa, Minha Vida, a Caixa exige Nível A.</p>",
  },
  {
    pergunta: "Qual é a diferença entre o Nível B e o Nível A?",
    resposta:
      "<p>No Nível B: cerca de 70% dos requisitos e no mínimo 40% dos serviços controlados. No Nível A: 100% dos requisitos e 100% dos serviços controlados. Detalhes em <a href=\"/as-diferencas-entre-o-nivel-b-e-o-nivel-a-do-pbqp-h/\">diferenças entre os níveis</a>.</p>",
  },
  {
    pergunta: "Quais são os pré-requisitos para a empresa se certificar no PBQP-H?",
    resposta:
      "<p>Obra em andamento (na auditoria: ao menos 50% dos serviços controlados já executados e 1/4 em execução no dia), ART em nome da empresa certificanda e, se empreiteira, responsabilidade global da empreitada com contrato registrado. Sem isso a auditoria não fecha evidência.</p>",
  },
  {
    pergunta: "Preciso do PBQP-H para conseguir o GERIC?",
    resposta:
      "<p>Sim. A Caixa só avalia o GERIC de construtoras com PBQP-H (Nível A na prática do crédito à produção). O PBQP-H atesta qualidade de obra e gestão; o GERIC mede capacidade financeira. Veja <a href=\"#geric\">como os dois se conectam</a>.</p>",
  },
  {
    pergunta: "Qual é a validade da certificação PBQP-H?",
    resposta:
      "<p>O ciclo é de 3 anos, com auditorias de manutenção em 12 e 24 meses e recertificação no 36º mês. O certificado é emitido por organismo acreditado (OAC), não pela consultoria.</p>",
  },
  {
    pergunta: "Quem emite o certificado PBQP-H?",
    resposta:
      "<p>Organismos de Avaliação da Conformidade (OAC) acreditados pela Cgcre/Inmetro e autorizados no SiAC. Consulte a lista oficial no portal do PBQP-H do Ministério das Cidades.</p>",
  },
];

const hubInsertAposNivelB = `
<h2 id="comparativo-niveis"><strong>Nível A vs Nível B: resumo</strong></h2>
<table>
<thead><tr><th>Critério</th><th>Nível B</th><th>Nível A</th></tr></thead>
<tbody>
<tr><td>Requisitos do SiAC</td><td>Cerca de 70%</td><td>100%</td></tr>
<tr><td>Serviços controlados</td><td>Mínimo 40%</td><td>100%</td></tr>
<tr><td>Uso típico</td><td>Porta de entrada</td><td>Exigido pela Caixa para GERIC e MCMV</td></tr>
</tbody>
</table>
<p>Quer o detalhe serviço a serviço? Leia <a href="/as-diferencas-entre-o-nivel-b-e-o-nivel-a-do-pbqp-h/">as diferenças entre os níveis A e B</a> e o foco em <a href="/pbqp-h-nivel-a/">PBQP-H Nível A</a>.</p>
<h2 id="experiencia-auditoria"><strong>O que costuma travar na auditoria (visão de quem implementa)</strong></h2>
<p>Na prática de implantação com construtoras, o SiAC não reprova por “falta de pasta bonita”. Reprova por evidência fraca em obra: serviço controlado sem registro, ART em nome errado, empreitada parcial tentando parecer global, ou PQO que não conversa com o que está no canteiro. Se a Ficha de Avaliação de Desempenho (FAD) entra no <a href="/pqo-o-plano-de-qualidade-da-obra-no-pbqp-h/">Plano de Qualidade da Obra</a>, ela precisa estar alinhada ao projeto, não só citada no documento.</p>
<p>Antes de marcar a auditoria externa, faça uma auditoria interna com o mesmo rigor: amostra de serviços, registros do dia e rastreabilidade de materiais. Quem chega “só com procedimento” costuma voltar com não conformidade evitável.</p>
`;

const hubMitosEbook = `
<h2 id="mitos-e-verdades"><strong>Mitos e verdades do PBQP-H</strong></h2>
<p><strong>Verdade:</strong> a Caixa e outras instituições exigem a certificação para financiamento construtivo e para executar empreendimentos com recursos públicos federais.</p>
<p><strong>Mito:</strong> o PBQP-H seria só para grandes construtoras. O SiAC olha processos e evidências, não o porte.</p>
<p><strong>Verdade:</strong> aderir ao Minha Casa, Minha Vida pela via federal exige PBQP-H (Nível A) entre os requisitos da construtora.</p>
<p><strong>Mito:</strong> o programa criaria “linhas novas” de crédito. Ele organiza o uso de fontes já existentes (como FGTS e poupança), via qualidade comprovada.</p>
<p><strong>Mito:</strong> só valeria para obra de interesse social. Padronização, menos retrabalho e menos custo pós-obra valem para quem compete no mercado privado também.</p>
${ebookCta("pbqp-h", "Separe exigência da Caixa de boato de corredor.")}
<p>Continue no cluster: <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">como certificar</a>, <a href="/pbqp-h-siac-2021/">PBQP-H e SiAC 2021</a>, <a href="/principais-duvidas-sobre-o-geric/">dúvidas sobre o GERIC</a>, <a href="/pbqp-h-qual-o-custo-para-certificacao/">custo</a> e <a href="/pbqp-h-qual-o-prazo-para-certificar-minha-empresa/">prazo</a>.</p>
`;

async function patchHub() {
  const post = await getPost("pbqp-h");
  let content = post.content;

  const markerNivelB =
    `<p>O Nível B tem validade correspondente ao contrato com o organismo certificador de 3 anos, porém anualmente a empresa passa por auditorias de manutenção nas quais o certificado é renovado. Após 3 anos, o contrato com o organismo certificador é renovado. Após o período de 3 anos a empresa pode evoluir seu sistema de gestão para o Nível A.</p>\n`;
  content = insertOnce(content, markerNivelB, hubInsertAposNivelB);

  const oldTail = `<p>Estas são as principais novidades do SiAC 2018. A <a href="https://templum.com.br/">Templum Consultoria</a> está preparada para esclarecer suas dúvidas sobre todas estas importantes modificações.</p>
<blockquote>
<p><strong>[Construção Civil] PBQP-H</strong> <a href="/pbqp-h-qual-o-custo-para-certificacao/">Qual o Custo para Certificação do PBQP-H</a></p>
</blockquote>
`;
  content = replaceOnce(content, oldTail, `<p>Estas são as principais novidades do SiAC 2018. Para o regimento vigente, use o guia <a href="/pbqp-h-siac-2021/">PBQP-H e SiAC 2021</a>.</p>\n${hubMitosEbook}`);

  // TOC: incluir comparativo e mitos
  const tocOld = `<li><a href="#duvidas">Dúvidas Frequentes</a></li>\n</ul>`;
  const tocNew = `<li><a href="#comparativo-niveis">Nível A vs Nível B</a></li>
<li><a href="#experiencia-auditoria">O que costuma travar na auditoria</a></li>
<li><a href="#mitos-e-verdades">Mitos e verdades</a></li>
<li><a href="#duvidas">Dúvidas Frequentes</a></li>
</ul>`;
  if (content.includes(tocOld) && !content.includes('href="#mitos-e-verdades"')) {
    content = content.replace(tocOld, tocNew);
  }

  await patch("pbqp-h", {
    seo_title: "PBQP-H: o que é, níveis SiAC e quando a Caixa exige",
    seo_description:
      "O PBQP-H (SiAC) é a certificação de qualidade da construção exigida pela Caixa para financiamento e MCMV. Veja níveis A e B, pré-requisitos e o caminho até o certificado.",
    tldr: "O PBQP-H (Programa Brasileiro da Qualidade e Produtividade do Habitat) certifica a gestão da qualidade de construtoras pelo SiAC, nos níveis B e A. A Caixa exige o Nível A para crédito via GERIC e para participar do Minha Casa, Minha Vida com recursos federais.",
    faq: hubFaq,
    content,
    revised_at: new Date().toISOString(),
  });
}

async function appendEbookIfMissing(slug, gancho, seo) {
  const post = await getPost(slug);
  const body = { ...(seo || {}) };
  let content = post.content;
  if (!content.includes("utm_campaign=pbqp-h-ebook")) {
    const cta = ebookCta(slug, gancho);
    // Insere antes do último banner/form se existir; senão no fim.
    const bannerIdx = content.lastIndexOf("solicite-proposta-pb.webp");
    if (bannerIdx > 0) {
      const pStart = content.lastIndexOf("<p>", bannerIdx);
      content = content.slice(0, pStart) + cta + content.slice(pStart);
    } else {
      content = content.trimEnd() + "\n" + cta;
    }
    body.content = content;
  }
  if (seo?.seo_title && !post.seo_title) body.seo_title = seo.seo_title;
  if (seo?.seo_description && !post.seo_description) body.seo_description = seo.seo_description;
  // Sempre atualiza title/description quando fornecidos (melhoria CTR)
  if (seo?.seo_title) body.seo_title = seo.seo_title;
  if (seo?.seo_description) body.seo_description = seo.seo_description;
  if (Object.keys(body).length) await patch(slug, body);
}

async function rewriteIsoVsPbqp() {
  const content = `<p>A <a href="/iso-9001/">ISO 9001</a> e o <a href="/pbqp-h/">PBQP-H</a> tratam de sistema de gestão da qualidade, mas não resolvem o mesmo problema. A ISO 9001 é internacional e serve a qualquer setor. O PBQP-H, pelo SiAC, é nacional e feito para construtoras que precisam comprovar qualidade de obra (e, na prática, acessar crédito da Caixa).</p>
<table>
<thead><tr><th>Ponto</th><th>ISO 9001</th><th>PBQP-H (SiAC)</th></tr></thead>
<tbody>
<tr><td>Alcance</td><td>Internacional, qualquer setor</td><td>Brasil, construção civil</td></tr>
<tr><td>Base</td><td>Norma ISO 9001</td><td>Requisitos adaptados da ISO 9001 + exigências de obra</td></tr>
<tr><td>Níveis</td><td>Não há níveis A/B</td><td>Nível B (~70%) e Nível A (100%)</td></tr>
<tr><td>Obra / canteiro</td><td>Genérico (quando aplicável)</td><td>PQO, serviços e materiais controlados, rastreabilidade</td></tr>
<tr><td>Caixa / MCMV</td><td>Não substitui o PBQP-H</td><td>Nível A é o caminho usual para GERIC e programas federais</td></tr>
</tbody>
</table>
<h2>O que o PBQP-H acrescenta à lógica da ISO 9001</h2>
<p>Além dos requisitos de gestão, o SiAC puxa itens típicos de construção, entre eles: objetivos ligados à sustentabilidade do canteiro; <a href="/pqo-o-plano-de-qualidade-da-obra-no-pbqp-h/">Plano de Qualidade da Obra (PQO)</a>; planejamento da execução; qualificação e avaliação de fornecedores; materiais e serviços controlados; serviços laboratoriais; análise crítica de projeto do cliente; identificação e rastreabilidade.</p>
<p>Por isso uma empresa no Nível A do PBQP-H costuma estar perto de também certificar ISO 9001: a base de gestão já foi montada, e o organismo pode auditar de forma integrada quando fizer sentido.</p>
<h2>Qual a sua empresa precisa?</h2>
<p>Se o objetivo é mercado privado amplo ou exportação de sistema de gestão, a ISO 9001 é o referencial. Se o objetivo é financiar obra com a Caixa, participar do Minha Casa, Minha Vida ou atender edital que pede PBQP-H, o caminho é o SiAC (em geral no Nível A). Muitas construtoras fazem os dois.</p>
<p>Passo a passo da certificação na construção: <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">como conseguir o PBQP-H</a>. Comparativo de níveis: <a href="/as-diferencas-entre-o-nivel-b-e-o-nivel-a-do-pbqp-h/">A vs B</a>.</p>
${ebookCta("quais-as-diferencas-entre-o-sistema-iso-9001-e-o-pbqp-h", "ISO 9001 e PBQP-H se complementam na obra.")}
<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=quais-as-diferencas-entre-o-sistema-iso-9001-e-o-pbqp-h&amp;norma=PBQP-H"><img src="/wp-content/uploads/2019/03/solicite-proposta-pb.webp" alt="Consultoria Para PBQP-H" loading="lazy" decoding="async"></a></p>
`;
  await patch("quais-as-diferencas-entre-o-sistema-iso-9001-e-o-pbqp-h", {
    content,
    revised_at: new Date().toISOString(),
  });
}

async function main() {
  const onlyIso = process.argv.includes("--only-iso");
  if (onlyIso) {
    await rewriteIsoVsPbqp();
    console.log("Concluído (só ISO vs PBQP).");
    return;
  }

  await patchHub();

  await appendEbookIfMissing(
    "como-conseguiur-a-certificacao-do-pbqp-h",
    "Do diagnóstico à auditoria, o guia resume pré-requisitos e o ciclo SiAC.",
    {
      seo_title: "Como conseguir a certificação PBQP-H (passo a passo)",
      seo_description:
        "Implemente o SiAC, prepare a obra, faça auditoria interna e contrate um OAC. Veja o caminho prático até o certificado PBQP-H Nível A ou B.",
    },
  );

  await appendEbookIfMissing(
    "pbqp-h-nivel-a",
    "O Minha Casa, Minha Vida e o GERIC pedem Nível A: entenda o que isso exige de verdade.",
    {
      seo_title: "PBQP-H Nível A: o que a Caixa exige na prática",
      seo_description:
        "O Nível A do SiAC cobre 100% dos requisitos e dos serviços controlados. Veja quando ele é obrigatório e o que muda em relação ao Nível B.",
    },
  );

  await appendEbookIfMissing(
    "as-diferencas-entre-o-nivel-b-e-o-nivel-a-do-pbqp-h",
    "Compare requisitos e serviços controlados antes de escolher o nível da auditoria.",
    {
      seo_title: "PBQP-H Nível A e B: diferenças que mudam a auditoria",
      seo_description:
        "Nível B: cerca de 70% dos requisitos e 40% dos serviços. Nível A: 100%. Veja o comparativo e o que a Caixa costuma exigir.",
    },
  );

  await appendEbookIfMissing(
    "siac-pbqp-h",
    "O SiAC é o sistema por trás do certificado: veja como ele se conecta ao crédito e ao MCMV.",
    {
      seo_title: "SiAC no PBQP-H: o que é e como funciona",
      seo_description:
        "O SiAC avalia o sistema de gestão da qualidade das construtoras com base na ISO 9001. Entenda níveis, ciclo de auditoria e relação com o PBQP-H.",
    },
  );

  await appendEbookIfMissing(
    "pbqp-h-siac-2021",
    "Regimento vigente, níveis e pré-requisitos em um só material para baixar.",
    null,
  );

  await appendEbookIfMissing(
    "principais-duvidas-sobre-o-geric",
    "GERIC e PBQP-H andam juntos: o ebook mostra a ordem certa até o crédito da Caixa.",
    null,
  );

  await rewriteIsoVsPbqp();
  await patch("quais-as-diferencas-entre-o-sistema-iso-9001-e-o-pbqp-h", {
    seo_title: "ISO 9001 e PBQP-H: diferenças e quando usar cada um",
    seo_description:
      "A ISO 9001 vale para qualquer setor; o PBQP-H (SiAC) é específico da construção e exigido pela Caixa. Veja o que muda na prática.",
  });

  await appendEbookIfMissing(
    "pbqp-h-qual-o-custo-para-certificacao",
    "Além da faixa de investimento, veja o panorama completo até o GERIC.",
    {
      seo_title: "Quanto custa a certificação PBQP-H?",
      seo_description:
        "O custo varia com porte, obras, processos e prazo. Entenda as frentes de implementação, auditoria interna e auditoria do organismo certificador.",
    },
  );

  await appendEbookIfMissing(
    "pbqp-h-qual-o-prazo-para-certificar-minha-empresa",
    "Prazo realista de implantação e o que precisa estar pronto na auditoria.",
    {
      seo_title: "Prazo para certificar no PBQP-H: o que é realista",
      seo_description:
        "O ciclo completo costuma girar em torno de 12 meses, com variação conforme engajamento e porte. Veja as etapas até o certificado.",
    },
  );

  console.log("Concluído.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
