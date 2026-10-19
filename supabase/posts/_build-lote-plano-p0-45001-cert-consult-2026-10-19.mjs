/** P0 GEO/CRM: certificação + consultoria ISO 45001 (GSC 3 meses, out/2026). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-p0-45001-cert-consult-2026-10-19"';

const SLUG_PILLAR = "passo-a-passo-certificacao-iso-45001";
const SLUG_CUSTO = "quanto-custa-iso-45001";
const SLUG_CONSULT = "consultoria-iso-45001";
const SLUG_HUB = "iso-45001";

const FORM_PILLAR =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=passo-a-passo-certificacao-iso-45001&amp;norma=ISO%2045001";
const FORM_CUSTO =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=quanto-custa-iso-45001&amp;norma=ISO%2045001";
const FORM_CONSULT =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=consultoria-iso-45001&amp;norma=ISO%2045001";

const H2_BRASIL = `
<h2 id="como-obter-certificacao-brasil">Como obter a certificação ISO 45001 no Brasil?</h2>
<p>No Brasil, a certificação ISO 45001 segue a <strong>ABNT NBR ISO 45001</strong> (ISO 45001:2018). Você opera um SGSSO auditável, contrata um <strong>organismo acreditado pelo Inmetro/Cgcre</strong> com escopo para ISO 45001, conclui estágio 1 e estágio 2 e mantém o certificado com auditorias de manutenção por três anos. PGR e NR-1 são obrigação legal à parte; a consultoria prepara o SGSSO, a certificadora emite o certificado.</p>
<p>Resumo: <a href="#etapas">7 etapas neste guia</a> · <a href="/quanto-custa-iso-45001/">quanto custa a certificação</a> · <a href="/consultoria-iso-45001/">consultoria ISO 45001</a> · <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a>.</p>
`;

const DEO_PILLAR = `
<div ${MARKER}>
<h3 id="deo-qa-45001-brasil-orcamento">Como pedir orçamento de certificação e consultoria ISO 45001?</h3>
<p>Informe porte, unidades, grau de risco da atividade, estado do PGR e prazo desejado. Separe proposta de <strong>consultoria</strong> (implantação do SGSSO) e de <strong>organismo certificador</strong> (ciclo de 3 anos). <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-45001/">Consultoria ISO 45001</a>.</p>
<h3 id="deo-qa-45001-edital">Certificação ISO 45001 é exigida em edital ou contrato?</h3>
<p>Em alguns setores (indústria, construção, facilities) clientes e licitações pedem SGSSO certificado além das NRs. O certificado precisa cobrir o escopo da operação. <a href="/iso-45001-cliente-edital-exige-certificado/">Cliente ou edital exige ISO 45001</a>.</p>
</div>
`;

const RESPOSTAS_PILLAR_LI = `<li><strong>Consultoria e orçamento:</strong> <a href="/consultoria-iso-45001/">Consultoria ISO 45001</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/quanto-custa-iso-45001/">quanto custa a certificação</a>.</li>`;

const CTA_PILLAR = `
<p class="post-cta"><strong>Quer certificar com apoio?</strong> <a href="https://templum.com.br/consultoria/iso-45001/">Consultoria Templum ISO 45001</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/quanto-custa-iso-45001/">Quanto custa a certificação ISO 45001</a></p>
`;

const DEO_CUSTO = `
<div ${MARKER}>
<h3 id="deo-qa-q45001-consultoria-custo">Quais são os custos típicos de uma consultoria ISO 45001?</h3>
<p>Variam por porte, unidades, grau de risco, PGR existente e modelo remoto ou presencial. A consultoria cobre implantação do SGSSO; o organismo cobra auditoria à parte. <a href="/consultoria-iso-45001/">Consultoria ISO 45001</a> · <a href="/como-escolher-consultoria-iso/">como escolher consultoria</a>.</p>
<h3 id="deo-qa-q45001-certificacao-custo">Quanto custa a certificação ISO 45001 no Brasil?</h3>
<p>Soma implantação, dias de auditoria do organismo acreditado e manutenções em três anos. Peça ciclo completo na cotação. <a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo da certificação ISO 45001</a> · <a href="${FORM_CUSTO}">Diagnóstico gratuito</a>.</p>
</div>
`;

const RESPOSTAS_CUSTO_LI = `<li><strong>Certificação (passos):</strong> <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo certificação ISO 45001</a> · <a href="${FORM_CUSTO}">Diagnóstico gratuito</a>.</li>`;

const CTA_CUSTO = `
<p class="post-cta"><strong>Estimativa para sua operação:</strong> <a href="${FORM_CUSTO}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-45001/">Consultoria ISO 45001</a> · <a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo da certificação</a></p>
`;

const BLOCO_CONSULT_TOP = `
<h2 id="consultoria-para-certificacao">Consultoria ISO 45001 para obter a certificação</h2>
<p><strong>Consultoria ISO 45001</strong> estrutura perigos e riscos, requisitos legais, participação dos trabalhadores e evidências antes do organismo certificador. Não substitui PGR/NR-1 nem emite certificado. Caminho: <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo da certificação ISO 45001</a> · <a href="/quanto-custa-iso-45001/">quanto custa</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-cons45001-escolher">Como escolher a melhor consultoria ISO 45001?</h3>
<p>Experiência no seu setor e grau de risco, método para PGR e NRs, envolvimento dos trabalhadores e separação consultoria x certificadora. <a href="#escolher">Checklist nesta página</a> · <a href="/como-escolher-consultoria-iso/">como escolher consultoria ISO</a>.</p>
<h3 id="deo-qa-cons45001-diagnostico">O que esperar do diagnóstico ISO 45001 com uma consultoria?</h3>
<p>Gap frente às cláusulas 4 a 10, inventário de riscos, legal aplicável, escopo do certificado e cronograma em duas linhas de orçamento (consultoria + orientação para o organismo).</p>
<h3 id="deo-qa-cons45001-rapido">Quais passos aceleram a certificação ISO 45001 com consultoria?</h3>
<p>PGR maduro, equipe SST dedicada, participação real dos trabalhadores, auditoria interna com achados tratados e análise crítica antes do estágio 2. <a href="/passo-a-passo-certificacao-iso-45001/#etapas">7 etapas</a>.</p>
</div>
`;

const RESPOSTAS_CONSULT_LI = `<li><strong>Certificação:</strong> <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo certificação ISO 45001</a> · <a href="/quanto-custa-iso-45001/">quanto custa</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a>.</li>`;

const CTA_CONSULT = `
<p class="post-cta"><strong>Falar com consultor:</strong> <a href="https://templum.com.br/consultoria/iso-45001/">Consultoria Templum ISO 45001</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a> · <a href="/passo-a-passo-certificacao-iso-45001/">Guia de certificação ISO 45001</a></p>
`;

const HUB_AVISO_OLD =
  '<a href="/certificacao-iso-45001/">/certificacao-iso-45001/</a>).</p></div>';
const HUB_AVISO_NEW =
  '<a href="/certificacao-iso-45001/">/certificacao-iso-45001/</a>) · <a href="/consultoria-iso-45001/"><strong>consultoria ISO 45001</strong></a>.</p></div>';

const HUB_PORTA = `
  <a href="/consultoria-iso-45001/"><strong>Consultoria ISO 45001</strong><span>Implantação do SGSSO e preparação para certificar</span></a>
`;

function insertBefore(body, needle, block) {
  const i = body.indexOf(needle);
  if (i < 0) throw new Error(`anchor não encontrado: ${needle.slice(0, 50)}`);
  return body.slice(0, i) + block + "\n" + body.slice(i);
}

function appendRespostasLi(body, liHtml) {
  if (body.includes(liHtml.trim().slice(0, 45))) return body;
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

patchFile(SLUG_PILLAR, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_PILLAR_LI);
  const tableRe = /<\/table>\r?\n\r?\n\r?\n<h2 id="etapas">/;
  if (!tableRe.test(body)) throw new Error("anchor etapas");
  body = body.replace(tableRe, `</table>\n\n${H2_BRASIL}\n${DEO_PILLAR}\n\n<h2 id="etapas">`);
  return insertBefore(body, '<p class="post-aprofunde">', CTA_PILLAR);
});

patchFile(SLUG_CUSTO, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CUSTO_LI);
  const duasRe = /<\/div>\r?\n\r?\n<h2 id="duas-contas">/;
  if (!duasRe.test(body)) throw new Error("anchor duas-contas");
  body = body.replace(duasRe, `</div>\n${DEO_CUSTO}\n\n<h2 id="duas-contas">`);
  return `${body.trimEnd()}\n\n${CTA_CUSTO}\n`;
});

patchFile(SLUG_CONSULT, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CONSULT_LI);
  const fazRe = /<\/ul>\r?\n\r?\n<h2 id="faz">/;
  if (!fazRe.test(body)) throw new Error("anchor faz");
  body = body.replace(fazRe, `</ul>\n${BLOCO_CONSULT_TOP}\n\n<h2 id="faz">`);
  return insertBefore(body, '<h2 id="escolher">', CTA_CONSULT);
});

patchFile(SLUG_HUB, (body) => {
  if (body.includes('/consultoria-iso-45001/"><strong>Consultoria ISO 45001</strong>')) {
    if (body.includes(MARKER)) return body;
  }
  if (body.includes(HUB_AVISO_OLD) && !body.includes("consultoria ISO 45001</strong></a>.")) {
    body = body.replace(HUB_AVISO_OLD, HUB_AVISO_NEW);
  }
  const portaNeedle = '<a href="/quanto-custa-iso-45001/"><strong>Custo</strong>';
  if (!body.includes('/consultoria-iso-45001/"><strong>Consultoria ISO 45001</strong>')) {
    if (!body.includes(portaNeedle)) throw new Error("anchor portas hub");
    body = body.replace(portaNeedle, `${HUB_PORTA.trim()}\n  ${portaNeedle}`);
  }
  return body;
});

const metaPillar = path.join(dir, `${SLUG_PILLAR}.meta.json`);
if (existsSync(metaPillar)) {
  const m = JSON.parse(readFileSync(metaPillar, "utf8"));
  m.seo_title = "Certificação ISO 45001: passo a passo e consultoria";
  m.seo_description =
    "Certificação ISO 45001 no Brasil: passo a passo em 7 etapas, organismo acreditado, consultoria, PGR, prazo e custo do SGSSO.";
  writeFileSync(metaPillar, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_PILLAR);
}

const metaConsult = path.join(dir, `${SLUG_CONSULT}.meta.json`);
if (existsSync(metaConsult)) {
  const m = JSON.parse(readFileSync(metaConsult, "utf8"));
  m.seo_title = "Consultoria ISO 45001: certificação, custo e como escolher";
  m.seo_description =
    "Consultoria ISO 45001 para certificação: PGR, NR-1, diagnóstico, custos típicos, prazos e preparação para o organismo. Não emite certificado.";
  const extraFaq = {
    pergunta: "Consultoria ISO 45001 ajuda na certificação?",
    resposta:
      '<p>Sim: acelera perigos e riscos, legal, participação dos trabalhadores e auditoria interna antes dos estágios 1 e 2. O certificado só o organismo acreditado emite. <a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo da certificação ISO 45001</a>.</p>',
  };
  if (!m.faq.some((f) => f.pergunta.includes("ajuda na certificação"))) {
    m.faq.unshift(extraFaq);
  }
  writeFileSync(metaConsult, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_CONSULT);
}

const metaCusto = path.join(dir, `${SLUG_CUSTO}.meta.json`);
if (existsSync(metaCusto)) {
  const m = JSON.parse(readFileSync(metaCusto, "utf8"));
  m.seo_title = "Quanto custa a certificação ISO 45001: consultoria e organismo";
  writeFileSync(metaCusto, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_CUSTO);
}
