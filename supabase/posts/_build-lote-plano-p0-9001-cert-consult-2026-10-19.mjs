/** P0 GEO/CRM: certificação + consultoria ISO 9001 (GSC 3 meses, out/2026). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-p0-9001-cert-consult-2026-10-19"';

const SLUG_PILLAR = "passo-a-passo-certificacao-iso-9001";
const SLUG_CUSTO = "quanto-custa-iso-9001";
const SLUG_CONSULT = "consultoria-iso-9001";
const SLUG_HUB = "iso-9001";

const FORM_PILLAR =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=passo-a-passo-certificacao-iso-9001&amp;norma=ISO%209001";
const FORM_CUSTO =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=quanto-custa-iso-9001&amp;norma=ISO%209001";
const FORM_CONSULT =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=consultoria-iso-9001&amp;norma=ISO%209001";

const H2_BRASIL = `
<h2 id="como-obter-certificacao-brasil">Como obter a certificação ISO 9001 no Brasil?</h2>
<p>No Brasil, a certificação ISO 9001 segue a <strong>ABNT NBR ISO 9001</strong> (mesmo conteúdo da ISO internacional). Você opera um SGQ auditável, contrata um <strong>organismo acreditado pelo Inmetro/Cgcre</strong> com escopo para ISO 9001, conclui estágio 1 (prontidão) e estágio 2 (evidência) e mantém o certificado com auditorias de manutenção por três anos. Consultoria prepara; certificadora emite. Não podem ser a mesma empresa no mesmo ciclo.</p>
<p>Resumo: <a href="#etapas">7 etapas neste guia</a> · <a href="/quanto-custa-iso-9001/">quanto custa a certificação</a> · <a href="/consultoria-iso-9001/">consultoria ISO 9001</a>.</p>
`;

const DEO_PILLAR = `
<div ${MARKER}>
<h3 id="deo-qa-9001-brasil-orcamento">Como pedir orçamento de certificação e consultoria ISO 9001?</h3>
<p>Informe porte, unidades no escopo, setor e se já existe algum SGQ. Separe proposta de <strong>consultoria</strong> (implantação) e de <strong>organismo certificador</strong> (ciclo de 3 anos). <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-9001/">Consultoria ISO 9001</a>.</p>
<h3 id="deo-qa-9001-edital">Certificação ISO 9001 é exigida em edital ou contrato B2B?</h3>
<p>Sim, em licitações, homologação de fornecedor e contratos com grandes clientes. O certificado precisa cobrir o escopo do serviço que você vende. <a href="/iso-9001-cliente-edital-exige-certificado/">Cliente ou edital exige ISO 9001</a>.</p>
</div>
`;

const RESPOSTAS_PILLAR_LI = `<li><strong>Consultoria e orçamento:</strong> <a href="/consultoria-iso-9001/">Consultoria ISO 9001</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/quanto-custa-iso-9001/">quanto custa a certificação</a>.</li>`;

const CTA_PILLAR = `
<p class="post-cta"><strong>Quer certificar com apoio?</strong> <a href="https://templum.com.br/consultoria/iso-9001/">Consultoria Templum ISO 9001</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/quanto-custa-iso-9001/">Quanto custa a certificação ISO 9001</a></p>
`;

const DEO_CUSTO = `
<div ${MARKER}>
<h3 id="deo-qa-q9001-consultoria-custo">Quais são os custos típicos de uma consultoria ISO 9001?</h3>
<p>Variam por porte, escopo, método (presencial, remoto, fases) e maturidade. A consultoria cobre implantação; o organismo cobra auditoria à parte. Compare ciclo completo (certificação + manutenções). <a href="#cuidados-escolher-consultoria">Como escolher consultoria</a> · <a href="/consultoria-iso-9001/">Consultoria ISO 9001</a>.</p>
<h3 id="deo-qa-q9001-consultoria-retorno">Consultoria ISO 9001 vale o investimento antes da certificação?</h3>
<p>Reduz retrabalho na fase 2, acelera evidência operacional e prepara auditoria interna. O retorno costuma aparecer em prazo previsível e menos NC na certificação. Passos: <a href="/passo-a-passo-certificacao-iso-9001/">certificação ISO 9001</a>.</p>
</div>
`;

const RESPOSTAS_CUSTO_LI = `<li><strong>Consultoria:</strong> modelos e cuidados em <a href="#cuidados-escolher-consultoria">escolher consultoria</a> · <a href="/consultoria-iso-9001/">Consultoria ISO 9001</a> · <a href="${FORM_CUSTO}">Diagnóstico gratuito</a>.</li>`;

const CTA_CUSTO = `
<p class="post-cta"><strong>Estimativa para sua operação:</strong> <a href="${FORM_CUSTO}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-9001/">Consultoria ISO 9001</a> · <a href="/passo-a-passo-certificacao-iso-9001/">Passo a passo da certificação</a></p>
`;

const BLOCO_CONSULT_TOP = `
<h2 id="consultoria-para-certificacao">Consultoria ISO 9001 para obter a certificação</h2>
<p><strong>Consultoria ISO 9001</strong> é o apoio para implantar o SGQ e chegar preparado ao organismo certificador. Não substitui a auditoria de certificação. Depois do diagnóstico, o caminho comercial segue o <a href="/passo-a-passo-certificacao-iso-9001/">passo a passo da certificação ISO 9001</a> e o orçamento em <a href="/quanto-custa-iso-9001/">quanto custa a certificação</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-cons9001-escolher">Como escolher a melhor consultoria ISO 9001?</h3>
<p>Compare experiência no seu setor, método (não só documento), clareza sobre horas internas, auditoria interna assistida e separação consultoria x certificadora. Checklist: <a href="/como-escolher-consultoria-iso/">como escolher consultoria ISO</a>.</p>
<h3 id="deo-qa-cons9001-diagnostico">O que esperar do diagnóstico ISO 9001 com uma consultoria?</h3>
<p>Levantamento de processos, gap frente aos requisitos 4 a 10, escopo provável, cronograma e proposta em duas linhas (consultoria + orientação para orçar o organismo). Sem diagnóstico, proposta genérica costuma estourar na fase 2.</p>
<h3 id="deo-qa-cons9001-rapido">Quais passos aceleram a certificação ISO 9001 com consultoria?</h3>
<p>Equipe interna nomeada, mapa de processos, piloto operando com registro, auditoria interna real e análise crítica antes de chamar o OCP. Detalhe: <a href="/passo-a-passo-certificacao-iso-9001/#etapas">7 etapas</a>.</p>
</div>
`;

const RESPOSTAS_CONSULT_LI = `<li><strong>Certificação:</strong> <a href="/passo-a-passo-certificacao-iso-9001/">passo a passo certificação ISO 9001</a> · <a href="/quanto-custa-iso-9001/">quanto custa</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a>.</li>`;

const CTA_CONSULT = `
<p class="post-cta"><strong>Falar com consultor:</strong> <a href="https://templum.com.br/consultoria/iso-9001/">Consultoria Templum ISO 9001</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a> · <a href="/passo-a-passo-certificacao-iso-9001/">Guia de certificação ISO 9001</a></p>
`;

const HUB_AVISO_OLD =
  '<a href="/transicao-iso-9001-2026-prazos-cronograma-global-aci/">prazos de transição 2026 (Global ACI)</a>. <strong>Já certificado na 2015?</strong>';
const HUB_AVISO_NEW =
  '<a href="/transicao-iso-9001-2026-prazos-cronograma-global-aci/">prazos de transição 2026 (Global ACI)</a> · <a href="/consultoria-iso-9001/"><strong>consultoria ISO 9001</strong></a>. <strong>Já certificado na 2015?</strong>';

const HUB_PORTA = `
  <a href="/consultoria-iso-9001/"><strong>Consultoria ISO 9001</strong><span>Implantação, diagnóstico e preparação para certificar</span></a>
`;

function insertBefore(body, needle, block) {
  const i = body.indexOf(needle);
  if (i < 0) throw new Error(`anchor não encontrado: ${needle.slice(0, 40)}`);
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
  const afterTable = '</table>\n\n\n<h2 id="etapas">';
  if (!body.includes(afterTable)) throw new Error("anchor etapas");
  body = body.replace(afterTable, `</table>\n\n${H2_BRASIL}\n${DEO_PILLAR}\n\n<h2 id="etapas">`);
  return insertBefore(body, '<h2 id="aprofunde">', CTA_PILLAR);
});

patchFile(SLUG_CUSTO, (body) => {
  const afterDeo = '</div>\n\n<h2 id="quanto-custa">';
  if (!body.includes(afterDeo)) throw new Error("anchor quanto-custa");
  body = body.replace(afterDeo, `</div>\n${DEO_CUSTO}\n\n<h2 id="quanto-custa">`);
  return `${body.trimEnd()}\n\n${CTA_CUSTO}\n`;
});

patchFile(SLUG_CONSULT, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CONSULT_LI);
  const afterRespostas = '</ul>\n<h3 id="operacao">';
  if (!body.includes(afterRespostas)) throw new Error("anchor operacao");
  body = body.replace(afterRespostas, `</ul>\n${BLOCO_CONSULT_TOP}\n<h3 id="operacao">`);
  return insertBefore(body, '<h2 id="aprofunde">', CTA_CONSULT);
});

patchFile(SLUG_HUB, (body) => {
  if (!body.includes(HUB_AVISO_OLD)) {
    console.log(SLUG_HUB, "aviso skip");
  } else {
    body = body.replace(HUB_AVISO_OLD, HUB_AVISO_NEW);
  }
  const portaNeedle = '<a href="/quanto-custa-iso-9001/"><strong>Custo</strong>';
  if (body.includes('/consultoria-iso-9001/"><strong>Consultoria ISO 9001</strong>')) {
    return body;
  }
  if (!body.includes(portaNeedle)) throw new Error("anchor portas hub");
  return body.replace(
    portaNeedle,
    `${HUB_PORTA.trim()}\n  ${portaNeedle}`,
  );
});

// Meta SEO (intent certificação + consultoria)
const metaPillar = path.join(dir, `${SLUG_PILLAR}.meta.json`);
if (existsSync(metaPillar)) {
  const m = JSON.parse(readFileSync(metaPillar, "utf8"));
  m.seo_title = "Certificação ISO 9001: passo a passo e consultoria";
  m.seo_description =
    "Certificação ISO 9001 no Brasil: passo a passo em 7 etapas, organismo acreditado, consultoria, prazo e custo. Como obter o certificado do zero.";
  writeFileSync(metaPillar, JSON.stringify(m, null, 1) + "\n", "utf8");
  console.log("meta", SLUG_PILLAR);
}

const metaConsult = path.join(dir, `${SLUG_CONSULT}.meta.json`);
if (existsSync(metaConsult)) {
  const m = JSON.parse(readFileSync(metaConsult, "utf8"));
  m.seo_title = "Consultoria ISO 9001: certificação, custo e como escolher";
  m.seo_description =
    "Consultoria ISO 9001 para certificação: diagnóstico, custos típicos, como escolher, prazos e preparação para o organismo. Não emite certificado.";
  const extraFaq = {
    pergunta: "Consultoria ISO 9001 ajuda na certificação?",
    resposta:
      '<p>Sim: acelera implantação, auditoria interna e preparação para estágios 1 e 2. O certificado só o organismo acreditado emite. <a href="/passo-a-passo-certificacao-iso-9001/">Passo a passo da certificação ISO 9001</a>.</p>',
  };
  if (!m.faq.some((f) => f.pergunta.includes("ajuda na certificação"))) {
    m.faq.unshift(extraFaq);
  }
  writeFileSync(metaConsult, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_CONSULT);
}
