/** Lote GEO: cluster ISO 45001 + operacional F2 (Semrush ferramentas). Sem citar concorrentes. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-45001-operacional-2026-10-12"';

const TAB_SGSSO = `
<h2 id="consultoria-organismo-sgsso">Consultoria e organismo certificador: qual a diferença?</h2>
<p>A consultoria prepara o SGSSO; o organismo acreditado audita e emite o certificado. Contratos separados: quem consulta não certifica a mesma empresa no mesmo ciclo.</p>
<table>
<thead><tr><th>Papel</th><th>Função</th><th>Emite certificado?</th></tr></thead>
<tbody>
<tr><td>Consultoria</td><td>Perigos e riscos, legal, participação dos trabalhadores, documentação, auditoria interna assistida</td><td>Não</td></tr>
<tr><td>Organismo certificador (OCP)</td><td>Estágios 1 e 2, manutenção anual, recertificação</td><td>Sim</td></tr>
<tr><td>Equipe interna / SST</td><td>Operação, PGR, registros, inspeções, evidência no chão de fábrica</td><td>Não</td></tr>
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
  if (body.includes(MARKER)) return console.log(slug, "ja lote 45001/operacional");
  const next = insertBefore(body, needle, block);
  if (!next) return console.warn(slug, "anchor", needle.slice(0, 40));
  writeFileSync(p, next, "utf8");
  console.log(slug, "ok");
}

function appendInDeoBlock(slug, oldMarker, extraH3) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) return;
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) return console.log(slug, "operacional ja");
  const close = body.indexOf("</div>", body.indexOf(oldMarker));
  if (close < 0) return console.warn(slug, "deo close");
  body = body.slice(0, close) + extraH3 + body.slice(close);
  writeFileSync(p, body, "utf8");
  console.log(slug, "deo append ok");
}

function prepend(slug, block) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) return console.warn("skip", slug);
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) return console.log(slug, "ja");
  writeFileSync(p, block + "\n" + body, "utf8");
  console.log(slug, "prepend ok");
}

const QA_CUSTO_45001 = `
<div ${MARKER}>
<h3 id="deo-qa-c45001-consultoria">Quanto custa consultoria ISO 45001?</h3>
<p>Depende de porte, unidades, grau de risco, PGR existente e modelo remoto ou presencial. Proposta separada do organismo certificador. <a href="#o-que-encarece">O que encarece</a>.</p>
<h3 id="deo-qa-c45001-organismo">Quanto cobra o organismo na ISO 45001?</h3>
<p>Cobrança por <strong>dias de auditoria</strong> (colaboradores no escopo, sites, complexidade). Peça ciclo de três anos na cotação. <a href="#duas-contas">Duas contas</a>.</p>
<h3 id="deo-qa-c45001-pgr">Preciso pagar PGR e ISO 45001 juntos?</h3>
<p>PGR é obrigação legal (NR-1). Certificação ISO 45001 é voluntária. Inventário bem feito reduz retrabalho, mas são linhas de orçamento distintas. <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a>.</p>
</div>
`;

const QA_HUB_45001 = `
<div ${MARKER}>
<h3 id="deo-qa-hub45001-cert">Como certificar na ISO 45001?</h3>
<p>Passo a passo em <a href="/passo-a-passo-certificacao-iso-45001/">certificação ISO 45001 em 7 etapas</a>: comprometimento, perigos/riscos, legal, operação, auditoria interna, organismo acreditado.</p>
<h3 id="deo-qa-hub45001-nr1">ISO 45001 substitui NR-1 e PGR?</h3>
<p>Não. NRs e PGR são lei; SGSSO certificado é voluntário. O mesmo inventário de riscos pode alimentar os dois. <a href="/nr-1-e-iso-45001/">Mapa NR-1 x cláusulas</a>.</p>
<h3 id="deo-qa-hub45001-risco">Onde entra análise de risco na ISO 45001?</h3>
<p>Cláusula <strong>6.1.2</strong> (perigos e avaliação de riscos) e controles na <strong>8.1</strong>. Guia: <a href="/iso-45001-perigos/">perigos e riscos ISO 45001</a>.</p>
</div>
`;

const QA_CONS_45001 = `
<div ${MARKER}>
<h3 id="deo-qa-cons45001-cert">Consultoria emite certificado ISO 45001?</h3>
<p>Não. Consultoria prepara o SGSSO; organismo acreditado (Inmetro/IAF) audita e emite. <a href="/passo-a-passo-certificacao-iso-45001/#consultoria-organismo">Consultoria x organismo</a>.</p>
<h3 id="deo-qa-cons45001-prazo">Quanto tempo leva com consultoria?</h3>
<p>Referência <strong>10 a 14 meses</strong> em porte médio até auditoria de certificação. <a href="/passo-a-passo-certificacao-iso-45001/#prazo">Prazo típico</a> · <a href="/quanto-custa-iso-45001/">custo</a>.</p>
</div>
${TAB_SGSSO}
`;

const QA_PERIGOS = `
<div ${MARKER}>
<h3 id="deo-qa-perigos-matriz">Como fazer matriz de risco na ISO 45001?</h3>
<p>Liste perigos por processo/unidade, estime probabilidade e severidade com critérios fixos antes da pontuação, defina controles na hierarquia (eliminar antes de EPI) e registre revisão após mudanças ou incidentes.</p>
<h3 id="deo-qa-perigos-pgr">Matriz ISO 45001 é igual ao PGR?</h3>
<p>Lógica parecida (inventário + plano de ação). PGR atende NR-1; SGSSO exige ciclo completo 4 a 10 e auditoria externa. <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a>.</p>
</div>
`;

const QA_NR1 = `
<div ${MARKER}>
<h3 id="deo-qa-nr1-obrig">Tenho ISO 45001, ainda preciso do PGR?</h3>
<p>Sim, onde a NR-1 aplica. Certificação não dispensa obrigação legal; use o SGSSO para manter inventário e evidências alinhados. <a href="/nr-1/">NR-1</a>.</p>
<h3 id="deo-qa-nr1-custo">Quanto custa ir além do PGR até certificar?</h3>
<p>Implantação SGSSO + auditoria do organismo + manutenções. <a href="/quanto-custa-iso-45001/">Quanto custa a ISO 45001</a>.</p>
</div>
`;

const QA_REQ_45001 = `
<div ${MARKER}>
<h3 id="deo-qa-req45001-clausulas">Quais cláusulas são auditadas na ISO 45001?</h3>
<p><strong>4 a 10</strong> (Anexo SL). Cláusulas 1 a 3 são introdutórias. Foco do auditor: <strong>6.1</strong>, <strong>8.1</strong> e <strong>5.4</strong>.</p>
<h3 id="deo-qa-req45001-cert">Requisitos e certificação são a mesma coisa?</h3>
<p>Requisitos descrevem o que o SGSSO deve ter; certificação é auditoria de terceira parte comprovando conformidade no escopo. <a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo</a>.</p>
</div>
`;

const QA_PASSO_EXTRA = `
<div ${MARKER}>
<h3 id="deo-qa-p45001-head">Onde está o guia de certificação ISO 45001?</h3>
<p>Este artigo é o pillar: etapas, prazo, consultoria x organismo e links para <a href="/quanto-custa-iso-45001/">custo</a> e <a href="/iso-45001/">o que é a norma</a>.</p>
</div>
`;

const QA_FLUX_BPM = `
<div ${MARKER}>
<h3 id="deo-qa-bpm-iso">BPM substitui mapeamento de processos na ISO 9001?</h3>
<p>Não. BPM (gestão de processos de negócio) pode usar software ou método, mas a norma exige entender sequência, entradas, saídas e responsáveis (4.4). Fluxograma e mapa cumprem isso sem plataforma obrigatória. <a href="/mapeamento-de-processos-e-a-iso-9001/">Mapeamento e ISO 9001</a>.</p>
<h3 id="deo-qa-bpm-flux">Qual a diferença entre fluxograma e mapa de processos?</h3>
<p>Fluxograma detalha uma sequência; mapa mostra processos principais e ligações entre eles. Use os dois níveis: macro no mapa, micro no fluxograma da operação crítica.</p>
</div>
`;

const QA_MAP_RISCO = `
<h3 id="deo-qa-map-61">Mapeamento de processos ajuda na análise de risco ISO 9001?</h3>
<p>Sim. No 4.4 e no 6.1, riscos e oportunidades ficam mais claros quando cada processo tem entradas, saídas e dono. Depois, plano de ação: <a href="/5w2h-plano-de-acao-iso-9001/">5W2H</a> ou <a href="/5w2h-usando-para-transformar-os-riscos-em-oportunidades/">5W2H para riscos e oportunidades</a>.</p>
`;

const QA_DOC_ARQ = `
<h3 id="deo-qa-doc-arquivo">Como arquivar documentos do SGQ sem perder conformidade?</h3>
<p>Defina retenção na lista mestra, guarde versões obsoletas só pelo prazo acordado e registre descarte. Arquivo físico ou digital segue o mesmo critério de rastreio (7.5). <a href="#lista-mestra">Lista mestra</a>.</p>
`;

const QA_CHECK_AUD = `
<div ${MARKER}>
<h3 id="deo-qa-check-interna">Auditoria interna ISO: por onde começar?</h3>
<p>Plano anual, escopo por processo, checklist alinhada à norma, amostra de registros e entrevista com quem executa. Ferramentas: <a href="/auditoria-interna-iso-9001-ferramentas/">auditoria interna ISO 9001</a>.</p>
</div>
`;

const PREPEND_5W2H = `<p><strong>5W2H para riscos e oportunidades</strong> transforma o que saiu da análise de risco (ISO 9001 cláusula 6.1) em plano de ação com dono, prazo e custo. Use depois do mapeamento ou da matriz de riscos; cada linha da matriz vira uma ação What/Why/Where/When/Who/How/How much.</p>
<p>Guia Certificação ISO · <a href="https://templum.com.br/iso-9001/">Templum Consultoria</a>. Método completo: <a href="/5w2h-plano-de-acao-iso-9001/">5W2H plano de ação ISO 9001</a> · <a href="/iso-9001-requisitos-6-1-acoes-para-abordar-riscos-e-oportunidades/">requisito 6.1</a> · <a href="/mapeamento-de-processos-e-a-iso-9001/">mapeamento de processos</a>.</p>

<div ${MARKER}>
<h3 id="deo-qa-5w2h-risco">Como usar 5W2H depois de identificar riscos?</h3>
<p>Priorize riscos altos, abra uma linha 5W2H por ação de tratamento ou oportunidade, defina responsável e prazo, registre evidência de conclusão na análise crítica.</p>
<h3 id="deo-qa-5w2h-iso">5W2H é obrigatório na ISO 9001?</h3>
<p>Não há nome obrigatório, mas a norma exige ações planejadas para riscos e oportunidades (6.1) e melhoria (10.3). 5W2H é formato prático de plano. <a href="/5w2h-plano-de-acao-iso-9001/">Guia 5W2H ISO 9001</a>.</p>
</div>

`;

patch("quanto-custa-iso-45001", QA_CUSTO_45001, '<h2 id="duas-contas">');
patch("iso-45001", QA_HUB_45001, '<h2 id="respostas-diretas">');
patch("consultoria-iso-45001", QA_CONS_45001, '<h2 id="respostas-diretas">');
patch("iso-45001-perigos", QA_PERIGOS, '<h2 id="respostas-diretas">');
patch("nr-1-e-iso-45001", QA_NR1, '<h2 id="respostas-diretas">');
patch("iso-45001-requisitos-tudo-que-voce-precisa-saber", QA_REQ_45001, '<h2 id="respostas-diretas">');
patch("passo-a-passo-certificacao-iso-45001", QA_PASSO_EXTRA, '<div id="deo-lote-2026-10-12">');
patch("o-que-e-fluxograma-de-processos", QA_FLUX_BPM, '<h2 id="respostas-diretas">');
appendInDeoBlock("mapeamento-de-processos-e-a-iso-9001", 'deo-lote-2026-10-12', QA_MAP_RISCO);
appendInDeoBlock("controle-de-documentos", "deo-lote-2026-10-12", QA_DOC_ARQ);
patch("checklist-preparacao-auditoria-interna-iso", QA_CHECK_AUD, '<p><strong>Neste artigo:</strong></p>');
prepend("5w2h-usando-para-transformar-os-riscos-em-oportunidades", PREPEND_5W2H);

// Triângulo certificação no hub 45001
{
  const p = path.join(dir, "iso-45001.html");
  let b = readFileSync(p, "utf8");
  const tri =
    '<p><strong>Certificação ISO 45001:</strong> <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo</a> · <a href="/quanto-custa-iso-45001/">quanto custa</a> · <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">requisitos 4 a 10</a>.</p>\n';
  if (!b.includes("Certificação ISO 45001:</strong> passo a passo")) {
    const next = insertBefore(b, '<div class="post-portas">', tri);
    if (next) {
      writeFileSync(p, next, "utf8");
      console.log("iso-45001 triangulo ok");
    }
  }
}

console.log("Lote 45001 + operacional build ok");
