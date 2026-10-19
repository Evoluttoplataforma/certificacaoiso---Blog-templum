/** P0 GEO/CRM: certificação + consultoria ISO 14001 (hub, consultoria, legado -2). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-p0-14001-cert-consult-2026-10-19"';

const SLUG_HUB = "iso-14001";
const SLUG_CONSULT = "consultoria-iso-14001";
const SLUG_LEGADO = "iso-14001-2";

const FORM_HUB =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=iso-14001&amp;norma=ISO%2014001";
const FORM_CONSULT =
  "/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=consultoria-iso-14001&amp;norma=ISO%2014001";

const AVISO_HUB = `
<div class="post-aviso post-aviso-atualizacao"><p><strong>Quer certificar?</strong> <a href="#o-processo-de-implementacao-da-iso-14001"><strong>Certificação ISO 14001: etapas e prazo</strong></a> · <a href="/consultoria-iso-14001/"><strong>Consultoria ISO 14001</strong></a> · <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">LAIA</a> (alias <a href="/certificacao-iso-14001/">/certificacao-iso-14001/</a> aponta para este guia).</p></div>
`;

const H2_BRASIL = `
<h2 id="como-obter-certificacao-brasil">Como obter a certificação ISO 14001 no Brasil?</h2>
<p>No Brasil, a certificação ISO 14001 segue a <strong>ABNT NBR ISO 14001:2015</strong>. Você opera um SGA auditável (LAIA, requisitos legais, controles operacionais), contrata um <strong>organismo acreditado pelo Inmetro/Cgcre</strong>, conclui estágio 1 e estágio 2 e mantém o certificado por três anos. Licença ambiental e certificado ISO são obrigações distintas. Consultoria prepara; certificadora emite.</p>
<p>Resumo: <a href="#o-processo-de-implementacao-da-iso-14001">seis etapas neste guia</a> · <a href="/consultoria-iso-14001/">consultoria ISO 14001</a> · <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">LAIA</a>.</p>
`;

const DEO_HUB = `
<div ${MARKER}>
<h3 id="deo-qa-14001-brasil-orcamento">Como pedir orçamento de certificação e consultoria ISO 14001?</h3>
<p>Informe unidades no escopo, atividades com impacto ambiental, estado do LAIA e licenças. Separe proposta de <strong>consultoria</strong> (implantação do SGA) e de <strong>organismo certificador</strong> (ciclo de 3 anos). <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="/consultoria-iso-14001/">Consultoria ISO 14001</a>.</p>
<h3 id="deo-qa-14001-brasil-edital">Certificação ISO 14001 é exigida em edital ou contrato?</h3>
<p>Em licitações, cadeias de fornecedores e exportação, o certificado ambiental pode ser critério técnico ou pontuação. Não substitui licença. <a href="#exigencia">O que responder quando exigem</a>.</p>
</div>
`;

const CTA_HUB = `
<p class="post-cta"><strong>Quer certificar com apoio?</strong> <a href="https://templum.com.br/consultoria/iso-14001/">Consultoria Templum ISO 14001</a> · <a href="${FORM_HUB}">Diagnóstico gratuito</a> · <a href="#o-processo-de-implementacao-da-iso-14001">Etapas da certificação</a></p>
`;

const BLOCO_CONSULT = `
<h2 id="consultoria-para-certificacao">Consultoria ISO 14001 para obter a certificação</h2>
<p><strong>Consultoria ISO 14001</strong> estrutura LAIA, matriz legal, objetivos ambientais e evidências antes do organismo certificador. Não emite certificado nem substitui licença. Caminho: <a href="/iso-14001/#o-processo-de-implementacao-da-iso-14001">certificação ISO 14001 no guia</a> · <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">passo a passo do LAIA</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-cons14001-escolher">Como escolher a melhor consultoria ISO 14001?</h3>
<p>Experiência no seu setor, método de LAIA em campo, tratamento de requisitos legais e separação consultoria x certificadora. <a href="#escolher">Checklist nesta página</a> · <a href="/como-escolher-consultoria-iso/">como escolher consultoria ISO</a>.</p>
<h3 id="deo-qa-cons14001-diagnostico">O que esperar do diagnóstico ISO 14001 com uma consultoria?</h3>
<p>Gap frente às cláusulas 4 a 10, rascunho de LAIA, legal aplicável, escopo do certificado e cronograma (média 10 a 18 meses). Proposta em duas linhas: consultoria + orientação para orçar o organismo.</p>
<h3 id="deo-qa-cons14001-custo">Quais são os custos típicos de consultoria e certificação ISO 14001?</h3>
<p>Consultoria varia por porte, unidades e maturidade do PGR/LAIA; organismo cobra por dias de auditoria à parte. Detalhe das duas contas: <a href="/iso-14001/#o-processo-de-implementacao-da-iso-14001">investimento na certificação</a>.</p>
</div>
`;

const RESPOSTAS_CONSULT_LI = `<li><strong>Certificação:</strong> <a href="/iso-14001/#o-processo-de-implementacao-da-iso-14001">etapas certificação ISO 14001</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a>.</li>`;

const CTA_CONSULT = `
<p class="post-cta"><strong>Falar com consultor:</strong> <a href="https://templum.com.br/consultoria/iso-14001/">Consultoria Templum ISO 14001</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a> · <a href="/iso-14001/#o-processo-de-implementacao-da-iso-14001">Guia de certificação ISO 14001</a></p>
`;

const LEGADO_DEO = `
<div ${MARKER}>
<h3 id="deo-qa-14001-2-cert">Onde está o guia completo de certificação ISO 14001?</h3>
<p>URL canônica: <a href="/iso-14001/"><strong>/iso-14001/</strong></a> (etapas, LAIA, consultoria e organismo). Este endereço <code>/iso-14001-2/</code> redireciona para lá.</p>
<h3 id="deo-qa-14001-2-consultoria">Consultoria ISO 14001 para certificar</h3>
<p><a href="/consultoria-iso-14001/">Consultoria ISO 14001</a> · <a href="${FORM_CONSULT}">Diagnóstico gratuito</a> · <a href="/iso-14001/#o-processo-de-implementacao-da-iso-14001">como obter o certificado</a>.</p>
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
  const needleAviso = '<div class="post-portas">';
  if (!body.includes("post-aviso-atualizacao")) {
    body = body.replace(needleAviso, `${AVISO_HUB.trim()}\n\n${needleAviso}`);
  }
  const tableRe = /<\/table>\r?\n\r?\n\r?\n<h2 id="o-que-e-sga">/;
  if (!tableRe.test(body)) throw new Error("anchor hub pós-tabela");
  body = body.replace(tableRe, `</table>\n\n${H2_BRASIL}\n${DEO_HUB}\n\n<h2 id="o-que-e-sga">`);
  return insertBefore(
    body,
    '<h2 id="o-processo-de-implementacao-da-iso-14001">',
    CTA_HUB,
  );
});

patchFile(SLUG_CONSULT, (body) => {
  body = appendRespostasLi(body, RESPOSTAS_CONSULT_LI);
  const fazRe = /<\/ul>\r?\n\r?\n<h2 id="faz">/;
  if (!fazRe.test(body)) throw new Error("anchor faz");
  body = body.replace(fazRe, `</ul>\n${BLOCO_CONSULT}\n\n<h2 id="faz">`);
  return insertBefore(body, '<h2 id="escolher">', CTA_CONSULT);
});

patchFile(SLUG_LEGADO, (body) => {
  const afterAviso = '</div>\n<p><strong>Certificação ISO 14001</strong>';
  const afterAvisoCr = '</div>\r\n<p><strong>Certificação ISO 14001</strong>';
  if (body.includes(afterAvisoCr)) {
    body = body.replace(afterAvisoCr, `</div>\n${LEGADO_DEO}\n<p><strong>Certificação ISO 14001</strong>`);
  } else if (body.includes(afterAviso)) {
    body = body.replace(afterAviso, `</div>\n${LEGADO_DEO}\n<p><strong>Certificação ISO 14001</strong>`);
  } else {
    throw new Error("anchor legado aviso");
  }
  return body;
});

const metaHub = path.join(dir, `${SLUG_HUB}.meta.json`);
if (existsSync(metaHub)) {
  const m = JSON.parse(readFileSync(metaHub, "utf8"));
  m.seo_title = "Certificação ISO 14001: consultoria, etapas e como obter";
  m.seo_description =
    "Certificação ISO 14001 no Brasil: LAIA, requisitos legais, consultoria, organismo acreditado e seis etapas até o certificado. Licença x certificado.";
  writeFileSync(metaHub, JSON.stringify(m, null, 1) + "\n", "utf8");
  console.log("meta", SLUG_HUB);
}

const metaConsult = path.join(dir, `${SLUG_CONSULT}.meta.json`);
if (existsSync(metaConsult)) {
  const m = JSON.parse(readFileSync(metaConsult, "utf8"));
  m.seo_title = "Consultoria ISO 14001: certificação, LAIA e como escolher";
  m.seo_description =
    "Consultoria ISO 14001 para certificação: LAIA, legal, diagnóstico, custos típicos e preparação para o organismo. Não emite certificado.";
  const extraFaq = {
    pergunta: "Consultoria ISO 14001 ajuda na certificação?",
    resposta:
      '<p>Sim: acelera LAIA, conformidade legal, controles operacionais e auditoria interna antes dos estágios 1 e 2. O certificado só o organismo acreditado emite. <a href="/iso-14001/#o-processo-de-implementacao-da-iso-14001">Etapas da certificação ISO 14001</a>.</p>',
  };
  if (!m.faq.some((f) => f.pergunta.includes("ajuda na certificação"))) {
    m.faq.unshift(extraFaq);
  }
  writeFileSync(metaConsult, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log("meta", SLUG_CONSULT);
}
