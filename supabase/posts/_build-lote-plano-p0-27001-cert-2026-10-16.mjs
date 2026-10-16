/** P0 GEO/CRM: certificação ISO 27001 (pillar, custo, consultoria, implementar). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-p0-27001-cert-2026-10-16"';

const SLUG_PILLAR = "certificacao-iso-27001-etapas-prazo-custo";
const SLUG_CUSTO = "quanto-custa-iso-27001";
const SLUG_CONSULT = "consultoria-iso-27001";
const SLUG_IMPL = "como-implementar-a-iso-27001";

const FORM_PILLAR =
  '/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=certificacao-iso-27001-etapas-prazo-custo&amp;norma=ISO%2027001';
const FORM_CUSTO =
  '/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=quanto-custa-iso-27001&amp;norma=ISO%2027001';
const FORM_CONSULT =
  '/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=consultoria-iso-27001&amp;norma=ISO%2027001';
const FORM_IMPL =
  '/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=como-implementar-a-iso-27001&amp;norma=ISO%2027001';

const DEO_PILLAR = `
<div ${MARKER}>
<h3 id="deo-qa-27001-brasil">Como obter a certificação ISO 27001 no Brasil?</h3>
<p>Implante o SGSI (escopo, riscos, SoA, controles com registro, auditoria interna e análise crítica), contrate organismo <strong>acreditado pelo Inmetro/Cgcre</strong> para ISO/IEC 27001, passe estágios 1 e 2 e trate não conformidades. Consultoria prepara; certificadora emite. Passos: <a href="#passos-e-prazo-certificacao">neste guia</a>.</p>
<h3 id="deo-qa-27001-edital">Certificação ISO 27001 é exigida em edital ou contrato B2B?</h3>
<p>Sim, em TI, SaaS, dados sensíveis, financeiro e apostas reguladas. O certificado precisa cobrir o serviço que o cliente contrata: escopo estreito demais não atende a exigência. <a href="/empresas-que-precisam-da-iso-27001/">Quem precisa da ISO 27001</a>.</p>
<h3 id="deo-qa-27001-orcamento">Como pedir orçamento de certificação e consultoria?</h3>
<p>Informe pessoas no escopo, unidades, o que a empresa faz e se já há controles de segurança. Separe proposta de consultoria e de organismo (ciclo de 3 anos). <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a>.</p>
</div>
`;

const H2_BRASIL = `
<h2 id="como-obter-certificacao-brasil">Como obter a certificação ISO 27001 no Brasil?</h2>
<p>No Brasil, a certificação ISO 27001 segue a mesma lógica internacional: você opera um SGSI auditável, escolhe um organismo reconhecido pelo <strong>Inmetro/Cgcre</strong> com escopo de acreditação para ISO/IEC 27001, realiza estágio 1 (prontidão) e estágio 2 (evidência) e mantém o certificado com auditorias anuais por três anos. A ABNT NBR ISO/IEC 27001 é a norma aplicável; a consultoria não substitui o organismo e não pode ser a mesma empresa que certifica.</p>
<p>Resumo operacional: <a href="#passos-e-prazo-certificacao">passos e prazo</a> · <a href="#acreditacao">como validar acreditação</a> · <a href="/quanto-custa-iso-27001/">quanto custa</a>.</p>
`;

const CTA_PILLAR = `
<p class="post-cta"><strong>Quer certificar?</strong> <a href="/certificacao-iso-27001-etapas-prazo-custo/"><strong>Certificação ISO 27001: etapas, prazo e custo</strong></a> · <a href="https://templum.com.br/consultoria/iso-27001/">Consultoria Templum ISO 27001</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a></p>
`;

const RESPOSTAS_PILLAR_LI = `<li><strong>Orçamento e apoio:</strong> <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a> · <a href="${FORM_PILLAR}">Diagnóstico gratuito</a> · guia <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001</a>.</li>`;

const DEO_CUSTO = `
<div ${MARKER}>
<h3 id="deo-qa-q27001-preco-brasil">Qual o preço da certificação ISO 27001 no Brasil?</h3>
<p>Não há tabela única: o organismo cobra por dias de auditoria (ISO/IEC 27006-1) no ciclo de três anos; a implantação soma horas internas e consultoria. Peça orçamento com escopo definido. <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">Fatores de custo</a> · <a href="${FORM_CUSTO}">Estimativa com a Templum</a>.</p>
</div>
`;

const RESPOSTAS_CUSTO_LI = `<li><strong>Certificação (passos):</strong> <a href="/certificacao-iso-27001-etapas-prazo-custo/">Certificação ISO 27001: etapas, prazo e custo</a> · <a href="${FORM_CUSTO}">Diagnóstico gratuito</a>.</li>`;

const CTA_CUSTO = `
<p class="post-cta"><strong>Estimativa para sua operação:</strong> <a href="${FORM_CUSTO}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a> · <a href="/certificacao-iso-27001-etapas-prazo-custo/">Guia de certificação</a></p>
`;

const DEO_CONSULT = `
<div ${MARKER}>
<h3 id="deo-qa-cons27001-certificacao">Consultoria ajuda na certificação ISO 27001?</h3>
<p>Sim: acelera riscos, SoA, documentação e preparação para estágios 1 e 2. O certificado só o organismo acreditado emite. Próximo passo após implantar: <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001</a>.</p>
</div>
`;

const RESPOSTAS_CONSULT_LI = `<li><strong>Certificação:</strong> depois da implantação, <a href="/certificacao-iso-27001-etapas-prazo-custo/">etapas, prazo e custo da certificação ISO 27001</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a>.</li>`;

const CTA_CONSULT = `
<p class="post-cta"><strong>Falar com consultor:</strong> <a href="https://templum.com.br/consultoria/iso-27001/">Consultoria Templum ISO 27001</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a> · <a href="/certificacao-iso-27001-etapas-prazo-custo/">Guia de certificação</a></p>
`;

const BLOCO_IMPL = `
<h2 id="proximo-passo-certificacao">Próximo passo: certificação ISO 27001</h2>
<p>Com escopo, riscos, SoA e controles operando, o caminho é contratar organismo acreditado, passar estágios 1 e 2 e tratar não conformidades. Detalhe de prazo, custo e acreditação Inmetro: <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001: etapas, prazo e custo</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-impl27001-pronto-cert">Quando chamar o organismo certificador?</h3>
<p>Depois de auditoria interna e análise crítica concluídas, com evidência amostrável dos controles da SoA. Chamar cedo demais adia o estágio 2. Checklist: <a href="#pronto">como saber que está pronto</a>.</p>
</div>
<p class="post-cta"><a href="/consultoria-iso-27001/">Consultoria ISO 27001</a> · <a href="${FORM_IMPL}">Diagnóstico gratuito</a></p>
`;

function insertBeforeLeiaMais(body, block) {
  const needle = "<h2>Leia mais</h2>";
  const i = body.indexOf(needle);
  if (i < 0) throw new Error("Leia mais não encontrado");
  return body.slice(0, i) + block + "\n" + body.slice(i);
}

function appendRespostasLi(body, liHtml) {
  if (body.includes(liHtml.trim().slice(0, 40))) {
    return body;
  }
  const needle = "</ul>";
  const anchor = '<h2 id="respostas-diretas">';
  const i = body.indexOf(anchor);
  if (i < 0) throw new Error("respostas-diretas não encontrado");
  const j = body.indexOf(needle, i);
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
  const afterDeo = '</div>\n\n<h2 id="consultoria-organismo">';
  if (!body.includes(afterDeo)) throw new Error("anchor deo pillar");
  body = body.replace(afterDeo, `</div>\n${DEO_PILLAR}\n${H2_BRASIL}\n\n<h2 id="consultoria-organismo">`);
  return insertBeforeLeiaMais(body, CTA_PILLAR);
});

patchFile(SLUG_CUSTO, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CUSTO_LI);
  const afterDeo = '</div>\n\n<h2 id="respostas-diretas">';
  body = body.replace(afterDeo, `</div>\n${DEO_CUSTO}\n\n<h2 id="respostas-diretas">`);
  return `${body.trimEnd()}\n\n${CTA_CUSTO}\n`;
});

patchFile(SLUG_CONSULT, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CONSULT_LI);
  const afterTable = "</table>\n\n\n<h2 id=\"pme\">";
  if (!body.includes(afterTable)) throw new Error("anchor consult pme");
  body = body.replace(afterTable, `</table>\n${DEO_CONSULT}\n\n\n<h2 id="pme">`);
  return insertBeforeLeiaMais(body, CTA_CONSULT);
});

patchFile(SLUG_IMPL, (body) => insertBeforeLeiaMais(body, BLOCO_IMPL));
