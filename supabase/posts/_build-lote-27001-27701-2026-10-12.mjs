/** Lote GEO/SERP cluster ISO 27001 + ISO 27701 (DEO + interlinks). Sem citar concorrentes. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-27001-27701-2026-10-12"';

const TAB = `
<h2 id="consultoria-organismo-sgsi">Consultoria e organismo certificador: qual a diferença?</h2>
<p>A consultoria prepara o SGSI ou SGPI; o organismo acreditado audita e emite o certificado. Contratos separados: quem consulta não certifica a mesma empresa no mesmo ciclo.</p>
<table>
<thead><tr><th>Papel</th><th>Função</th><th>Emite certificado?</th></tr></thead>
<tbody>
<tr><td>Consultoria</td><td>Escopo, riscos, SoA ou inventário de privacidade, documentação, auditoria interna assistida</td><td>Não</td></tr>
<tr><td>Organismo certificador (OCP)</td><td>Estágios 1 e 2, manutenção anual, recertificação</td><td>Sim</td></tr>
<tr><td>Equipe interna</td><td>Operação diária, registros, gestão de incidentes, evidência</td><td>Não</td></tr>
</tbody>
</table>
`;

function insertBefore(body, needle, block) {
  const i = body.indexOf(needle);
  if (i < 0) return null;
  return body.slice(0, i) + block + "\n" + body.slice(i);
}

function patch(slug, block, needle) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) return console.warn("skip", slug);
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) return console.log(slug, "ja lote 27001/27701");
  const next = insertBefore(body, needle, block);
  if (!next) return console.warn(slug, "anchor");
  writeFileSync(p, next, "utf8");
  console.log(slug, "ok");
}

function replaceIn(slug, pairs) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) return;
  let t = readFileSync(p, "utf8");
  let n = 0;
  for (const [a, b] of pairs) {
    if (t.includes(a)) {
      t = t.replaceAll(a, b);
      n++;
    }
  }
  if (n) {
    writeFileSync(p, t, "utf8");
    console.log(slug, "links", n);
  }
}

const QA_HUB_27001 = `
<div ${MARKER}>
<h3 id="deo-qa-hub27001-certificar">Onde está o guia completo da certificação ISO 27001?</h3>
<p>No pillar <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001: etapas, prazo e custo</a> (URL curta <code>/certificacao-iso-27001/</code>). Este hub foca o que é a norma, Anexo A e SGSI.</p>
<h3 id="deo-qa-hub27001-grc">ISO 27001 substitui ferramenta GRC?</h3>
<p>Não. A norma exige sistema de gestão com riscos, SoA e evidência. Software pode apoiar registros; conformidade vem de processo e auditoria, não de licença de plataforma.</p>
</div>
`;

const QA_REQ = `
<div ${MARKER}>
<h3 id="deo-qa-req-anexo">Os requisitos da ISO 27001 são os 93 controles do Anexo A?</h3>
<p>Não. Requisitos auditáveis das cláusulas <strong>4 a 10</strong>. Anexo A entra via avaliação de riscos e Declaração de Aplicabilidade (SoA), controlada na operação.</p>
<h3 id="deo-qa-req-certificar">Preciso cumprir todas as cláusulas antes de certificar?</h3>
<p>Sim, no escopo declarado, com evidência operacional. Caminho: <a href="/como-implementar-a-iso-27001/">como implementar ISO 27001</a> · <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação</a>.</p>
</div>
`;

const QA_IMPL_27001 = `
<div ${MARKER}>
<h3 id="deo-qa-impl-ordem">Qual a ordem correta para implementar ISO 27001?</h3>
<p>Escopo e contexto, avaliação de riscos, SoA, operação com registro, auditoria interna, análise crítica, depois estágios 1 e 2. Controles antes de risco geram retrabalho.</p>
<h3 id="deo-qa-impl-prazo">Quanto tempo entre implementar e certificar?</h3>
<p>Faixa comum <strong>6 a 12 meses</strong> em PME: o gargalo é operar tempo suficiente para amostragem do auditor. <a href="/certificacao-iso-27001-etapas-prazo-custo/#prazo">Prazo na certificação</a>.</p>
</div>
`;

const QA_AUD_27001 = `
<div ${MARKER}>
<h3 id="deo-qa-aud-interna">Auditoria interna ISO 27001 é obrigatória?</h3>
<p>Sim (cláusula 9.2). Sem ela e análise crítica, estágio 1 costuma ser reprogramado. <a href="/checklist-preparacao-auditoria-interna-iso/">Checklist de preparação</a>.</p>
<h3 id="deo-qa-aud-estagios">Qual a diferença entre auditoria interna e auditoria de certificação?</h3>
<p>Interna: a empresa audita o próprio SGSI. Certificação: organismo acreditado em estágios 1 (prontidão) e 2 (evidência). <a href="/certificacao-iso-27001-etapas-prazo-custo/#fases">Estágios 1 e 2</a>.</p>
</div>
`;

const QA_CONS_27001 = `
<div ${MARKER}>
<h3 id="deo-qa-cons27001-cert">Consultoria emite certificado ISO 27001?</h3>
<p>Não. Consultoria prepara; organismo acreditado (Inmetro/IAF) emite. Contratos separados.</p>
<h3 id="deo-qa-cons27001-escopo">O que mais encarece consultoria e certificação?</h3>
<p>Escopo largo, muitos sites, desenvolvimento próprio e nuvem sem dono claro. Recortar escopo reduz dias de auditoria (ISO/IEC 27006-1), mas não pode excluir o que o cliente exige. <a href="/quanto-custa-iso-27001/">Quanto custa ISO 27001</a>.</p>
</div>
${TAB}
`;

const QA_CERT_27701 = `
<div ${MARKER}>
<h3 id="deo-qa-cert27701-27001">Preciso de ISO 27001 certificada para certificar ISO 27701?</h3>
<p><strong>Não</strong> desde a ISO/IEC 27701:2025. Pode certificar só o SGPI ou integrar ao SGSI. Integração reduz duplicação quando a empresa já trata segurança e privacidade juntas.</p>
<h3 id="deo-qa-cert27701-prazo">Quanto tempo leva a certificação ISO 27701?</h3>
<p>Referência <strong>6 a 12 meses</strong> em médio porte, se inventário de tratamentos e controles A1/A2/A3 já tiverem base. <a href="#fases">Estágios neste guia</a>.</p>
</div>
${TAB}
`;

const QA_Q27701 = `
<div ${MARKER}>
<h3 id="deo-qa-q27701-dias">Como o organismo calcula dias de auditoria ISO 27701?</h3>
<p>Conforme escopo SGPI: número de tratamentos, papéis controlador/operador, sites e complexidade. Cada OCP envia proposta própria; compare ciclo de três anos.</p>
<h3 id="deo-qa-q27701-lgpd">Certificação ISO 27701 substitui conformidade LGPD?</h3>
<p>Não. SGPI auditado comprova gestão de privacidade; obrigações legais (bases, titular, incidentes) continuam à parte. <a href="/iso-27701-lgpd-gdpr-conformidade/">27701 e LGPD</a>.</p>
</div>
`;

const QA_HUB_27701 = `
<div ${MARKER}>
<h3 id="deo-qa-hub27701-cert">Como certificar na ISO 27701 após a edição 2025?</h3>
<p>Guia completo: <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação ISO 27701: critérios e etapas</a>. Implementação: <a href="/como-implementar-a-iso-27701/">como implementar</a>.</p>
<h3 id="deo-qa-hub27701-custo">Quanto custa certificar ISO 27701?</h3>
<p>Implantação + dias de auditoria + manutenções. Detalhe: <a href="/quanto-custa-iso-27701/">quanto custa ISO 27701</a>.</p>
</div>
`;

const QA_IMPL_27701 = `
<div ${MARKER}>
<h3 id="deo-qa-impl27701-inventario">O que é inventário de tratamentos na ISO 27701?</h3>
<p>Registro de finalidades, categorias de dados, bases legais, retenção, compartilhamentos e operadores. É base do risco de privacidade e dos controles Anexo A.</p>
<h3 id="deo-qa-impl27701-27001">Implemento 27001 e 27701 juntos?</h3>
<p>Quando segurança e privacidade compartilham equipe, integrar SGSI e SGPI economiza política e incidentes. Certificação pode ser só 27701 ou ambas. <a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">Relação 27001 e 27701</a>.</p>
</div>
`;

const QA_CONS_27701 = `
<div ${MARKER}>
<h3 id="deo-qa-cons27701-papel">O que a consultoria ISO 27701 entrega?</h3>
<p>Inventário, análise de risco de privacidade, controles A1/A2/A3 operando, auditoria interna e preparação para estágios 1 e 2. Não emite certificado.</p>
<h3 id="deo-qa-cons27701-dpo">Consultoria substitui DPO?</h3>
<p>Não. DPO ou encarregado LGPD cumpre papel legal; consultoria apoia o SGPI. <a href="/certificacao-iso-27701-etapas-e-requisitos/">Etapas de certificação</a>.</p>
</div>
`;

const QA_LGPD = `
<div ${MARKER}>
<h3 id="deo-qa-lgpd-27001">ISO 27001 ajuda na LGPD?</h3>
<p>Ajuda na dimensão <strong>segurança</strong> (confidencialidade, integridade, disponibilidade). LGPD exige também bases legais, direitos do titular e governança de privacidade. <a href="/iso-27701-lgpd-gdpr-conformidade/">27701 e LGPD</a>.</p>
<h3 id="deo-qa-lgpd-cert">Certificado ISO substitui adequação à LGPD?</h3>
<p>Não. Certificação é voluntária; conformidade legal é obrigatória quando a lei se aplica. SGPI 27701 organiza evidência de privacidade auditável.</p>
</div>
`;

const QA_REL = `
<div ${MARKER}>
<h3 id="deo-qa-rel-diferenca">Qual a diferença entre ISO 27001 e ISO 27701?</h3>
<p>27001: SGSI (segurança da informação). 27701: SGPI (privacidade de dados pessoais). Desde 2025 a 27701 certifica independentemente.</p>
<h3 id="deo-qa-rel-integrar">Vale certificar as duas?</h3>
<p>Quando clientes e contratos exigem segurança e privacidade, duas certificadas ou escopo integrado reduzem questionário de fornecedor. <a href="/certificacao-iso-27001-etapas-prazo-custo/">Certificação 27001</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificação 27701</a>.</p>
</div>
`;

patch("iso-27001", QA_HUB_27001, '<h2 id="respostas-diretas">');
patch("requisitos-da-iso-27001", QA_REQ, '<h2 id="c4">');
patch("como-implementar-a-iso-27001", QA_IMPL_27001, '<h2 id="respostas-diretas">');
patch("auditoria-iso-27001", QA_AUD_27001, '<h2 id="respostas-diretas">');
patch("consultoria-iso-27001", QA_CONS_27001, '<h2 id="pme">');
patch("certificacao-iso-27701-etapas-e-requisitos", QA_CERT_27701, '<h2 id="criterios-etapas-pergunta">');
patch("quanto-custa-iso-27701", QA_Q27701, '<h2 id="duas-contas">');
patch("iso-27701-2025-o-que-muda-independencia-da-iso-27001", QA_HUB_27701, '<h2 id="respostas-diretas">');
patch("como-implementar-a-iso-27701", QA_IMPL_27701, '<h2 id="respostas-diretas">');
patch("consultoria-iso-27701", QA_CONS_27701, '<h2 id="respostas-diretas">');
patch("relacao-do-lgpd-com-a-iso-27001", QA_LGPD, '<h2 id="respostas-diretas">');
patch("qual-a-relacao-da-iso-27001-com-a-iso-27701", QA_REL, '<h2 id="respostas-diretas">');

// Triângulo certificação no hub 27001
{
  const p = path.join(dir, "iso-27001.html");
  let b = readFileSync(p, "utf8");
  const tri =
    '<p><strong>Certificação ISO 27001:</strong> <a href="/certificacao-iso-27001-etapas-prazo-custo/">como certificar (estágios 1 e 2)</a> · <a href="/quanto-custa-iso-27001/">quanto custa</a> · <a href="/requisitos-da-iso-27001/">requisitos 4 a 10</a>.</p>\n';
  if (!b.includes("Certificação ISO 27001:</strong> como certificar")) {
    b = insertBefore(b, '<div class="post-portas">', tri);
    if (b) {
      writeFileSync(p, b, "utf8");
      console.log("iso-27001 triangulo ok");
    }
  }
}

{
  const p = path.join(dir, "iso-27701-2025-o-que-muda-independencia-da-iso-27001.html");
  let b = readFileSync(p, "utf8");
  const tri =
    '<p><strong>Certificação ISO 27701:</strong> <a href="/certificacao-iso-27701-etapas-e-requisitos/">critérios e etapas</a> · <a href="/quanto-custa-iso-27701/">quanto custa</a>.</p>\n';
  if (!b.includes("Certificação ISO 27701:</strong>")) {
    b = insertBefore(b, '<div class="post-portas">', tri);
    if (b) {
      writeFileSync(p, b, "utf8");
      console.log("iso-27701 hub triangulo ok");
    }
  }
}

replaceIn("requisitos-da-iso-27001", [
  [
    "Visão geral da norma (o que é, Anexo A, certificação e preço): <a href=\"/iso-27001/\">guia da ISO 27001</a>.",
    "Certificação: <a href=\"/certificacao-iso-27001-etapas-prazo-custo/\">certificação ISO 27001</a> · Hub: <a href=\"/iso-27001/\">guia da ISO 27001</a> · <a href=\"/quanto-custa-iso-27001/\">quanto custa</a>.",
  ],
]);

replaceIn("consultoria-iso-27001", [
  [
    "<p>Este artigo explica o que a consultoria faz, o que continua obrigatoriamente com a sua equipe, como escolher, com as perguntas que separam método de discurso, e como funciona o modelo da Templum.</p>",
    "<p>Este artigo explica o que a consultoria faz, o que continua com a sua equipe e como escolher. Certificação: <a href=\"/certificacao-iso-27001-etapas-prazo-custo/\">etapas, prazo e custo</a> · <a href=\"/como-implementar-a-iso-27001/\">implementar ISO 27001</a> · <a href=\"/quanto-custa-iso-27001/\">quanto custa</a>.</p>",
  ],
]);

replaceIn("como-implementar-a-iso-27001", [
  [
    "A avaliação de riscos é o que determina todo o resto.</p>",
    "A avaliação de riscos é o que determina todo o resto.</p>\n<p>Depois da implementação: <a href=\"/certificacao-iso-27001-etapas-prazo-custo/\">certificação ISO 27001</a> · <a href=\"/auditoria-iso-27001/\">auditoria interna e externa</a> · <a href=\"/quanto-custa-iso-27001/\">custo</a>.</p>",
  ],
]);

replaceIn("certificacao-iso-27001-etapas-prazo-custo", [
  ["/analise-de-causa-raiz/", "/analise-de-causa-raiz-o-que-e-e-como-fazer/"],
]);

console.log("Lote 27001/27701 build ok");
