/** P0 GEO/CRM: hub + consultoria ISO 27001 (certificação + consultoria, out/2026). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-p0-27001-cert-consult-2026-10-19"';

const SLUG_HUB = "iso-27001";
const SLUG_CONSULT = "consultoria-iso-27001";
const SLUG_PILLAR = "certificacao-iso-27001-etapas-prazo-custo";

const FORM_HUB =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=iso-27001&amp;norma=ISO%2027001";
const FORM_CONSULT =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=consultoria-iso-27001&amp;norma=ISO%2027001";

const AVISO_OLD =
  '<a href="/quanto-custa-iso-27001/"><strong>quanto custa a ISO 27001</strong></a> (URL curta <a href="/certificacao-iso-27001/">/certificacao-iso-27001/</a>).';
const AVISO_NEW =
  '<a href="/quanto-custa-iso-27001/"><strong>quanto custa a ISO 27001</strong></a> · <a href="/consultoria-iso-27001/"><strong>consultoria ISO 27001</strong></a> (URL curta <a href="/certificacao-iso-27001/">/certificacao-iso-27001/</a>).';

const HUB_PORTA = `
  <a href="/consultoria-iso-27001/"><strong>Consultoria ISO 27001</strong><span>Implantação, SoA e preparação para certificar</span></a>
`;

const H2_BRASIL = `
<h2 id="como-obter-certificacao-brasil">Como obter a certificação ISO 27001 no Brasil?</h2>
<p>No Brasil, a certificação ISO 27001 segue a <strong>ABNT NBR ISO/IEC 27001</strong>. Você opera um SGSI auditável (escopo, riscos, SoA, controles com registro, auditoria interna), contrata organismo <strong>acreditado pelo Inmetro/Cgcre</strong>, conclui estágios 1 e 2 e mantém o certificado por três anos. Consultoria prepara; certificadora emite.</p>
<p>Resumo: <a href="/certificacao-iso-27001-etapas-prazo-custo/">etapas, prazo e custo</a> · <a href="/consultoria-iso-27001/">consultoria ISO 27001</a> · <a href="/como-implementar-a-iso-27001/">como implementar</a>.</p>
`;

const DEO_HUB = `
<div ${MARKER}>
<h3 id="deo-qa-hub27001-brasil-orcamento">Como pedir orçamento de certificação e consultoria ISO 27001?</h3>
<p>Informe pessoas no escopo, unidades, o que a empresa faz e maturidade de segurança. Separe proposta de <strong>consultoria</strong> (SGSI) e de <strong>organismo certificador</strong> (ciclo de 3 anos). <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a>.</p>
<h3 id="deo-qa-hub27001-brasil-edital">Certificação ISO 27001 é exigida em contrato B2B ou edital?</h3>
<p>Sim, em SaaS, dados sensíveis, financeiro e cadeias reguladas. O certificado precisa cobrir o serviço que o cliente contrata. <a href="/empresas-que-precisam-da-iso-27001/">Quem precisa da ISO 27001</a>.</p>
</div>
`;

const RESPOSTAS_HUB_LI = `<li><strong>Consultoria e certificação:</strong> <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a> · <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a>.</li>`;

const CTA_HUB = `
<p class="post-cta"><strong>Quer certificar com apoio?</strong> <a href="https://templum.com.br/consultoria/iso-27001/">Consultoria Templum ISO 27001</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="/certificacao-iso-27001-etapas-prazo-custo/">Guia de certificação ISO 27001</a></p>
`;

const BLOCO_CONSULT = `
<h2 id="consultoria-para-certificacao">Consultoria ISO 27001 para obter a certificação</h2>
<p><strong>Consultoria ISO 27001</strong> estrutura escopo, riscos, SoA, documentação e preparação para estágios 1 e 2. Não emite certificado. Caminho: <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001: etapas, prazo e custo</a> · <a href="/como-implementar-a-iso-27001/">como implementar a ISO 27001</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-cons27001-escolher-cert">Como escolher a melhor consultoria ISO 27001?</h3>
<p>Experiência no seu setor, método de riscos antes da SoA, clareza sobre horas internas e separação consultoria x certificadora. <a href="#escolher">Checklist nesta página</a> · <a href="/como-escolher-consultoria-iso/">como escolher consultoria ISO</a>.</p>
<h3 id="deo-qa-cons27001-diagnostico-cert">O que esperar do diagnóstico ISO 27001 com uma consultoria?</h3>
<p>Gap frente às cláusulas 4 a 10, rascunho de escopo e SoA, cronograma (média 6 a 12 meses) e proposta em duas linhas: consultoria + orientação para orçar o organismo.</p>
<h3 id="deo-qa-cons27001-custo-cert">Quais são os custos típicos de consultoria e certificação ISO 27001?</h3>
<p>Consultoria varia por escopo, sites e maturidade; organismo cobra dias de auditoria (27006-1) à parte. Detalhe: <a href="/quanto-custa-iso-27001/">quanto custa a ISO 27001</a> · <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">fatores de custo</a>.</p>
</div>
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
  if (body.includes(AVISO_OLD)) {
    body = body.replace(AVISO_OLD, AVISO_NEW);
  }
  const portaNeedle = '<a href="/certificacao-iso-27001-etapas-prazo-custo/"><strong>Certificar</strong>';
  if (!body.includes('/consultoria-iso-27001/"><strong>Consultoria ISO 27001</strong>')) {
    if (!body.includes(portaNeedle)) throw new Error("anchor portas hub");
    body = body.replace(portaNeedle, `${HUB_PORTA.trim()}\n  ${portaNeedle}`);
  }
  body = appendRespostasLi(body, RESPOSTAS_HUB_LI);
  const afterRespostas = '</ul>\n\n<h2 id="o-que-e">';
  if (!body.includes(afterRespostas)) throw new Error("anchor o-que-e");
  body = body.replace(afterRespostas, `</ul>\n${H2_BRASIL}\n${DEO_HUB}\n\n<h2 id="o-que-e">`);
  return insertBefore(body, '<h2 id="aprofunde">', CTA_HUB);
});

patchFile(SLUG_CONSULT, (body) => {
  const fazRe = /<\/ul>\r?\n(?:\r?\n)+<h2 id="faz">/;
  if (!fazRe.test(body)) throw new Error("anchor faz");
  body = body.replace(fazRe, `</ul>\n${BLOCO_CONSULT}\n\n<h2 id="faz">`);
  return body;
});

const metaHub = path.join(dir, `${SLUG_HUB}.meta.json`);
if (existsSync(metaHub)) {
  const m = JSON.parse(readFileSync(metaHub, "utf8"));
  m.seo_title = "ISO 27001: certificação, consultoria e SGSI (2022)";
  m.seo_description =
    "ISO 27001 e certificação no Brasil: SGSI, requisitos 2022, consultoria, etapas, prazo e custo. Como obter o certificado com organismo acreditado.";
  writeFileSync(metaHub, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_HUB);
}

const metaConsult = path.join(dir, `${SLUG_CONSULT}.meta.json`);
if (existsSync(metaConsult)) {
  const m = JSON.parse(readFileSync(metaConsult, "utf8"));
  m.seo_title = "Consultoria ISO 27001: certificação, custo e como escolher";
  m.seo_description =
    "Consultoria ISO 27001 para certificação: diagnóstico, custos típicos, como escolher, prazos e preparação para o organismo. Não emite certificado.";
  const extraFaq = {
    pergunta: "Consultoria ISO 27001 ajuda na certificação?",
    resposta:
      '<p>Sim: acelera riscos, SoA, documentação e preparação para estágios 1 e 2. O certificado só o organismo acreditado emite. <a href="/certificacao-iso-27001-etapas-prazo-custo/">Certificação ISO 27001: etapas, prazo e custo</a>.</p>',
  };
  if (!m.faq.some((f) => f.pergunta.includes("ajuda na certificação"))) {
    m.faq.unshift(extraFaq);
  }
  writeFileSync(metaConsult, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_CONSULT);
}

const metaPillar = path.join(dir, `${SLUG_PILLAR}.meta.json`);
if (existsSync(metaPillar)) {
  const m = JSON.parse(readFileSync(metaPillar, "utf8"));
  m.seo_title = "Certificação ISO 27001: passo a passo, consultoria e custo";
  m.seo_description =
    "Certificação ISO 27001 no Brasil: etapas, estágios 1 e 2, prazo, custo (27006-1), consultoria e organismo acreditado Inmetro.";
  writeFileSync(metaPillar, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_PILLAR);
}
