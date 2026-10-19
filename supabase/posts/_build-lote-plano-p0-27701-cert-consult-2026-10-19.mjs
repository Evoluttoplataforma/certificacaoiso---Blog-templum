/** P0 GEO/CRM: certificação + consultoria ISO 27701 (hub 2025, pillar, custo, consultoria, implementar). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-p0-27701-cert-consult-2026-10-19"';

const SLUG_HUB = "iso-27701-2025-o-que-muda-independencia-da-iso-27001";
const SLUG_PILLAR = "certificacao-iso-27701-etapas-e-requisitos";
const SLUG_CUSTO = "quanto-custa-iso-27701";
const SLUG_CONSULT = "consultoria-iso-27701";
const SLUG_IMPL = "como-implementar-a-iso-27701";

const FORM_HUB =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=iso-27701-2025&amp;norma=ISO%2027701";
const FORM_PILLAR =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=certificacao-iso-27701-etapas&amp;norma=ISO%2027701";
const FORM_CUSTO =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=quanto-custa-iso-27701&amp;norma=ISO%2027701";
const FORM_CONSULT =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=consultoria-iso-27701&amp;norma=ISO%2027701";
const FORM_IMPL =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=como-implementar-iso-27701&amp;norma=ISO%2027701";

const AVISO_HUB = `
<div class="post-aviso post-aviso-atualizacao"><p><strong>Quer certificar?</strong> <a href="/certificacao-iso-27701-etapas-e-requisitos/"><strong>Certificação ISO 27701: critérios e etapas</strong></a> · <a href="/quanto-custa-iso-27701/"><strong>Quanto custa a ISO 27701</strong></a> · <a href="/consultoria-iso-27701/"><strong>Consultoria ISO 27701</strong></a> (URL curta <a href="/certificacao-iso-27701/">/certificacao-iso-27701/</a>).</p></div>
`;

const HUB_PORTA = `
  <a href="/consultoria-iso-27701/"><strong>Consultoria ISO 27701</strong><span>SGPI, inventário e preparação para certificar</span></a>
`;

const H2_BRASIL = `
<h2 id="como-obter-certificacao-brasil">Como obter a certificação ISO 27701 no Brasil?</h2>
<p>No Brasil, a certificação ISO 27701 segue a <strong>ISO/IEC 27701:2025</strong> (SGPI/PIMS). Você opera inventário de tratamentos, risco de privacidade e controles Anexo A com evidência, contrata organismo <strong>acreditado pelo Inmetro/Cgcre</strong> com escopo para 27701, conclui estágios 1 e 2 e mantém o certificado por três anos. Desde 2025 não é obrigatório ter ISO 27001 certificada antes. Consultoria prepara; certificadora emite.</p>
<p>Resumo: <a href="/certificacao-iso-27701-etapas-e-requisitos/#criterios-etapas-pergunta">etapas neste guia ou no pillar</a> · <a href="/consultoria-iso-27701/">consultoria ISO 27701</a> · <a href="/quanto-custa-iso-27701/">quanto custa</a>.</p>
`;

const DEO_HUB = `
<div ${MARKER}>
<h3 id="deo-qa-hub27701-brasil-orcamento">Como pedir orçamento de certificação e consultoria ISO 27701?</h3>
<p>Informe tratamentos no escopo, papéis controlador/operador, unidades e se já há inventário ou SGSI 27001. Separe proposta de <strong>consultoria</strong> (SGPI) e de <strong>organismo certificador</strong> (ciclo de 3 anos). <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a>.</p>
<h3 id="deo-qa-hub27701-brasil-lgpd">Certificação ISO 27701 substitui adequação à LGPD?</h3>
<p>Não. SGPI auditado organiza gestão de privacidade; bases legais, titular e DPO continuam à parte. <a href="/iso-27701-lgpd-gdpr-conformidade/">ISO 27701 e LGPD</a>.</p>
</div>
`;

const RESPOSTAS_HUB_LI = `<li><strong>Consultoria e certificação:</strong> <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação ISO 27701</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a>.</li>`;

const CTA_HUB = `
<p class="post-cta"><strong>Quer certificar com apoio?</strong> <a href="https://templum.com.br/consultoria/iso-27001/">Consultoria Templum (SGPI/SGSI)</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">Guia de certificação ISO 27701</a></p>
`;

const DEO_PILLAR = `
<div ${MARKER}>
<h3 id="deo-qa-27701-brasil">Como obter a certificação ISO 27701 no Brasil?</h3>
<p>Implante o SGPI (escopo, inventário, risco de privacidade, controles A1/A2/A3, auditoria interna), escolha organismo acreditado para ISO/IEC 27701, passe estágios 1 e 2 e trate NCs. Passos: <a href="#criterios-etapas-pergunta">neste guia</a>.</p>
<h3 id="deo-qa-27701-orcamento">Como pedir orçamento de certificação e consultoria?</h3>
<p>Descreva tratamentos, papéis e maturidade do inventário. Duas linhas: consultoria + organismo. <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a>.</p>
</div>
`;

const H2_BRASIL_PILLAR = `
<h2 id="como-obter-certificacao-brasil-pillar">Como obter a certificação ISO 27701 no Brasil?</h2>
<p>Organismo acreditado (Inmetro/Cgcre) com escopo para <strong>ISO/IEC 27701</strong>, SGPI operando com evidência de titulares e operadores, auditoria interna e análise crítica concluídas antes do estágio 1. Certificação pode ser <strong>só na 27701</strong> ou integrada ao SGSI 27001.</p>
`;

const RESPOSTAS_PILLAR_LI = `<li><strong>Orçamento e apoio:</strong> <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/quanto-custa-iso-27701/">quanto custa a certificação</a>.</li>`;

const CTA_PILLAR = `
<p class="post-cta"><strong>Quer certificar?</strong> <a href="https://templum.com.br/consultoria/iso-27001/">Consultoria Templum</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a></p>
`;

const DEO_CUSTO = `
<div ${MARKER}>
<h3 id="deo-qa-q27701-preco-brasil">Qual o preço da certificação ISO 27701 no Brasil?</h3>
<p>Organismo cobra por dias de auditoria (escopo SGPI, tratamentos, sites); implantação soma consultoria e horas internas. Peça orçamento do ciclo de 3 anos. <a href="/certificacao-iso-27701-etapas-e-requisitos/#custo">Fatores de custo</a> · <a href="${FORM_CUSTO}">Estimativa com a Templum</a>.</p>
</div>
`;

const RESPOSTAS_CUSTO_LI = `<li><strong>Certificação (passos):</strong> <a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificação ISO 27701: critérios e etapas</a> · <a href="${FORM_CUSTO}">Diagnóstico gratuito</a>.</li>`;

const CTA_CUSTO = `
<p class="post-cta"><strong>Estimativa para sua operação:</strong> <a href="${FORM_CUSTO}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">Guia de certificação</a></p>
`;

const BLOCO_CONSULT = `
<h2 id="consultoria-para-certificacao">Consultoria ISO 27701 para obter a certificação</h2>
<p><strong>Consultoria ISO 27701</strong> estrutura inventário, risco de privacidade, controles A1/A2/A3 e preparação para estágios 1 e 2. Não emite certificado nem substitui DPO ou jurídico. Caminho: <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação ISO 27701</a> · <a href="/como-implementar-a-iso-27701/">como implementar a ISO 27701</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-cons27701-escolher-cert">Como escolher a melhor consultoria ISO 27701?</h3>
<p>Experiência em controlador/operador, método 27701:2025, integração opcional com 27001 e separação consultoria x certificadora. <a href="#escolher">Checklist nesta página</a> · <a href="/como-escolher-consultoria-iso/">como escolher consultoria ISO</a>.</p>
<h3 id="deo-qa-cons27701-diagnostico-cert">O que esperar do diagnóstico ISO 27701 com uma consultoria?</h3>
<p>Gap frente às cláusulas 4 a 10, rascunho de inventário, escopo do certificado e cronograma (média 6 a 12 meses). Proposta em duas linhas: consultoria + orientação para orçar o organismo.</p>
</div>
`;

const RESPOSTAS_CONSULT_LI = `<li><strong>Certificação:</strong> <a href="/certificacao-iso-27701-etapas-e-requisitos/">critérios e etapas da certificação ISO 27701</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a>.</li>`;

const CTA_CONSULT = `
<p class="post-cta"><strong>Falar com consultor:</strong> <a href="https://templum.com.br/consultoria/iso-27001/">Consultoria Templum</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">Guia de certificação ISO 27701</a></p>
`;

const BLOCO_IMPL = `
<h2 id="proximo-passo-certificacao">Próximo passo: certificação ISO 27701</h2>
<p>Com SGPI operando (inventário, riscos, controles com registro, auditoria interna e análise crítica), contrate organismo acreditado para ISO/IEC 27701, passe estágios 1 e 2 e trate não conformidades. Detalhe: <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação ISO 27701: critérios e etapas</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-impl27701-pronto-cert">Quando chamar o organismo certificador?</h3>
<p>Depois de auditoria interna e análise crítica, com evidência amostrável de titulares, operadores e incidentes de privacidade.</p>
</div>
<p class="post-cta"><a href="/consultoria-iso-27701/">Consultoria ISO 27701</a> · <a href="${FORM_IMPL}">Diagnóstico gratuito</a></p>
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

patchFile(SLUG_HUB, (body) => {
  if (!body.includes("post-aviso-atualizacao")) {
    body = body.replace('<div class="post-portas">', `${AVISO_HUB.trim()}\n\n<div class="post-portas">`);
  }
  const portaNeedle = '<a href="/certificacao-iso-27701-etapas-e-requisitos/"><strong>Certificar</strong>';
  if (!body.includes("Consultoria ISO 27701</strong><span>SGPI")) {
    body = body.replace(portaNeedle, `${HUB_PORTA.trim()}\n  ${portaNeedle}`);
  }
  body = appendRespostasLi(body, RESPOSTAS_HUB_LI);
  const afterRespostasRe = /<\/ul>\r?\n(?:\r?\n)+<p>A ISO\/IEC 27701/;
  if (!afterRespostasRe.test(body)) throw new Error("anchor hub pós-respostas");
  body = body.replace(
    afterRespostasRe,
    `</ul>\n${H2_BRASIL}\n${DEO_HUB}\n\n\n<p>A ISO/IEC 27701`,
  );
  return insertBefore(body, "<h2>O ponto de virada:", CTA_HUB);
});

patchFile(SLUG_PILLAR, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_PILLAR_LI);
  const afterDeo = '</div>\n\n<h2 id="consultoria-organismo-sgsi">';
  if (!body.includes(afterDeo)) throw new Error("anchor pillar pós-deo");
  body = body.replace(afterDeo, `</div>\n${DEO_PILLAR}\n${H2_BRASIL_PILLAR}\n\n<h2 id="consultoria-organismo-sgsi">`);
  return insertBefore(body, '<h2 id="consultoria-certificacao">', CTA_PILLAR);
});

patchFile(SLUG_CUSTO, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CUSTO_LI);
  const afterDeo = '</div>\n\n<h2 id="duas-contas">';
  if (!body.includes(afterDeo)) throw new Error("anchor custo pós-deo");
  body = body.replace(afterDeo, `</div>\n${DEO_CUSTO}\n\n<h2 id="duas-contas">`);
  return `${body.trimEnd()}\n\n${CTA_CUSTO}\n`;
});

patchFile(SLUG_CONSULT, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CONSULT_LI);
  const fazRe = /<\/ul>\r?\n(?:\r?\n)+<h2 id="faz">/;
  if (!fazRe.test(body)) throw new Error("anchor faz");
  body = body.replace(fazRe, `</ul>\n${BLOCO_CONSULT}\n\n<h2 id="faz">`);
  return insertBefore(body, "<h2>Leia mais</h2>", CTA_CONSULT);
});

patchFile(SLUG_IMPL, (body) =>
  insertBefore(body, '<h2 id="erros">', BLOCO_IMPL),
);

const metaHub = path.join(dir, `${SLUG_HUB}.meta.json`);
if (existsSync(metaHub)) {
  const m = JSON.parse(readFileSync(metaHub, "utf8"));
  m.seo_title = "ISO 27701:2025, certificação, consultoria e SGPI";
  m.seo_description =
    "ISO 27701:2025 explicada: SGPI, certificação no Brasil, consultoria, etapas, custo e relação com ISO 27001 e LGPD.";
  writeFileSync(metaHub, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_HUB);
}

const metaPillar = path.join(dir, `${SLUG_PILLAR}.meta.json`);
if (existsSync(metaPillar)) {
  const m = JSON.parse(readFileSync(metaPillar, "utf8"));
  m.seo_title = "Certificação ISO 27701: passo a passo, consultoria e custo";
  m.seo_description =
    "Certificação ISO 27701 no Brasil: critérios, etapas, estágios 1 e 2, prazo, consultoria e organismo acreditado. SGPI 2025 com ou sem ISO 27001.";
  writeFileSync(metaPillar, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_PILLAR);
}

const metaConsult = path.join(dir, `${SLUG_CONSULT}.meta.json`);
if (existsSync(metaConsult)) {
  const m = JSON.parse(readFileSync(metaConsult, "utf8"));
  m.seo_title = "Consultoria ISO 27701: certificação, custo e como escolher";
  m.seo_description =
    "Consultoria ISO 27701 para certificação SGPI: diagnóstico, inventário, custos típicos, como escolher e preparação para o organismo.";
  const extraFaq = {
    pergunta: "Consultoria ISO 27701 ajuda na certificação?",
    resposta:
      '<p>Sim: acelera inventário, risco de privacidade, controles Anexo A e preparação para estágios 1 e 2. O certificado só o organismo acreditado emite. <a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificação ISO 27701</a>.</p>',
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
  m.seo_title = "Quanto custa a certificação ISO 27701? Consultoria e organismo";
  m.seo_description =
    "Quanto custa certificar ISO 27701: implantação SGPI, consultoria, dias de auditoria do organismo e ciclo de 3 anos. Sem tabela única.";
  writeFileSync(metaCusto, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_CUSTO);
}
