/** P0 GEO: LAIA + reforço consultoria 14001 (FAQ distribuído, respostas-diretas, tabela). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'id="deo-lote-plano-14001-laia-2026-10-16"';

const SLUG_LAIA = "como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa";
const SLUG_CONSULT = "consultoria-iso-14001";

const RESPOSTAS_DIRETAS = `
<div id="respostas-diretas">
<ul>
<li><strong>O que é LAIA?</strong> Levantamento de aspectos (o que a operação faz no ambiente) e impactos (efeito no ambiente), com critérios de significância definidos pela empresa na ISO 14001.</li>
<li><strong>Como fazer?</strong> Percorra processos em condição normal, anormal e emergência; liste entradas e saídas; avalie impactos; classifique significativos e ligue a controles operacionais.</li>
<li><strong>É obrigatório para certificar?</strong> Na prática, sim: sem LAIA coerente com a operação, o SGA não sustenta auditoria de certificação (requisito 6.1.2).</li>
<li><strong>LAIA x EIA/RIMA:</strong> LAIA do SGA ISO 14001 não substitui estudo de licenciamento; finalidades e escala são diferentes.</li>
<li><strong>Certificação:</strong> <a href="/iso-14001/">Guia certificação ISO 14001</a> · <a href="/consultoria-iso-14001/">Consultoria ISO 14001</a></li>
</ul>
</div>
`;

const DEO_LAIA = `
<div ${MARKER}>
<h3 id="deo-qa-laia-passo">Como fazer levantamento de aspectos e impactos ambientais?</h3>
<p>Mapeie processos da operação certificada, liste aspectos (consumo, emissão, resíduo, efluente, ruído), descreva impactos, aplique critérios de significância documentados e defina controles para os significativos. Inclua condições normal, anormal e emergência.</p>
<h3 id="deo-qa-laia-emergencia">O LAIA precisa incluir situação de emergência?</h3>
<p>Sim. Vazamento, incêndio, transbordo e falha de equipamento entram no levantamento. É onde costumam estar os impactos mais graves e o que mais falta em LAIA genérico.</p>
<h3 id="deo-qa-laia-revisao">Quando revisar o LAIA?</h3>
<p>Após mudança de processo, produto, legislação ou incidente ambiental, e de forma programada a cada ciclo de auditoria. LAIA congelado por anos não passa no estágio 2.</p>
</div>
`;

const TAB_ORGANISMO = `
<h2 id="consultoria-organismo">Consultoria e organismo certificador na ISO 14001: qual a diferença?</h2>
<p>A consultoria prepara LAIA, requisitos legais e controles operacionais; o organismo acreditado audita e emite o certificado ambiental. Contratos separados: quem consulta não certifica no mesmo ciclo.</p>
<table>
<thead><tr><th>Papel</th><th>Função no projeto 14001</th><th>Emite certificado?</th></tr></thead>
<tbody>
<tr><td>Consultoria</td><td>LAIA, matriz legal, procedimentos, treinamento, simulação de auditoria interna</td><td>Não</td></tr>
<tr><td>Organismo certificador (OCP)</td><td>Auditoria estágio 1 e 2, manutenção anual, recertificação</td><td>Sim</td></tr>
<tr><td>Equipe interna</td><td>Operação, registros ambientais, indicadores, NCs e emergências</td><td>Não</td></tr>
</tbody>
</table>
`;

const DEO_CONSULT = `
<div ${MARKER}>
<h3 id="deo-qa-consult-14001-quando">Quando contratar consultoria ISO 14001?</h3>
<p>Quando edital, cliente ou licenciamento exige SGA maduro e o time interno não tem horas para LAIA, matriz legal e evidência de controles antes do estágio 2. <a href="/iso-14001/#o-processo-de-implementacao-da-iso-14001">Prazo típico de certificação</a>.</p>
<h3 id="deo-qa-consult-14001-laia">A consultoria faz o LAIA por nós?</h3>
<p>Facilita metodologia e workshop, mas quem conhece a operação precisa validar aspectos e impactos no chão. LAIA copiado de modelo é NC previsível. <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">Passo a passo do LAIA</a>.</p>
</div>
${TAB_ORGANISMO}
`;

function patchLaia() {
  const p = path.join(dir, `${SLUG_LAIA}.html`);
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) {
    console.log(SLUG_LAIA, "ja patchado");
    return;
  }
  const anchorIntro = `<p>Guia do blog Certificação ISO, da <a href="https://templum.com.br/iso-14001/"><strong>Templum Consultoria</strong></a>`;
  const i = body.indexOf(anchorIntro);
  if (i < 0) throw new Error("anchor intro LAIA");
  const endP = body.indexOf("</p>", i) + 4;
  body = body.slice(0, endP) + RESPOSTAS_DIRETAS + body.slice(endP);

  body = body.replace(
    '<h2 id="realizando-o-laia">Realizando o LAIA</h2>',
    `${DEO_LAIA}\n<h2 id="realizando-o-laia">Como fazer o levantamento de aspectos e impactos (LAIA)?</h2>\n<p>O LAIA começa no chão de fábrica, pátio ou obra: percorra cada processo do escopo, registre entradas e saídas ambientais e só depois consolide matriz e critérios de significância.</p>`,
  );

  body = body.replace(
    '<h2 id="conclusao"><strong>Conclusão</strong></h2>',
    `${TAB_ORGANISMO}\n<h2 id="conclusao"><strong>Conclusão</strong></h2>`,
  );

  writeFileSync(p, body, "utf8");
  console.log(SLUG_LAIA, "patch ok", body.length);
}

function patchConsultoria() {
  const p = path.join(dir, `${SLUG_CONSULT}.html`);
  if (!existsSync(p)) {
    console.warn("skip", SLUG_CONSULT, "sem html");
    return;
  }
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) {
    console.log(SLUG_CONSULT, "ja patchado");
    return;
  }
  const needle = '<h2 id="escolher">Como escolher consultoria ISO 14001</h2>';
  const i = body.indexOf(needle);
  if (i < 0) throw new Error("anchor consultoria escolher");
  body = body.slice(0, i) + DEO_CONSULT + "\n" + body.slice(i);
  writeFileSync(p, body, "utf8");
  console.log(SLUG_CONSULT, "patch ok", body.length);
}

patchLaia();
patchConsultoria();
