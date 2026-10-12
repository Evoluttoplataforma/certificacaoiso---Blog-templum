/** Trilha A3: DEO fluxograma + checklist; bloco certificação 14001. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-a3-2026-10-12"';

function insertBefore(body, needle, block) {
  const i = body.indexOf(needle);
  if (i < 0) return null;
  return body.slice(0, i) + block + "\n" + body.slice(i);
}

function patch(slug, block, { before, after } = {}) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) return console.warn("skip", slug);
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) return console.log(slug, "ja A3");
  if (before) body = insertBefore(body, before, block);
  else if (after) {
    const i = body.indexOf(after);
    if (i < 0) return console.warn(slug, "anchor");
    body = body.slice(0, i + after.length) + "\n" + block + body.slice(i + after.length);
  } else return console.warn(slug, "sem anchor");
  if (!body) return console.warn(slug, "falhou");
  writeFileSync(p, body, "utf8");
  console.log(slug, "A3 ok");
}

const QA_FLUX = `
<div ${MARKER}>
<h3 id="deo-qa-flux-simbolos">Quais símbolos usar em fluxograma de processo?</h3>
<p>Retângulo para atividade, losango para decisão, seta para fluxo, elipse ou círculo para início/fim, documento para registro. Mantenha legenda na mesma página. <a href="#simbolos">Simbologia neste artigo</a>.</p>
<h3 id="deo-qa-flux-9001">Fluxograma é obrigatório na ISO 9001?</h3>
<p>Não por nome, mas o requisito 4.4 exige entender sequência e interação dos processos. Fluxograma é a forma mais comum de cumprir isso. <a href="/mapeamento-de-processos-e-a-iso-9001/">Mapeamento e ISO 9001</a>.</p>
</div>
`;

const QA_CHECK = `
<p><strong>Checklist de preparação para auditoria interna ISO</strong> é a lista de verificação usada antes e durante a auditoria interna do sistema de gestão: requisitos por processo, evidências e entrevistas. Objetivo: achar gap antes do organismo certificador. Veja também <a href="/auditoria-interna-iso-9001-ferramentas/">ferramentas de auditoria interna ISO 9001</a> e <a href="/passo-a-passo-certificacao-iso-9001/">certificação ISO 9001</a>.</p>
<div ${MARKER}>
<h3 id="deo-qa-check-evidencia">O que incluir na checklist antes da auditoria externa?</h3>
<p>Escopo auditado, lista mestra atualizada, registros amostrados (9.1), NCs abertas/fechadas com causa (10.2), competência (7.2), calibração quando couber (7.1.5) e entrevistas com executores, não só com a qualidade.</p>
<h3 id="deo-qa-check-9001">Checklist serve para ISO 9001, 14001 e 45001?</h3>
<p>A lógica é a mesma (requisitos da norma + evidência operacional), mas os itens mudam: LAIA na 14001, perigos e PGR na 45001, riscos e SoA na 27001. Adapte a lista à norma do escopo.</p>
</div>
`;

const BLOCO_14001 = `
<h3 id="como-solicitar-certificacao-14001">Como solicitar a certificação ISO 14001 na prática?</h3>
<p>O fluxo comercial começa pelo <strong>escopo</strong>: unidades, processos e atividades com impacto ambiental que entram no SGA. Com escopo fechado, peça proposta a dois ou três organismos acreditados (Inmetro/IAF). A proposta deve informar dias de auditoria estimados, número de locais, prazo entre estágio 1 e 2 e valores de manutenção anual. Em paralelo, finalize LAIA, matriz legal e evidência de controles operacionais: estágio 1 sem documentação coerente vira reprogramação. Consultoria pode apoiar a preparação; o certificado só sai após estágio 2 aprovado. <a href="/consultoria-iso-14001/">Consultoria ISO 14001</a> · <a href="/como-escolher-consultoria-iso/">como comparar consultoria e organismo</a>.</p>
<h3 id="estagios-auditoria-14001">O que muda entre auditoria de certificação estágio 1 e estágio 2?</h3>
<p>No <strong>estágio 1</strong>, o auditor revisa se o SGA está estruturado: escopo, política ambiental, LAIA, requisitos legais, objetivos e planejamento de controles. Busca consistência documental e se a empresa entendeu a norma. No <strong>estágio 2</strong>, a amostragem é operacional: inspeção em campo, registros de monitoramento, tratamento de NCs, simulação de emergência quando aplicável, entrevistas com executores. Não conformidade grave no estágio 2 pode impedir certificação imediata. Por isso a <a href="/checklist-preparacao-auditoria-interna-iso/">checklist de auditoria interna</a> e a auditoria interna rigorosa são requisito 9.2, não luxo.</p>
<h3 id="evidencias-organismo-14001">Que evidências o organismo costuma pedir na ISO 14001?</h3>
<p>Além de procedimentos controlados, auditores pedem registros de <strong>monitoramento</strong> (consumo, resíduos, efluentes), <strong>calibragem</strong> quando há instrumentos, <strong>contratos de destinação</strong> de resíduos, <strong>licenças vigentes</strong>, avaliação periódica de requisitos legais (9.1.2), tratamento de aspectos significativos e plano de resposta a emergências exercitado ou simulado. Histórico de três a seis meses antes do estágio 2 reduz surpresa. <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">Passo a passo do LAIA</a> · <a href="/controles-operacionais-iso-14001-requisito-8-1/">controles operacionais (8.1)</a>.</p>
<h3 id="prazo-real-certificacao-14001">Por que a certificação ISO 14001 demora mais que a ISO 9001?</h3>
<p>Porque LAIA e conformidade legal exigem <strong>campo</strong> e <strong>histórico</strong>. Licença assinada ontem não substitui avaliação legal trimestral registrada. PME enxuta com licença em dia pode certificar em menos de 12 meses; obra, múltiplas unidades ou cadeia de resíduos complexa tende a 15 a 18 meses. Planeje auditoria interna completa <strong>antes</strong> de agendar estágio 1 com o organismo. <a href="#o-processo-de-implementacao-da-iso-14001">Voltar às seis etapas</a>.</p>
`;

patch("o-que-e-fluxograma-de-processos", QA_FLUX, {
  before: '<h2 id="respostas-diretas">',
});

const checkPath = path.join(dir, "checklist-preparacao-auditoria-interna-iso.html");
if (existsSync(checkPath)) {
  let c = readFileSync(checkPath, "utf8");
  if (!c.includes(MARKER)) {
    c = insertBefore(c, "<p><strong>Neste artigo:</strong></p>", QA_CHECK);
    if (c) {
      writeFileSync(checkPath, c, "utf8");
      console.log("checklist-preparacao-auditoria-interna-iso A3 ok");
    }
  } else console.log("checklist-preparacao-auditoria-interna-iso ja A3");
}

const iso14001 = path.join(dir, "iso-14001.html");
if (existsSync(iso14001)) {
  let b = readFileSync(iso14001, "utf8");
  const anchor = '<h3>Onde os projetos travam</h3>';
  const mark140 = 'id="como-solicitar-certificacao-14001"';
  if (!b.includes(mark140) && b.includes(anchor)) {
    b = insertBefore(b, anchor, BLOCO_14001);
    writeFileSync(iso14001, b, "utf8");
    console.log("iso-14001 certificacao A3 ok");
  } else if (b.includes(mark140)) console.log("iso-14001 ja A3");
  else console.warn("iso-14001 anchor");
  if (!b.includes("Certificação ISO 14001:</strong> prazo")) {
    b = readFileSync(iso14001, "utf8");
    const tri = `<p><strong>Certificação ISO 14001:</strong> prazo e seis etapas em <a href="#o-processo-de-implementacao-da-iso-14001">como obter o certificado</a> · <a href="/consultoria-iso-14001/">consultoria</a> · <a href="/como-escolher-consultoria-iso/">organismo acreditado</a>.</p>\n`;
    const needle = '<div class="post-portas">';
    if (b.includes(needle) && !b.includes("Certificação ISO 14001:</strong> prazo")) {
      b = insertBefore(b, needle, tri);
      writeFileSync(iso14001, b, "utf8");
      console.log("iso-14001 triangulo A3 ok");
    }
  }
}

for (const slug of [
  "consultoria-iso-14001",
  "como-identificar-aspecto-impacto-ambiental",
  "como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa",
  "consultoria-iso-sistema-integrado-9001-14001",
]) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) continue;
  let t = readFileSync(p, "utf8");
  const n = t.split("/iso-14001-2/").length - 1;
  if (n === 0) continue;
  t = t.replaceAll("/iso-14001-2/", "/iso-14001/");
  t = t.replaceAll("/iso-14001-2#", "/iso-14001#");
  writeFileSync(p, t, "utf8");
  console.log(slug, "links 14001", n);
}

console.log("Trilha A3 build ok");
