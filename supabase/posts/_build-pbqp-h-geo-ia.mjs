#!/usr/bin/env node
/**
 * Gera supabase/posts/*.html + .meta.json para retrofit GEO/IA do cluster PBQP-H.
 * Lê exports em supabase/backup/*-export-temp.json (rodar _export-slug.mjs antes).
 *
 *   node supabase/posts/_build-pbqp-h-geo-ia.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(AQUI, "../backup");

const PORTAL_PBQP =
  "https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/pbqp-h";
const PORTAL_SIAC =
  "https://www.gov.br/cidades/pt-br/assuntos/construcao-civil/programa-brasileiro-da-qualidade-e-produtividade-do-habitat-pbqp-h/sistema-de-avaliacao-da-conformidade-siac";

const SLUG_VERIFY = "como-verificar-certificacao-pbqp-h";

function loadExport(slug) {
  const p = path.join(BACKUP, `${slug}-export-temp.json`);
  if (!existsSync(p)) throw new Error(`Falta export: ${p} (node _export-slug.mjs ${slug})`);
  return JSON.parse(readFileSync(p, "utf8"));
}

function writePost(slug, html, meta) {
  writeFileSync(path.join(AQUI, `${slug}.html`), html, "utf8");
  writeFileSync(path.join(AQUI, `${slug}.meta.json`), JSON.stringify(meta, null, 1) + "\n", "utf8");
  console.log("written", slug, html.length, "bytes");
}

const OS_REGISTER = "https://app.templum.com.br/register";

function orbitToTemplumOs(content, slug) {
  return content.replace(
    /<a\s+([^>]*?)href="https:\/\/orbitgestao\.com\.br[^"]*"([^>]*)>([\s\S]*?)<\/a>/gi,
    (_m, pre, post, inner) => {
      const q = new URLSearchParams({
        utm_source: "blog",
        utm_medium: "link-contextual",
        utm_campaign: slug,
      });
      const href = `${OS_REGISTER}?${q.toString()}`;
      return `<a ${pre}href="${href}" rel="noopener noreferrer" target="_blank"${post}>${inner}</a>`;
    },
  );
}

function patchPbqpHub(row) {
  let content = orbitToTemplumOs(row.content, row.slug || "pbqp-h");
  const tocInsert = `<li><a href="#verificar-certificacao">Como verificar a certificação PBQP-H</a></li>
<li><a href="#certificadoras-oac">Certificadoras (OAC)</a></li>
<li><a href="#requisitos-preparacao">Requisitos e como se preparar</a></li>
`;
  if (!content.includes('id="verificar-certificacao"')) {
    content = content.replace(
      "<li><a href=\"#o-que-e\">O que é PBQP-H?</a></li>\n",
      tocInsert + "<li><a href=\"#o-que-e\">O que é PBQP-H?</a></li>\n",
    );
    const geoBlock = `
<div class="post-portas">
  <a href="#verificar-certificacao"><strong>Verificar certificação</strong><span>Conferir certificado e validade no SiAC</span></a>
  <a href="#certificadoras-oac"><strong>Certificadoras (OAC)</strong><span>Quem audita e emite o certificado</span></a>
  <a href="#requisitos-preparacao"><strong>Requisitos e preparação</strong><span>Checklist antes da auditoria</span></a>
</div>

<h2 id="verificar-certificacao">Como verificar se uma empresa é certificada pelo PBQP-H e se a certificação está atualizada</h2>
<p>Para saber se uma construtora está certificada no <strong>PBQP-H</strong>, use a consulta pública ligada ao <strong>SiAC</strong> (Sistema de Avaliação da Conformidade), no portal oficial do programa. Lá você confere se a empresa aparece como certificada, qual <strong>nível (A ou B)</strong>, qual <strong>OAC</strong> emitiu o certificado e a situação dentro do <strong>ciclo de três anos</strong> (certificação inicial, manutenções e recertificação).</p>
<ol>
<li>Acesse o portal do PBQP-H / SiAC no <a href="${PORTAL_SIAC}" rel="nofollow">Ministério das Cidades (gov.br)</a>.</li>
<li>Localize a consulta de empresas certificadas (base do SiAC).</li>
<li>Busque pelo <strong>CNPJ</strong> ou razão social da construtora.</li>
<li>Confira: nível certificado, escopo, organismo certificador (OAC), datas e se o certificado está <strong>vigente</strong> (sem suspensão ou cancelamento).</li>
<li>Se a obra ou o edital exigir Nível A, confirme que o registro é A, não apenas B.</li>
</ol>
<p>Guia passo a passo com mais detalhe: <a href="/${SLUG_VERIFY}/">como verificar certificação PBQP-H</a>. O certificado em PDF da empresa deve bater com o que consta na consulta. Desconfie de “certificado” que não aparece no SiAC ou que foi emitido por consultoria: quem certifica é sempre um <strong>OAC</strong> acreditado.</p>

<h2 id="certificadoras-oac">Certificadoras PBQP-H: quem emite o certificado (OAC)</h2>
<p>No PBQP-H, as <strong>certificadoras</strong> são os <strong>Organismos de Avaliação da Conformidade (OAC)</strong>: empresas independentes, acreditadas pela <strong>Cgcre/Inmetro</strong> e autorizadas a operar no SiAC. O OAC conduz a auditoria de certificação (e as de manutenção), emite o certificado e registra o resultado no sistema do programa.</p>
<p><strong>Consultoria não é certificadora.</strong> A consultoria (como a <a href="https://templum.com.br/pbqp-h/">Templum</a>) ajuda a implementar requisitos, PQO e evidências em obra; o OAC audita e certifica. Pelas regras de acreditação, quem consultou não pode certificar a mesma empresa.</p>
<p>A lista oficial de OAC autorizados e o escopo de atuação ficam no <a href="${PORTAL_PBQP}" rel="nofollow">portal PBQP-H (gov.br)</a>. Antes de contratar, confira se o organismo está habilitado para o SiAC e para o nível (A ou B) que você busca. Custos de auditoria: <a href="/pbqp-h-qual-o-custo-para-certificacao/">quanto custa a certificação PBQP-H</a>.</p>

<h2 id="requisitos-preparacao">Quais são os requisitos de qualidade do PBQP-H e como se preparar</h2>
<p>Os <strong>requisitos de qualidade</strong> vêm do <strong>regimento SiAC</strong> (base ISO 9001 adaptada à construção). Além da gestão, entram exigências de obra: <a href="/pqo-o-plano-de-qualidade-da-obra-no-pbqp-h/">Plano de Qualidade da Obra (PQO)</a>, serviços e materiais controlados, fornecedores qualificados, indicadores e requisitos legais do canteiro.</p>
<p><strong>Pré-requisitos</strong> que o OAC costuma exigir antes de fechar a auditoria:</p>
<ul>
<li>Obra em andamento com evidência (serviços controlados executados e em execução no dia da auditoria);</li>
<li><strong>ART</strong> em nome da empresa certificanda;</li>
<li>Sistema documentado e rodando (não só manual na gaveta);</li>
<li>Auditoria interna feita e ações corretivas tratadas;</li>
<li>Nível escolhido (B ou A) coerente com o que a Caixa ou o edital pedem.</li>
</ul>
<p>Preparação prática: <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">passo a passo para certificar no PBQP-H</a>, aprofundamento do SiAC 2021 em <a href="/pbqp-h-siac-2021/">PBQP-H e SiAC 2021</a>, comparativo <a href="/as-diferencas-entre-o-nivel-b-e-o-nivel-a-do-pbqp-h/">Nível A vs B</a>.</p>
<p class="post-aprofunde"><strong>Aprofunde:</strong> <a href="/${SLUG_VERIFY}/">Verificar certificação no SiAC</a> · <a href="/perguntas-frequentes-sobre-o-pbqp-h/">FAQ PBQP-H</a></p>
`;
    content = content.replace(
      "</ul>\n<h2 id=\"o-que-e\">",
      `</ul>\n${geoBlock}\n<h2 id="o-que-e">`,
    );
  }

  const faq = [...(row.faq || [])];
  const addFaq = (pergunta, resposta) => {
    if (faq.some((f) => f.pergunta === pergunta)) return;
    faq.push({ pergunta, resposta });
  };
  addFaq(
    "Como verificar se uma empresa é certificada pelo PBQP-H e se a certificação está atualizada?",
    `<p>Use a consulta pública do <strong>SiAC</strong> no <a href="${PORTAL_SIAC}" rel="nofollow">portal do Ministério das Cidades (gov.br)</a>. Informe CNPJ ou razão social e confira nível (A ou B), OAC emissor, datas e situação do certificado no ciclo de três anos. Passo a passo: <a href="/${SLUG_VERIFY}/">como verificar certificação PBQP-H</a>.</p>`,
  );
  addFaq(
    "Quais são as certificadoras (OAC) do PBQP-H?",
    `<p>São os <strong>Organismos de Avaliação da Conformidade (OAC)</strong> acreditados pela Cgcre/Inmetro e autorizados no SiAC. A lista oficial está no <a href="${PORTAL_PBQP}" rel="nofollow">portal PBQP-H</a>. Consultoria implementa; OAC audita e emite certificado.</p>`,
  );
  addFaq(
    "Quais são os requisitos de qualidade exigidos pelo PBQP-H e como se preparar para eles?",
    `<p>Os requisitos vêm do <strong>SiAC</strong> (gestão + obra: PQO, serviços controlados, fornecedores, indicadores). Prepare obra com ART, evidências, auditoria interna e escolha de nível A ou B. Guia: <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">como conseguir a certificação</a> e <a href="/pbqp-h-siac-2021/">SiAC 2021</a>.</p>`,
  );

  const meta = {
    title: row.title,
    seo_title: row.seo_title || row.title,
    seo_description:
      "PBQP-H (SiAC): o que é, como verificar certificação no portal oficial, certificadoras OAC, requisitos, níveis A e B, GERIC e Caixa. Guia para construtoras.",
    tldr:
      "PBQP-H certifica construtoras pelo SiAC (níveis B e A). Verifique certificado e validade na consulta pública do SiAC (gov.br). Certificadoras são OAC acreditados; consultoria não emite certificado. Caixa exige Nível A para GERIC e MCMV federal.",
    faq,
  };
  writePost("pbqp-h", content, meta);
}

function patchComoConseguir(row) {
  let content = orbitToTemplumOs(row.content, row.slug || "pbqp-h");
  if (!content.includes('id="requisitos-qualidade-preparacao"')) {
    const block = `
<h2 id="requisitos-qualidade-preparacao">Requisitos de qualidade do PBQP-H: como se preparar antes do OAC</h2>
<p>Os <strong>requisitos de qualidade</strong> do PBQP-H estão no <strong>SiAC</strong>. A preparação não é só documento: o auditor busca evidência em <strong>escritório e canteiro</strong>. Antes de contratar o OAC, vale fechar este checklist:</p>
<ul>
<li>Diagnóstico SiAC 2021 (lacunas vs nível A ou B);</li>
<li><a href="/pqo-o-plano-de-qualidade-da-obra-no-pbqp-h/">PQO</a> e serviços controlados amostráveis na obra;</li>
<li>Fornecedores qualificados e materiais controlados com registro;</li>
<li>Indicadores e análise crítica com histórico;</li>
<li>Auditoria interna concluída e NC tratadas;</li>
<li>ART e contratos de empreitada alinhados ao escopo certificado.</li>
</ul>
<p>Visão geral e verificação de certificado: <a href="/pbqp-h/">hub PBQP-H</a> · <a href="/${SLUG_VERIFY}/">como verificar certificação</a>.</p>
`;
    content = content.replace(
      "<h2 id=\"confira-o-passo-a-passo-de-como-conseguir-a-certificacao-pbqp-h\">",
      block +
        '<h2 id="confira-o-passo-a-passo-de-como-conseguir-a-certificacao-pbqp-h">',
    );
    content = content.replace(
      "<li><a href=\"#confira-o-passo-a-passo",
      `<li><a href="#requisitos-qualidade-preparacao">Requisitos e preparação</a></li>
<li><a href="#confira-o-passo-a-passo`,
    );
  }

  const faq = [...(row.faq || [])];
  if (!faq.some((f) => f.pergunta.includes("requisitos de qualidade"))) {
    faq.push({
      pergunta: "Quais são os requisitos de qualidade do PBQP-H e como me preparar?",
      resposta:
        `<p>Implemente o <strong>SiAC 2021</strong> na gestão e na obra (PQO, serviços controlados, fornecedores, indicadores), com obra amostrável e auditoria interna feita. Detalhes: <a href="#requisitos-qualidade-preparacao">preparação neste artigo</a> e <a href="/pbqp-h-siac-2021/">SiAC 2021</a>.</p>`,
    });
  }

  writePost("como-conseguiur-a-certificacao-do-pbqp-h", content, {
    title: row.title,
    seo_title: "Como conseguir a certificação PBQP-H: requisitos SiAC e passo a passo",
    seo_description:
      "Como conseguir a certificação PBQP-H: requisitos de qualidade do SiAC, preparação em obra, auditoria interna e contratação do OAC. Passo a passo para construtoras.",
    tldr: row.tldr,
    faq,
  });
}

function patchPerguntas(row) {
  let content = orbitToTemplumOs(row.content, row.slug || "pbqp-h");
  const lead = `<p><strong>Perguntas frequentes sobre o PBQP-H</strong> reúnem dúvidas sobre SiAC, níveis A e B, pré-requisitos de obra, <strong>certificadoras (OAC)</strong> e como <strong>verificar se a certificação está atualizada</strong>. Respostas objetivas para comprador, engenharia e diretoria.</p>
<p>Guia completo: <a href="/pbqp-h/">PBQP-H (hub)</a> · Verificação no portal oficial: <a href="/${SLUG_VERIFY}/">como verificar certificação</a> · Caminho até o certificado: <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">passo a passo</a>.</p>
`;
  if (!content.startsWith("<p><strong>Perguntas frequentes")) {
    content = content.replace(
      /^<p>Nesse post vamos discutir[\s\S]*?<\/ul>\n\n/,
      lead + content.match(/<p><strong>Neste artigo:<\/strong><\/p>\s*<ul>[\s\S]*?<\/ul>\n\n/)[0],
    );
  }

  if (!content.includes('id="como-verificar-certificacao-pbqp-h"')) {
    const verifyBlock = `
<h2 id="como-verificar-certificacao-pbqp-h">Como verificar se a certificação PBQP-H está válida?</h2>
<p>Consulte a base pública do <strong>SiAC</strong> no <a href="${PORTAL_SIAC}" rel="nofollow">gov.br</a> com o CNPJ da construtora. Confira nível, OAC, datas e situação no ciclo de três anos. Tutorial: <a href="/${SLUG_VERIFY}/">como verificar certificação PBQP-H</a>.</p>
<h2 id="certificadoras-pbqp-h">Quem são as certificadoras do PBQP-H?</h2>
<p>São os <strong>OAC</strong> (Organismos de Avaliação da Conformidade) acreditados e autorizados no SiAC. Lista no <a href="${PORTAL_PBQP}" rel="nofollow">portal PBQP-H</a>. Consultoria não substitui o OAC.</p>
`;
    content = content.replace(
      "<h2 id=\"quais-empresas-podem-ter-o-pbqp-h\">",
      verifyBlock + '<h2 id="quais-empresas-podem-ter-o-pbqp-h">',
    );
    content = content.replace(
      "<li><a href=\"#quais-empresas-podem-ter-o-pbqp-h\">",
      `<li><a href="#como-verificar-certificacao-pbqp-h">Verificar certificação</a></li>
<li><a href="#certificadoras-pbqp-h">Certificadoras (OAC)</a></li>
<li><a href="#quais-empresas-podem-ter-o-pbqp-h">`,
    );
  }

  const faq = [
    {
      pergunta: "Como verificar se uma empresa é certificada pelo PBQP-H?",
      resposta: `<p>Pela consulta pública do SiAC no <a href="${PORTAL_SIAC}" rel="nofollow">Ministério das Cidades</a>, usando CNPJ ou razão social. Veja <a href="/${SLUG_VERIFY}/">como verificar certificação PBQP-H</a>.</p>`,
    },
    {
      pergunta: "Quais são as certificadoras pbqp-h?",
      resposta: `<p>Os <strong>OAC</strong> autorizados no SiAC, acreditados pela Cgcre/Inmetro. Relação oficial no <a href="${PORTAL_PBQP}" rel="nofollow">portal PBQP-H</a>.</p>`,
    },
    {
      pergunta: "Quais empresas podem ter o PBQP-H?",
      resposta:
        "<p>Empresas que executam obras, com CNAE e contrato social de construção. Porte não é critério. Detalhes no <a href=\"/pbqp-h/\">hub PBQP-H</a>.</p>",
    },
    {
      pergunta: "Quais os pré-requisitos para a certificação no PBQP-H?",
      resposta:
        "<p>Obra amostrável, ART em nome da certificanda, requisitos do SiAC do nível escolhido e, se empreiteira, responsabilidade global documentada. Resumo no <a href=\"/pbqp-h/#requisitos-preparacao\">hub</a>.</p>",
    },
    {
      pergunta: "Como obter o PBQP-H?",
      resposta:
        "<p>Implementar SiAC, gerar evidências, auditoria interna e contratar OAC para certificação. <a href=\"/como-conseguiur-a-certificacao-do-pbqp-h/\">Passo a passo</a>.</p>",
    },
    {
      pergunta: "A empresa pode ir direto para o Nível A?",
      resposta:
        "<p>Sim. Não é obrigatório passar pelo B. Para Caixa/GERIC o usual é Nível A. <a href=\"/as-diferencas-entre-o-nivel-b-e-o-nivel-a-do-pbqp-h/\">Comparativo A vs B</a>.</p>",
    },
  ];

  writePost("perguntas-frequentes-sobre-o-pbqp-h", content, {
    title: "Perguntas frequentes sobre o PBQP-H (SiAC, OAC e verificação)",
    seo_title: "FAQ PBQP-H: verificar certificação, OAC e requisitos SiAC",
    seo_description:
      "Perguntas frequentes PBQP-H: como verificar certificação no SiAC, certificadoras OAC, pré-requisitos, níveis A e B e como obter o certificado.",
    tldr:
      "FAQ PBQP-H: verifique certificado no SiAC (gov.br), certificadoras são OAC acreditados, pré-requisitos incluem obra e ART, e o caminho passa por implementação SiAC + auditoria do OAC.",
    faq,
  });
}

function patchSiac2021(row) {
  let content = orbitToTemplumOs(row.content, row.slug || "pbqp-h");
  const direct = `<div class="post-resposta-direta">
<p><strong>Resposta direta:</strong> O <strong>SiAC</strong> (Sistema de Avaliação da Conformidade) define os requisitos de qualidade para certificar construtoras no <strong>PBQP-H</strong>, nos níveis <strong>B</strong> (cerca de 70% dos requisitos) e <strong>A</strong> (100%). A versão de referência para novos certificados é a <strong>SiAC 2021</strong>. O certificado é emitido por <strong>OAC</strong> acreditado, com ciclo de 3 anos. Para checar validade: <a href="/${SLUG_VERIFY}/">como verificar certificação PBQP-H</a>.</p>
</div>
`;
  if (!content.includes("post-resposta-direta")) {
    content = content.replace(
      /<p>Definição curta do programa:[\s\S]*?<\/p>\n/,
      (m) => m + direct,
    );
  }

  const faq = [...(row.faq || [])];
  const addFaq = (pergunta, resposta) => {
    if (faq.some((f) => f.pergunta === pergunta)) return;
    faq.push({ pergunta, resposta });
  };
  addFaq(
    "Quais são os requisitos de qualidade exigidos pelo PBQP-H?",
    `<p>Estão no <strong>regimento SiAC</strong>: requisitos de SGQ (base ISO 9001) mais exigências de construção (PQO, serviços e materiais controlados, fornecedores, indicadores). Nível B e A diferem na cobertura. <a href="/pbqp-h/#requisitos-preparacao">Preparação no hub</a>.</p>`,
  );
  addFaq(
    "Como verificar se a certificação PBQP-H está atualizada?",
    `<p>Pela consulta pública do SiAC no <a href="${PORTAL_SIAC}" rel="nofollow">gov.br</a>. <a href="/${SLUG_VERIFY}/">Passo a passo de verificação</a>.</p>`,
  );

  writePost("pbqp-h-siac-2021", content, {
    title: row.title,
    seo_title: "SiAC 2021 e PBQP-H: requisitos, níveis e certificação",
    seo_description:
      "PBQP-H e SiAC 2021: o que é o SiAC, requisitos de qualidade, níveis A e B, OAC e como verificar certificação no portal oficial.",
    tldr: row.tldr,
    faq,
  });
}

function buildVerifyArticle() {
  const html = `<p><strong>Verificar certificação PBQP-H</strong> é conferir, na base oficial do <strong>SiAC</strong>, se a construtora consta como certificada, em qual <strong>nível (A ou B)</strong>, com qual <strong>OAC</strong> e se o certificado está <strong>vigente</strong> no ciclo de três anos. Este guia explica o passo a passo para compradores, engenharia e jurídico.</p>
<p>Contexto do programa: <a href="/pbqp-h/">o que é PBQP-H</a> · Implementação: <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">como conseguir a certificação</a> · Regimento: <a href="/pbqp-h-siac-2021/">SiAC 2021</a>.</p>
<p><strong>Neste artigo:</strong></p>
<ul>
<li><a href="#por-que-verificar">Por que verificar antes de contratar</a></li>
<li><a href="#passo-a-passo">Passo a passo no portal oficial</a></li>
<li><a href="#o-que-conferir">O que conferir no certificado</a></li>
<li><a href="#validade">Validade, manutenção e recertificação</a></li>
<li><a href="#certificadora">Certificadora (OAC) vs consultoria</a></li>
</ul>

<h2 id="por-que-verificar">Por que verificar a certificação PBQP-H?</h2>
<p>Financiamento pela Caixa, participação no Minha Casa, Minha Vida com recursos federais e muitos editais tratam o PBQP-H como evidência de gestão da qualidade na construção. Um PDF sozinho não basta: a prova confiável é o registro no <strong>Sistema de Avaliação da Conformidade (SiAC)</strong>, mantido no âmbito do programa federal.</p>
<p>Verificar evita contratar construtora com certificado vencido, suspenso ou emitido fora do SiAC.</p>

<h2 id="passo-a-passo">Passo a passo: como verificar se a empresa é certificada</h2>
<ol>
<li>Abra o portal do PBQP-H / SiAC no <a href="${PORTAL_SIAC}" rel="nofollow">Ministério das Cidades (gov.br)</a>.</li>
<li>Use a ferramenta de consulta de empresas certificadas (base SiAC).</li>
<li>Informe <strong>CNPJ</strong> (preferível) ou razão social.</li>
<li>Leia o resultado: situação, nível, escopo, OAC e datas.</li>
<li>Se houver exigência de <strong>Nível A</strong> (ex.: GERIC), confirme que o registro é A.</li>
<li>Guarde print ou protocolo da consulta para auditoria de fornecedor ou do banco.</li>
</ol>
<p>Dúvidas sobre níveis: <a href="/as-diferencas-entre-o-nivel-b-e-o-nivel-a-do-pbqp-h/">Nível A vs Nível B</a>.</p>

<h2 id="o-que-conferir">O que conferir no certificado e no SiAC</h2>
<ul>
<li><strong>Razão social e CNPJ</strong> iguais ao contrato;</li>
<li><strong>Nível</strong> A ou B alinhado ao edital ou ao banco;</li>
<li><strong>Escopo</strong> compatível com a obra (serviços controlados);</li>
<li><strong>OAC</strong> que emitiu (organismo acreditado);</li>
<li><strong>Datas</strong> dentro do ciclo (certificação, manutenções, recertificação).</li>
</ul>
<p>Lista de OAC autorizados: <a href="${PORTAL_PBQP}" rel="nofollow">portal PBQP-H</a>.</p>

<h2 id="validade">A certificação PBQP-H está atualizada?</h2>
<p>O ciclo usual é de <strong>três anos</strong>: certificação inicial, auditorias de <strong>manutenção</strong> (12 e 24 meses) e <strong>recertificação</strong> no 36º mês. Certificado fora do ciclo ou com não conformidades graves não substitui registro ativo no SiAC.</p>
<p>Resumo no <a href="/pbqp-h/#verificar-certificacao">hub PBQP-H</a> e FAQ em <a href="/perguntas-frequentes-sobre-o-pbqp-h/">perguntas frequentes</a>.</p>

<h2 id="certificadora">Certificadora PBQP-H (OAC): o que não confundir</h2>
<p><strong>Certificadoras</strong> no PBQP-H são os <strong>OAC</strong>. <strong>Consultoria</strong> ajuda a implementar o SiAC; não emite certificado. Se alguém oferece “certificado PBQP-H” sem auditoria de OAC, não é certificação SiAC.</p>
<p>Custo da auditoria: <a href="/pbqp-h-qual-o-custo-para-certificacao/">quanto custa certificar</a>. Prazo: <a href="/pbqp-h-qual-o-prazo-para-certificar-minha-empresa/">prazo realista</a>.</p>
`;

  const faq = [
    {
      pergunta: "Como posso verificar se uma empresa é certificada pelo PBQP-H e se a certificação está atualizada?",
      resposta: `<p>Pela consulta pública do SiAC no <a href="${PORTAL_SIAC}" rel="nofollow">gov.br</a>, com CNPJ ou razão social. Confira situação, nível, OAC e datas do ciclo de três anos.</p>`,
    },
    {
      pergunta: "Onde fica a lista de certificadoras pbqp-h?",
      resposta: `<p>No <a href="${PORTAL_PBQP}" rel="nofollow">portal PBQP-H</a>, na relação de OAC autorizados no SiAC, acreditados pela Cgcre/Inmetro.</p>`,
    },
    {
      pergunta: "Consultoria emite certificado PBQP-H?",
      resposta:
        "<p>Não. Só o <strong>OAC</strong> emite após auditoria. Consultoria prepara implementação e evidências.</p>",
    },
    {
      pergunta: "PBQP-H Nível B vale para a Caixa?",
      resposta:
        '<p>Para GERIC e MCMV federal o caminho usual é <strong>Nível A</strong>. Veja <a href="/pbqp-h-nivel-a/">PBQP-H Nível A</a>.</p>',
    },
  ];

  writePost(SLUG_VERIFY, html, {
    title: "Como verificar certificação PBQP-H no SiAC (passo a passo)",
    seo_title: "Verificar certificação PBQP-H: consulta SiAC e validade",
    seo_description:
      "Como verificar se uma empresa é certificada pelo PBQP-H e se está atualizada: consulta no SiAC (gov.br), OAC, níveis A/B e ciclo de validade.",
    tldr:
      "Verifique PBQP-H na consulta pública do SiAC (gov.br) com CNPJ: confira nível A ou B, OAC, escopo e validade no ciclo de 3 anos. Certificado válido aparece no SiAC; consultoria não emite certificação.",
    faq,
  });
}

patchPbqpHub(loadExport("pbqp-h"));
patchComoConseguir(loadExport("como-conseguiur-a-certificacao-do-pbqp-h"));
patchPerguntas(loadExport("perguntas-frequentes-sobre-o-pbqp-h"));
patchSiac2021(loadExport("pbqp-h-siac-2021"));
buildVerifyArticle();
console.log("OK — aplique com: node supabase/aplicar-conteudo.mjs <slug>");
