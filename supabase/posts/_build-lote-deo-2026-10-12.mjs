/** Lote DEO: FAQ distribuído + tabela consultoria x organismo (sem citar concorrentes). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const MARKER = 'id="deo-lote-2026-10-12"';

const TAB_ORGANISMO = `
<h2 id="consultoria-organismo">Consultoria e organismo certificador: qual a diferença?</h2>
<p>A consultoria prepara o sistema de gestão; o organismo acreditado audita e emite o certificado. São contratos separados e, por regra de acreditação, quem consulta não certifica a mesma empresa no mesmo ciclo.</p>
<table>
<thead><tr><th>Papel</th><th>Função</th><th>Emite certificado?</th></tr></thead>
<tbody>
<tr><td>Consultoria</td><td>Diagnóstico, mapa de processos, documentação, treinamento, simulação de auditoria interna</td><td>Não</td></tr>
<tr><td>Organismo certificador (OCP)</td><td>Auditoria de certificação (estágios 1 e 2), manutenção anual, recertificação</td><td>Sim</td></tr>
<tr><td>Equipe interna</td><td>Operação diária, registros, indicadores, tratamento de NCs</td><td>Não</td></tr>
</tbody>
</table>
`;

function insertAfter(body, needle, block) {
  const i = body.indexOf(needle);
  if (i < 0) return null;
  const at = i + needle.length;
  return body.slice(0, at) + "\n" + block + body.slice(at);
}

function insertBefore(body, needle, block) {
  const i = body.indexOf(needle);
  if (i < 0) return null;
  return body.slice(0, i) + block + "\n" + body.slice(i);
}

function patch(slug, block, { after, before } = {}) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) {
    console.warn("skip", slug);
    return;
  }
  let body = readFileSync(p, "utf8");
  if (body.includes(MARKER)) {
    console.log(slug, "ja DEO lote");
    return;
  }
  if (after) body = insertAfter(body, after, block);
  else if (before) body = insertBefore(body, before, block);
  else return console.warn(slug, "sem anchor");
  if (!body) return console.warn(slug, "anchor nao encontrado");
  writeFileSync(p, body, "utf8");
  console.log(slug, "DEO ok");
}

const QA_9001_PASSO = `
<div ${MARKER}>
<h3 id="deo-qa-9001-prazo">Quanto tempo leva para certificar na ISO 9001?</h3>
<p>Em média, de <strong>6 a 12 meses</strong> até a auditoria de certificação, conforme porte, maturidade e disponibilidade da equipe. O gargalo costuma ser gerar evidência operacional, não só documentos. <a href="#prazo-custo">Prazo e custo neste guia</a>.</p>
<h3 id="deo-qa-9001-consultoria">Preciso de consultoria para obter a certificação ISO 9001?</h3>
<p>Não é exigido por lei, mas acelera o caminho até o estágio 2 sem retrabalho. A consultoria prepara o SGQ; o organismo acreditado emite o certificado. <a href="/consultoria-iso-9001/">Consultoria ISO 9001</a>.</p>
<h3 id="deo-qa-9001-custo">Quais etapas influenciam o valor total da certificação ISO 9001?</h3>
<p>Implantação (consultoria e horas internas), dias de auditoria do organismo, número de unidades no escopo e manutenções no ciclo de três anos. <a href="/quanto-custa-iso-9001/">Quanto custa a certificação ISO 9001</a>.</p>
</div>
${TAB_ORGANISMO}
`;

const QA_27001 = `
<div ${MARKER}>
<h3 id="deo-qa-27001-preco">Quanto custa a certificação ISO 27001?</h3>
<p>Não há preço fixo: combina implantação do SGSI, dias de auditoria (ISO/IEC 27006-1) e manutenções anuais. Resumo: <a href="/quanto-custa-iso-27001/">quanto custa ISO 27001</a> · <a href="#custo">fatores neste artigo</a>.</p>
<h3 id="deo-qa-27001-consultoria">Preciso de consultoria para certificar na ISO 27001?</h3>
<p>A norma não exige consultoria, mas a maioria das empresas contrata apoio para riscos, SoA e evidência antes do estágio 2. Quem consulta não pode ser o mesmo organismo que certifica. <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a>.</p>
<h3 id="deo-qa-27001-prazo">Quanto tempo leva a certificação ISO 27001?</h3>
<p>Faixa comum: <strong>6 a 12 meses</strong> na primeira certificação em PME, se o escopo for disciplinado. Escopos grandes ou imaturos passam de 12 meses. <a href="#prazo">Detalhe de prazo</a>.</p>
</div>
${TAB_ORGANISMO}
`;

const QA_45001_PASSO = `
<div ${MARKER}>
<h3 id="deo-qa-45001-prazo">Quanto tempo leva para certificar na ISO 45001?</h3>
<p>Referência: <strong>10 a 14 meses</strong> em porte médio, dependendo de PGR, unidades e cultura de SST. <a href="#prazo">Prazo típico</a>.</p>
<h3 id="deo-qa-45001-pgr">Preciso do PGR antes da ISO 45001?</h3>
<p>O PGR é obrigação legal (NR-1); a ISO 45001 é voluntária. Inventário de riscos bem feito reduz duplicação, mas certificação continua sendo projeto à parte. <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a>.</p>
<h3 id="deo-qa-45001-custo">Quanto custa certificar na ISO 45001?</h3>
<p>Soma implantação do SGSSO, auditoria do organismo e manutenção em três anos. <a href="/quanto-custa-iso-45001/">Quanto custa a certificação ISO 45001</a>.</p>
</div>
${TAB_ORGANISMO}
`;

const QA_14001 = `
<div ${MARKER}>
<h3 id="deo-qa-14001-licenca">A certificação ISO 14001 substitui licença ambiental?</h3>
<p>Não. Licença é exigência do órgão ambiental; certificado ISO 14001 é voluntário e comprova sistema de gestão ambiental auditado. A norma exige conformidade legal, não dispensa licença.</p>
<h3 id="deo-qa-14001-laia">O que é LAIA e por que atrasa a certificação?</h3>
<p>Levantamento de aspectos e impactos ambientais: identifica o que interage com o meio ambiente e o que é significativo. Sem LAIA maduro, auditoria trava no estágio 2. <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">Como fazer o LAIA</a>.</p>
<h3 id="deo-qa-14001-prazo">Quanto tempo leva para obter a certificação ISO 14001?</h3>
<p>Média de <strong>10 a 18 meses</strong>, incluindo implementação e auditoria, conforme porte e complexidade ambiental. <a href="#o-processo-de-implementacao-da-iso-14001">Etapas neste guia</a>.</p>
</div>
${TAB_ORGANISMO}
`;

const QA_MAP = `
<div ${MARKER}>
<h3 id="deo-qa-map-gargalo">Como identificar gargalos ao mapear processos?</h3>
<p>Compare tempo de ciclo, filas entre etapas e retrabalho com quem executa o processo. Gargalo aparece onde a fila cresce ou onde a mesma correção se repete. Valide no chão de fábrica, não só no desenho.</p>
<h3 id="deo-qa-map-ferramenta">Qual ferramenta usar para mapeamento na ISO 9001?</h3>
<p>Fluxograma em planilha, papel ou diagrama digital serve, desde que haja versão controlada (requisito 7.5). A norma não exige software de BPM. <a href="/o-que-e-fluxograma-de-processos/">Fluxograma de processos</a>.</p>
</div>
`;

const QA_DOC = `
<div ${MARKER}>
<h3 id="deo-qa-doc-ged">GED substitui o requisito 7.5 da ISO 9001?</h3>
<p>Não. Software de gestão documental ajuda, mas a conformidade exige controle de aprovação, revisão, distribuição, registros e retenção definidos no SGQ. <a href="/iso-9001-requisitos-7-5-informacao-documentada/">Requisito 7.5</a>.</p>
<h3 id="deo-qa-doc-pop">Qual a diferença entre POP e instrução de trabalho?</h3>
<p>POP descreve sequência operacional; instrução de trabalho detalha como executar uma tarefa específica. Ambos são informação documentada se forem controlados na lista mestra. <a href="/instrucao-de-trabalho-it/">Instrução de trabalho (IT)</a>.</p>
</div>
`;

const QA_ASPECTOS = `
<div ${MARKER}>
<h3 id="deo-qa-aspecto-significativo">Como saber se um aspecto ambiental é significativo?</h3>
<p>Aplique critérios escritos antes da avaliação (legal, impacto, probabilidade, percepção de partes interessadas). Aspecto significativo exige controle operacional documentado e indicador quando couber. <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">Critérios no passo a passo do LAIA</a>.</p>
<h3 id="deo-qa-aspecto-laia">LAIA é obrigatório para certificar na ISO 14001?</h3>
<p>Sim, no sentido prático: sem levantamento de aspectos e impactos atualizado, o SGA não sustenta auditoria de certificação. <a href="/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa/">Passo a passo do LAIA</a>.</p>
</div>
`;

const QA_AUDITORIA = `
<div ${MARKER}>
<h3 id="deo-qa-aud-praticas">Quais práticas facilitam a auditoria interna ISO 9001?</h3>
<p>Programa anual, checklist por processo, amostragem de registros, entrevistas com executores e NCs com causa raiz. Simule rigor antes da auditoria externa. <a href="/checklist-preparacao-auditoria-interna-iso/">Checklist de preparação</a>.</p>
<h3 id="deo-qa-aud-ferramentas">Quais ferramentas usar na auditoria interna?</h3>
<p>Plano de auditoria, lista de verificação, registro de NC, 5 Porquês ou Ishikawa para causa, e plano de ação com prazo. Não precisa software dedicado: planilha controlada basta se houver rastreio.</p>
</div>
`;

const QA_5W2H = `
<div ${MARKER}>
<h3 id="deo-qa-5w2h-quando">Quando usar 5W2H na ISO 9001?</h3>
<p>Use para plano de ação após NC, auditoria ou indicador fora de meta. Cada linha da matriz vira ação com responsável, prazo e evidência de fechamento (requisito 10.2).</p>
<h3 id="deo-qa-5w2h-exemplo">Como preencher 5W2H na prática?</h3>
<p>Defina o problema, liste ações, preencha What/Why/Where/When/Who/How/How much por linha, valide com dono de processo e registre conclusão. <a href="#passo-a-passo">Passo a passo neste artigo</a>.</p>
</div>
`;

const QA_5PORQUES = `
<div ${MARKER}>
<h3 id="deo-qa-5pq-nc">5 Porquês serve para não conformidade na ISO 9001?</h3>
<p>Sim. É método de análise de causa raiz: repita “por quê?” até chegar a causa que a empresa pode controlar, depois abra ação corretiva com evidência (10.2).</p>
<h3 id="deo-qa-5pq-ishikawa">5 Porquês ou Ishikawa: qual usar?</h3>
<p>5 Porquês para causa linear rápida; Ishikawa quando várias categorias (método, máquina, mão de obra) contribuem. Os dois podem ser combinados no mesmo plano de ação.</p>
</div>
`;

const QA_CAUSA = `
<div ${MARKER}>
<h3 id="deo-qa-causa-raiz">O que é causa raiz na ISO 9001?</h3>
<p>É a origem do problema que, se corrigida, evita repetição da não conformidade. Auditoria espera análise, não só correção imediata do sintoma (10.2).</p>
<h3 id="deo-qa-causa-evidencia">Como registrar análise de causa raiz?</h3>
<p>Documento ou registro com descrição da NC, método usado (5 Porquês, Ishikawa), causa identificada, ação, responsável, prazo e verificação de eficácia.</p>
</div>
`;

const QA_IT = `
<div ${MARKER}>
<h3 id="deo-qa-it-pop">Instrução de trabalho é obrigatória na ISO 9001?</h3>
<p>Só quando a ausência comprometer a conformidade do produto ou serviço. O critério é risco e repetibilidade, não “IT para tudo”.</p>
<h3 id="deo-qa-it-revisao">Como controlar revisão de IT?</h3>
<p>Lista mestra, aprovação, identificação de versão, distribuição aos pontos de uso e obsoletos retirados. Requisito 7.5.</p>
</div>
`;

const QA_7FERR = `
<div ${MARKER}>
<h3 id="deo-qa-7f-causa">Qual ferramenta da qualidade usar para causa raiz?</h3>
<p>Diagrama de Ishikawa (espinha de peixe) e 5 Porquês são as mais usadas antes do plano de ação. <a href="/analise-de-causa-raiz-o-que-e-e-como-fazer/">Análise de causa raiz</a>.</p>
<h3 id="deo-qa-7f-pareto">Para que serve o diagrama de Pareto na ISO 9001?</h3>
<p>Priorizar problemas ou NCs que concentram a maior parte do impacto, focando melhoria onde o retorno é maior (9.1 e 10.3).</p>
</div>
`;

const QA_5S = `
<div ${MARKER}>
<h3 id="deo-qa-5s-9001">5S é requisito da ISO 9001?</h3>
<p>Não é requisito nomeado, mas apoia ordem, identificação e ambiente de trabalho (7.1.4) e reduz erros operacionais quando ligado a processos.</p>
<h3 id="deo-qa-5s-auditoria">Como auditar 5S sem virar fiscalização?</h3>
<p>Defina critério por área, fotografia antes/depois, responsável e frequência de verificação; registre no SGQ como prática operacional, não campanha isolada.</p>
</div>
`;

const QA_75 = `
<div ${MARKER}>
<h3 id="deo-qa-75-lista">O que entra na lista mestra de documentos?</h3>
<p>Documentos e registros controlados do SGQ: procedimentos, ITs, formulários, registros obrigatórios, com versão, aprovador e local de acesso.</p>
<h3 id="deo-qa-75-registro">Qual a diferença entre documento e registro na ISO 9001?</h3>
<p>Documento diz como fazer; registro prova que foi feito. Ambos exigem controle, mas retenção de registros segue prazos definidos pela empresa.</p>
</div>
`;

const QA_44 = `
<div ${MARKER}>
<h3 id="deo-qa-44-processo">O que a ISO 9001:2026 exige sobre gestão de processos?</h3>
<p>Determinar processos do SGQ, entradas/saídas, sequência, critérios, recursos, responsabilidades, riscos e melhoria (4.4). Mapa sem dono não basta.</p>
<h3 id="deo-qa-44-mapa">Mapa de processos substitui procedimento?</h3>
<p>Não. Mapa mostra o sistema; procedimento ou IT detalha execução onde o risco exige.</p>
</div>
`;

const QA_EXEMPLOS = `
<div ${MARKER}>
<h3 id="deo-qa-ex-contas">Como mapear contas a pagar para a ISO 9001?</h3>
<p>Defina início (recebimento da NF) e fim (pagamento/baixa), etapas de conferência, aprovação e registro, donos e evidências. <a href="#exemplo-contas-a-pagar">Exemplo neste artigo</a>.</p>
<h3 id="deo-qa-ex-padaria">Existe exemplo de mapeamento para padaria?</h3>
<p>Sim: recebimento de insumos, produção, vitrine e entrega, com pontos de controle de temperatura e validade. <a href="#exemplo-padaria">Ver exemplo padaria</a>.</p>
</div>
`;

const QA_QUANTO_27001 = `
<div ${MARKER}>
<h3 id="deo-qa-q27001-dias">Como o organismo calcula dias de auditoria ISO 27001?</h3>
<p>Com base na ISO/IEC 27006-1: número de pessoas no escopo, sites, complexidade e fatores de redução ou ampliação. Cada OCP informa proposta própria.</p>
<h3 id="deo-qa-q27001-separar">Consultoria e certificação entram na mesma nota?</h3>
<p>Não devem. São contratos distintos; quem consulta não certifica a mesma empresa no mesmo ciclo.</p>
</div>
`;

const QA_QUANTO_9001 = `
<div ${MARKER}>
<h3 id="deo-qa-q9001-etapas">Quais etapas influenciam o valor total da certificação ISO 9001?</h3>
<p>Diagnóstico, escopo, documentação, treinamento, auditoria interna, dias de auditoria do organismo e manutenções no ciclo de três anos. <a href="#duas-contas">Duas contas neste artigo</a>.</p>
<h3 id="deo-qa-q9001-comparar">Como comparar propostas de organismo certificador?</h3>
<p>Peça escopo auditado, número de dias, inclusão de deslocamento, prazo entre estágios 1 e 2 e valor das manutenções anuais. Compare ciclo completo, não só a certificação inicial.</p>
</div>
`;

patch("passo-a-passo-certificacao-iso-9001", QA_9001_PASSO, {
  before: '<h2 id="etapas">',
});
patch("certificacao-iso-27001-etapas-prazo-custo", QA_27001, {
  before: '<h2 id="passos-e-prazo-certificacao">',
});
patch("passo-a-passo-certificacao-iso-45001", QA_45001_PASSO, {
  before: '<h2 id="etapas">',
});
patch("iso-14001", QA_14001, {
  before: '<h2 id="o-que-e-sga">',
});
patch("mapeamento-de-processos-e-a-iso-9001", QA_MAP, {
  before: '<h2 id="como-ele-funciona">',
});
patch("controle-de-documentos", QA_DOC, {
  before: '<h2 id="lista-mestra">',
});
patch("quanto-custa-iso-9001", QA_QUANTO_9001, {
  before: '<h2 id="quanto-custa">',
});

patch("como-identificar-aspecto-impacto-ambiental", QA_ASPECTOS, {
  before: '<p class="post-aprofunde">',
});

for (const [slug, block] of [
  ["auditoria-interna-iso-9001-ferramentas", QA_AUDITORIA],
  ["5w2h-plano-de-acao-iso-9001", QA_5W2H],
  ["cinco-porques-analise-de-causa-raiz", QA_5PORQUES],
  ["analise-de-causa-raiz-o-que-e-e-como-fazer", QA_CAUSA],
  ["instrucao-de-trabalho-it", QA_IT],
  ["as-sete-ferramentas-da-qualidade", QA_7FERR],
  ["programa-5s-e-a-iso-9001", QA_5S],
  ["iso-9001-requisitos-7-5-informacao-documentada", QA_75],
  ["gestao-processos-iso-9001-2026-requisito-4-4", QA_44],
  ["exemplos-mapeamento-de-processos-iso-9001", QA_EXEMPLOS],
  ["quanto-custa-iso-27001", QA_QUANTO_27001],
]) {
  patch(slug, block, { before: "<h2" });
}

console.log("Lote DEO build ok");
