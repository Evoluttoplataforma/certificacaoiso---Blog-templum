/** P1 GEO/CRM: certificação + consultoria PBQP-H (hub, pillar, custo, consultoria). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-p1-pbqp-h-cert-consult-2026-10-19"';

const SLUG_HUB = "pbqp-h";
const SLUG_PILLAR = "como-conseguiur-a-certificacao-do-pbqp-h";
const SLUG_CUSTO = "pbqp-h-qual-o-custo-para-certificacao";
const SLUG_CONSULT = "consultoria-pbqp-h";

const FORM_HUB = "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=pbqp-h&amp;norma=PBQP-H";
const FORM_PILLAR =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=como-conseguiur-a-certificacao-do-pbqp-h&amp;norma=PBQP-H";
const FORM_CUSTO =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=pbqp-h-qual-o-custo&amp;norma=PBQP-H";
const FORM_CONSULT =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=consultoria-pbqp-h&amp;norma=PBQP-H";

const AVISO_HUB = `
<div class="post-aviso post-aviso-atualizacao"><p><strong>Quer certificar?</strong> <a href="/como-conseguiur-a-certificacao-do-pbqp-h/"><strong>Certificação PBQP-H: passo a passo</strong></a> · <a href="/pbqp-h-qual-o-custo-para-certificacao/"><strong>Quanto custa</strong></a> · <a href="/consultoria-pbqp-h/"><strong>Consultoria PBQP-H</strong></a> (URL curta <a href="/certificacao-pbqp-h/">/certificacao-pbqp-h/</a>).</p></div>
`;

const HUB_PORTAS_EXTRA = `
  <a href="/como-conseguiur-a-certificacao-do-pbqp-h/"><strong>Certificar</strong><span>Passo a passo SiAC</span></a>
  <a href="/consultoria-pbqp-h/"><strong>Consultoria PBQP-H</strong><span>PQO, obra e OAC</span></a>
  <a href="/pbqp-h-qual-o-custo-para-certificacao/"><strong>Custo</strong><span>Implantação e OAC</span></a>
`;

const RESPOSTAS_HUB = `
<h2 id="respostas-diretas">Respostas diretas: PBQP-H e certificação</h2>
<ul>
<li><strong>O que é:</strong> programa federal; certificação da construtora é pelo <strong>SiAC</strong> (níveis B ou A).</li>
<li><strong>Quem emite:</strong> <strong>OAC</strong> acreditado; consultoria não emite. <a href="#certificadoras-oac">Certificadoras</a>.</li>
<li><strong>Caixa / GERIC:</strong> costuma exigir <strong>Nível A</strong>. <a href="/pbqp-h-nivel-a/">Nível A</a> · <a href="#geric">GERIC</a>.</li>
<li><strong>Verificar certificado:</strong> consulta pública SiAC (gov.br). <a href="#verificar-certificacao">Como verificar</a> · <a href="/como-verificar-certificacao-pbqp-h/">guia</a>.</li>
<li><strong>Passo a passo:</strong> <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">como conseguir a certificação PBQP-H</a>.</li>
<li><strong>Consultoria e certificação:</strong> <a href="/consultoria-pbqp-h/">Consultoria PBQP-H</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a>.</li>
</ul>
`;

const H2_BRASIL_HUB = `
<h2 id="como-obter-certificacao-brasil">Como obter a certificação PBQP-H no Brasil?</h2>
<p>No Brasil, a certificação PBQP-H da construtora passa pelo <strong>SiAC</strong> (Ministério das Cidades): implante requisitos em escritório e obra, faça auditoria interna, contrate <strong>OAC</strong> habilitado e conclua auditoria de certificação (nível B ou A). Registro e validade ficam na consulta pública do programa. Consultoria prepara; OAC certifica.</p>
<p>Resumo: <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">passo a passo</a> · <a href="/consultoria-pbqp-h/">consultoria</a> · <a href="/pbqp-h-qual-o-custo-para-certificacao/">custo</a>.</p>
`;

const DEO_HUB = `
<div ${MARKER}>
<h3 id="deo-qa-pbqp-brasil-orcamento">Como pedir orçamento de certificação e consultoria PBQP-H?</h3>
<p>Informe obras no escopo, nível alvo (A ou B), porte e prazo. Separe proposta de <strong>consultoria</strong> (SiAC) e de <strong>OAC</strong> (ciclo de 3 anos). <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="/consultoria-pbqp-h/">Consultoria PBQP-H</a>.</p>
<h3 id="deo-qa-pbqp-brasil-caixa">PBQP-H é exigido pela Caixa?</h3>
<p>Para crédito GERIC e MCMV federal, a Caixa exige construtora certificada, em geral <strong>Nível A</strong>. <a href="#geric">PBQP-H e GERIC</a> · <a href="/principais-duvidas-sobre-o-geric/">dúvidas GERIC</a>.</p>
</div>
`;

const CTA_HUB = `
<p class="post-cta"><strong>Quer certificar com apoio?</strong> <a href="https://templum.com.br/pbqp-h/">Consultoria Templum PBQP-H</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">Guia de certificação PBQP-H</a></p>
`;

const RESPOSTAS_PILLAR_LI = `<li><strong>Orçamento e apoio:</strong> <a href="/consultoria-pbqp-h/">Consultoria PBQP-H</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/pbqp-h-qual-o-custo-para-certificacao/">quanto custa</a>.</li>`;

const DEO_PILLAR = `
<div ${MARKER}>
<h3 id="deo-qa-pbqp-pillar-brasil">Como obter a certificação PBQP-H no Brasil?</h3>
<p>Implemente SiAC 2021, opere PQO e serviços controlados, faça auditoria interna e contrate OAC para certificação no nível escolhido. Detalhe: <a href="#confira-o-passo-a-passo-de-como-conseguir-a-certificacao-pbqp-h">passos neste guia</a>.</p>
<h3 id="deo-qa-pbqp-pillar-orcamento">Como pedir orçamento de consultoria e OAC?</h3>
<p>Descreva obras, nível A/B e maturidade do SGQ. Duas linhas na proposta. <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/consultoria-pbqp-h/">Consultoria PBQP-H</a>.</p>
</div>
`;

const TAB_OAC = `
<h2 id="consultoria-organismo-oac">Consultoria e OAC: qual a diferença?</h2>
<p>A consultoria prepara o SiAC; o OAC audita e emite o certificado registrado no portal. Contratos separados.</p>
<table>
<thead><tr><th>Papel</th><th>Função</th><th>Emite certificado?</th></tr></thead>
<tbody>
<tr><td>Consultoria</td><td>Diagnóstico, PQO, documentação, auditoria interna assistida</td><td>Não</td></tr>
<tr><td>OAC</td><td>Auditoria de certificação, manutenções, recertificação SiAC</td><td>Sim</td></tr>
<tr><td>Equipe da construtora</td><td>Operação em obra, registros, indicadores</td><td>Não</td></tr>
</tbody>
</table>
`;

const CTA_PILLAR = `
<p class="post-cta"><strong>Quer certificar?</strong> <a href="https://templum.com.br/pbqp-h/">Consultoria Templum PBQP-H</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/consultoria-pbqp-h/">Consultoria PBQP-H</a></p>
`;

const DEO_CUSTO = `
<div ${MARKER}>
<h3 id="deo-qa-pbqp-custo-brasil">Qual o preço da certificação PBQP-H no Brasil?</h3>
<p>Soma implantação SiAC, consultoria e dias de auditoria do OAC no ciclo de três anos. Peça orçamento com obras e nível definidos. <a href="${FORM_CUSTO}">Estimativa com a Templum</a>.</p>
</div>
`;

const CTA_CUSTO = `
<p class="post-cta"><strong>Estimativa para sua construtora:</strong> <a href="${FORM_CUSTO}">Diagnóstico gratuito</a> · <a href="/consultoria-pbqp-h/">Consultoria PBQP-H</a> · <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">Passo a passo da certificação</a></p>
`;

const DEO_CONSULT = `
<div ${MARKER}>
<h3 id="deo-qa-cons-pbqp-cert">Consultoria ajuda na certificação PBQP-H?</h3>
<p>Sim: acelera SiAC, PQO, evidência em obra e auditoria interna. Certificado só o OAC emite. <a href="/como-conseguiur-a-certificacao-do-pbqp-h/">Certificação PBQP-H</a>.</p>
</div>
`;

function insertBefore(body, needle, block) {
  const i = body.indexOf(needle);
  if (i < 0) throw new Error(`anchor não encontrado: ${needle.slice(0, 50)}`);
  return body.slice(0, i) + block + "\n" + body.slice(i);
}

function appendRespostasLi(body, liHtml) {
  if (body.includes(liHtml.trim().slice(0, 40))) return body;
  const anchor = '<h2 id="respostas-diretas">';
  const i = body.indexOf(anchor);
  if (i < 0) throw new Error("respostas-diretas não encontrado");
  const j = body.indexOf("</ul>", i);
  if (j < 0) throw new Error("fechamento ul respostas");
  return body.slice(0, j) + liHtml + "\n" + body.slice(j);
}

function patchFile(slug, fn) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) {
    console.warn("skip", slug);
    return;
  }
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) {
    console.log(slug, "ja patchado");
    return;
  }
  body = fn(body);
  writeFileSync(p, body, "utf8");
  console.log(slug, "patch ok", body.length);
}

patchFile(SLUG_HUB, (body) => {
  if (!body.includes("post-aviso-atualizacao")) {
    body = body.replace('<div class="post-portas">', `${AVISO_HUB.trim()}\n\n<div class="post-portas">`);
  }
  if (!body.includes('href="/como-conseguiur-a-certificacao-do-pbqp-h/"><strong>Certificar</strong>')) {
    const needle = '<a href="#requisitos-preparacao"><strong>Requisitos e preparação</strong>';
    body = body.replace(needle, `${HUB_PORTAS_EXTRA.trim()}\n  ${needle}`);
  }
  if (!body.includes('<h2 id="respostas-diretas">')) {
    body = body.replace(
      '<h2 id="verificar-certificacao">',
      `${RESPOSTAS_HUB.trim()}\n\n<h2 id="verificar-certificacao">`,
    );
  } else {
    body = appendRespostasLi(body, `<li><strong>Consultoria:</strong> <a href="/consultoria-pbqp-h/">Consultoria PBQP-H</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a>.</li>`);
  }
  body = insertBefore(body, '<h2 id="o-que-e">', `${H2_BRASIL_HUB}\n${DEO_HUB}\n`);
  return insertBefore(body, '<h2 id="aprofunde">', CTA_HUB);
});

patchFile(SLUG_PILLAR, (body) => {
  if (!body.includes('<h2 id="respostas-diretas">')) {
    const afterIntro = '<p><strong>Neste artigo:</strong></p>';
    body = body.replace(
      afterIntro,
      `<h2 id="respostas-diretas">Respostas diretas: certificação PBQP-H</h2>
<ul>
<li><strong>Passos:</strong> SiAC, auditoria interna, OAC. <a href="#confira-o-passo-a-passo-de-como-conseguir-a-certificacao-pbqp-h">Lista</a>.</li>
<li><strong>Obra:</strong> evidência em canteiro no dia da auditoria.</li>
<li><strong>Quem certifica:</strong> OAC, não consultoria.</li>
${RESPOSTAS_PILLAR_LI}
</ul>
${afterIntro}`,
    );
  } else {
    body = appendRespostasLi(body, RESPOSTAS_PILLAR_LI);
  }
  const beforePasso = '<h2 id="confira-o-passo-a-passo-de-como-conseguir-a-certificacao-pbqp-h">';
  body = insertBefore(body, beforePasso, `${DEO_PILLAR}\n${TAB_OAC}\n`);
  return insertBefore(body, '<h2 id="implementacao-do-siac-2021">', CTA_PILLAR);
});

patchFile(SLUG_CUSTO, (body) => {
  const duasRe = /<\/ul>\s+<h2 id="duas-contas">/;
  if (!duasRe.test(body)) throw new Error("anchor custo");
  body = body.replace(duasRe, `</ul>\n${DEO_CUSTO}\n\n<h2 id="duas-contas">`);
  if (!body.includes("post-cta")) {
    body = `${body.trimEnd()}\n\n${CTA_CUSTO}\n`;
  }
  return body;
});

patchFile(SLUG_CONSULT, (body) => {
  const needle = '<h2 id="consultoria-para-certificacao">';
  if (!body.includes(needle)) throw new Error("consultoria-para-certificacao");
  return body.replace(
    needle,
    `${DEO_CONSULT}\n\n${needle}`,
  );
});

const metaHub = path.join(dir, `${SLUG_HUB}.meta.json`);
if (existsSync(metaHub)) {
  const m = JSON.parse(readFileSync(metaHub, "utf8"));
  m.seo_title = "PBQP-H: certificação, consultoria e SiAC (Caixa)";
  m.seo_description =
    "PBQP-H e certificação SiAC: como verificar, OAC, consultoria, passo a passo, custo, Nível A, GERIC e Caixa. Guia para construtoras.";
  writeFileSync(metaHub, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_HUB);
}

const metaPillar = path.join(dir, `${SLUG_PILLAR}.meta.json`);
if (existsSync(metaPillar)) {
  const m = JSON.parse(readFileSync(metaPillar, "utf8"));
  m.seo_title = "Certificação PBQP-H: passo a passo, consultoria e custo";
  writeFileSync(metaPillar, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_PILLAR);
}
