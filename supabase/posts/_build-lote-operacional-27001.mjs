/** Lote out/2026: 7.5 GEO, gestão processos 4.4, quanto-custa-27001, links certificação. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

function insertAfterToc(body, block) {
  const introEnd = body.indexOf("<p><strong>Neste artigo:</strong></p>");
  if (introEnd >= 0) {
    const closeUl = body.indexOf("</ul>", introEnd);
    if (closeUl >= 0) {
      const end = closeUl + "</ul>".length;
      return body.slice(0, end) + "\n\n" + block + body.slice(end);
    }
  }
  const idx = body.indexOf("<h2");
  if (idx < 0) return null;
  return body.slice(0, idx) + block + "\n" + body.slice(idx);
}

function insertBeforeFirstH2(body, block) {
  const idx = body.indexOf("<h2");
  if (idx < 0) return body + "\n" + block;
  return body.slice(0, idx) + block + "\n" + body.slice(idx);
}

const GEO_75 = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>GED, 7.5, SGQ</span></a>
  <a href="#753"><strong>Controle 7.5.3</strong><span>Versão vigente</span></a>
  <a href="/controle-de-documentos/"><strong>Lista mestra</strong><span>Prática</span></a>
  <a href="/instrucao-de-trabalho-it/"><strong>IT e POP</strong></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: gestão de documentos e ISO 9001 (7.5)</h2>
<ul>
<li><strong>Gestão de documentos no SGQ:</strong> controlar versão, aprovação, disponibilidade no posto, retenção e descarte (7.5). Não é só GED ou pasta organizada.</li>
<li><strong>Documentos digitais e físicos:</strong> os dois entram no mesmo critério; papel exige cópia controlada quando impresso na operação.</li>
<li><strong>GED / software:</strong> válido se houver trilha de versão, permissão e evidência de aprovação; auditor testa na operação, não no demo do sistema.</li>
<li><strong>Protocolo e arquivamento:</strong> código, título, versão, função aprovadora, local de acesso e prazo na lista mestra ou equivalente.</li>
<li><strong>Documentos externos:</strong> norma ISO vigente, legislação e especificações do cliente precisam de edição controlada.</li>
<li><strong>Manter x reter:</strong> manter orienta o trabalho; reter prova que foi feito, protegida contra alteração indevida.</li>
</ul>

`;

function patch75() {
  const slug = "iso-9001-requisitos-7-5-informacao-documentada";
  const p = path.join(dir, `${slug}.html`);
  let body = readFileSync(p, "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const intro = `<p><strong>Gestão de documentos</strong> na ISO 9001 vive no requisito <strong>7.5</strong> (informação documentada): o que registrar, em qual versão, onde fica disponível e como proteger registros. Guia Certificação ISO · <a href="/controle-de-documentos/">controle na prática</a> · <a href="/iso-9001/">ISO 9001</a>.</p>\n<p><strong>Neste artigo:</strong></p>\n<ul>\n<li><a href="#751">7.5.1 Generalidades</a></li>\n<li><a href="#752">7.5.2 Criar e atualizar</a></li>\n<li><a href="#753">7.5.3 Controle</a></li>\n<li><a href="#erros">Erros frequentes</a></li>\n<li><a href="#enxuto">Sistema enxuto</a></li>\n</ul>\n\n`;
  if (!body.includes("Neste artigo")) body = intro + body;
  body = insertBeforeFirstH2(body, GEO_75);
  writeFileSync(p, body, "utf8");
  console.log(`${slug} GEO ok`);
}

const GESTAO_GEO = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>BPM, 4.4</span></a>
  <a href="#requisito-4-4"><strong>Requisito 4.4</strong></a>
  <a href="/mapeamento-de-processos-e-a-iso-9001/"><strong>Mapeamento</strong></a>
  <a href="/exemplos-mapeamento-de-processos-iso-9001/"><strong>Exemplos</strong></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: gestão de processos (ISO 9001)</h2>
<ul>
<li><strong>Gestão de processos:</strong> definir, operar, medir e melhorar fluxos que entregam valor (requisito 4.4).</li>
<li><strong>Gestão de processos de negócio (BPM):</strong> ciclo de modelar, automatizar, monitorar e otimizar; comum em software BPM, mas a norma exige evidência, não ferramenta específica.</li>
<li><strong>Gestão de processos x gestão por processos:</strong> “de processos” mantém cada fluxo; “por processos” organiza a empresa em torno deles. A ISO 9001 exige abordagem por processos no 4.4.</li>
<li><strong>Melhoria contínua:</strong> mapa revisado após NC, auditoria interna ou mudança de estratégia (10.3).</li>
<li><strong>Mapear não é IT:</strong> anotar passo a passo de uma pessoa gera instrução de trabalho; mapa começa da operação que serve a estratégia.</li>
</ul>

`;

function buildGestaoProcessos() {
  const draft = JSON.parse(
    readFileSync(path.join(dir, "_draft-gestao-processos-4-4.json"), "utf8")
  );
  const slug = draft.slug;
  const p = path.join(dir, `${slug}.html`);
  if (existsSync(p) && readFileSync(p, "utf8").includes("post-portas")) {
    console.log(`${slug} já existe`);
    return;
  }
  const head = `<p>${draft.excerpt}</p>\n<p>Guia Certificação ISO · <a href="/iso-9001/">ISO 9001:2026</a> · <a href="/mapeamento-de-processos-e-a-iso-9001/">mapeamento (4.4)</a> · <a href="/exemplos-mapeamento-de-processos-iso-9001/">exemplos de mapa</a>.</p>\n<p><strong>Neste artigo:</strong></p>\n<ul>\n<li><a href="#nao-e-instrucao">Mapa x instrução de trabalho</a></li>\n<li><a href="#operacao-serve-estrategia">Operação e estratégia</a></li>\n<li><a href="#requisito-4-4">Requisito 4.4</a></li>\n<li><a href="#tartaruga">Tartaruga antes do diagrama</a></li>\n<li><a href="#checklist">Checklist do mapa</a></li>\n</ul>\n\n`;
  let body = head + GESTAO_GEO + draft.content;
  writeFileSync(p, body, "utf8");
  const meta = {
    title: draft.title,
    seo_title: draft.seo_title,
    seo_description: draft.seo_description,
    tldr: draft.tldr,
    tags: draft.tags,
    faq: draft.faq,
    published_at: "2026-10-12T16:00:00.000Z",
  };
  writeFileSync(path.join(dir, `${slug}.meta.json`), JSON.stringify(meta, null, 2), "utf8");
  console.log(`${slug} html+meta ok`);
}

const QUANTO_27001 = `<p><strong>Quanto custa a ISO 27001?</strong> Não existe tabela única válida para todo o Brasil. A conta separa <strong>implantação do SGSI</strong> (equipe interna ou consultoria), <strong>auditoria do organismo certificador</strong> (dias de auditoria conforme ISO/IEC 27006-1, contrato à parte) e <strong>manutenção</strong> no ciclo de três anos. Pessoas no escopo, sites, criticidade da informação e maturidade de controles mudam o total.</p>
<p>Guia do blog <strong>Certificação ISO</strong>, da <a href="https://templum.com.br/consultoria/iso-27001/"><strong>Templum Consultoria</strong></a>. Norma: <a href="/iso-27001/">ISO 27001</a> · certificação: <a href="/certificacao-iso-27001-etapas-prazo-custo/">etapas, prazo e custo</a> · implementar: <a href="/como-implementar-a-iso-27001/">passo a passo</a> · consultoria: <a href="/consultoria-iso-27001/">consultoria ISO 27001</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Consultoria, organismo</span></a>
  <a href="#duas-contas"><strong>Duas contas</strong><span>Implantação x certificação</span></a>
  <a href="#o-que-encarece"><strong>O que encarece</strong><span>Escopo, sites</span></a>
  <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo"><strong>27006-1</strong><span>Dias de auditoria</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: quanto custa a ISO 27001</h2>
<ul>
<li><strong>Não há preço fixo nacional:</strong> organismo cobra por <strong>dias de auditoria</strong> (27006-1); consultoria cobra por escopo, sites e método (remoto/presencial).</li>
<li><strong>Consultoria ISO 27001:</strong> diagnóstico, riscos, SoA, controles operando, auditoria interna e preparação para estágios 1 e 2. Não emite certificado.</li>
<li><strong>Organismo certificador:</strong> auditoria inicial (estágios 1 e 2) + surveillance anual + recertificação no terceiro ano.</li>
<li><strong>Certificação iso 27001 preço:</strong> some implantação + ciclo de 3 anos de auditorias; proposta só do ano 1 esconde metade da conta.</li>
<li><strong>Prazo típico:</strong> cerca de <strong>6 a 12 meses</strong> até certificar em PME, se controles operarem com registro.</li>
<li><strong>27701:</strong> SGPI é orçamento à parte; pode integrar ao SGSI. <a href="/quanto-custa-iso-27701/">Quanto custa ISO 27701</a>.</li>
</ul>

<h2 id="duas-contas">Implantação e auditoria: duas contas separadas</h2>
<p>Quem implanta não certifica a mesma empresa no mesmo ciclo. Orçamento completo inclui as linhas abaixo.</p>
<table>
<thead><tr><th>Conta</th><th>O que é</th><th>O que pesa no valor</th></tr></thead>
<tbody>
<tr><td>Implantação do SGSI</td><td>Consultoria e/ou horas internas: escopo, riscos, SoA, controles, conscientização, auditoria interna</td><td>Sites, nuvem, desenvolvimento in-house, SoA ampla, integração 27701, remoto vs. presencial</td></tr>
<tr><td>Auditoria de certificação</td><td>Paga ao organismo acreditado (Inmetro/IAF)</td><td>Pessoas no escopo, multiunidade, criticidade, deslocamento, idioma</td></tr>
<tr><td>Manutenção (3 anos)</td><td>Surveillance e recertificação</td><td>Mudanças de escopo, NCs na certificação inicial, novos serviços críticos</td></tr>
</tbody>
</table>
<p>Detalhe normativo dos dias: <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">custo e 27006-1</a>. Comparar propostas: <a href="/como-escolher-consultoria-iso/">como escolher consultoria ISO</a>.</p>

<h2 id="o-que-encarece">O que encarece a ISO 27001 na prática</h2>
<ul>
<li><strong>Escopo largo demais</strong> (empresa inteira quando o cliente exige só um serviço).</li>
<li><strong>Várias unidades</strong> com processos distintos (amostragem limitada).</li>
<li><strong>Dados sensíveis, financeiros ou regulados</strong> no escopo.</li>
<li><strong>SoA inflada</strong> sem operação: retrabalho na fase 2.</li>
<li><strong>Zero histórico de operação</strong> de controles (logs, incidentes, backup testado).</li>
<li><strong>Certificar junto com ISO 27701:</strong> duas linhas de projeto; integração pode economizar documento.</li>
</ul>

<h2 id="orcamento">Como montar orçamento comparável</h2>
<ol>
<li>Definir <strong>escopo SGSI</strong> (pessoas, sites, serviços).</li>
<li>Separar proposta de <strong>consultoria</strong> e do <strong>organismo</strong> (ciclo de 3 anos).</li>
<li>Perguntar dias de auditoria estimados e premissas (27006-1).</li>
<li>Confirmar entregáveis: riscos, SoA, auditoria interna, simulação de incidente.</li>
</ol>
<p><a href="https://templum.com.br/consultoria/iso-27001/">Solicitar proposta Templum</a> · <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a> · <a href="/iso-27001/">Hub ISO 27001</a></p>
`;

function buildQuanto27001() {
  const slug = "quanto-custa-iso-27001";
  const hp = path.join(dir, `${slug}.html`);
  if (!existsSync(hp)) {
    writeFileSync(hp, QUANTO_27001, "utf8");
    const meta = {
      title: "Quanto custa a ISO 27001: consultoria, certificação e SGSI",
      seo_title: "Quanto custa a ISO 27001: consultoria e certificação (27006-1)",
      seo_description:
        "Quanto custa ISO 27001: implantação do SGSI, consultoria, auditoria do organismo à parte e manutenção em 3 anos. O que encarece escopo, sites e SoA.",
      tldr:
        "O custo da ISO 27001 soma implantação (consultoria e/ou equipe interna), auditoria do organismo (dias conforme 27006-1) e manutenções no ciclo de três anos. Consultoria e certificadora são contratos separados.",
      tags: ["ISO 27001", "custo", "consultoria", "certificação", "SGSI", "27006-1"],
      published_at: "2026-10-12T16:00:00.000Z",
      faq: [
        {
          pergunta: "Quanto custa implementar a ISO 27001?",
          resposta:
            "<p>Não há tabela única. Inclui implantação do SGSI e auditoria do organismo por dias de auditoria, mais manutenção anual e recertificação.</p><p><a href=\"#duas-contas\">Duas contas</a>.</p>",
        },
        {
          pergunta: "Qual o preço da certificação ISO 27001?",
          resposta:
            "<p>O organismo cobra por dias (ISO/IEC 27006-1), conforme pessoas no escopo, sites e complexidade. Peça orçamento do ciclo de 3 anos.</p>",
        },
        {
          pergunta: "Consultoria e certificação ISO 27001 são cobradas juntas?",
          resposta: "<p>Não. Quem consulta não pode certificar a mesma empresa no mesmo ciclo.</p>",
        },
      ],
    };
    writeFileSync(path.join(dir, `${slug}.meta.json`), JSON.stringify(meta, null, 2), "utf8");
    console.log(`${slug} criado`);
  } else console.log(`${slug} já existe`);
}

function patchCertificacao27001Link() {
  const slug = "certificacao-iso-27001-etapas-prazo-custo";
  const p = path.join(dir, `${slug}.html`);
  let body = readFileSync(p, "utf8");
  body = body.replace(
    /<li><strong>Preço certificação iso 27001:<\/strong>[\s\S]*?<\/li>\n<li><strong>27701 \(privacidade\):<\/strong> SGPI pode ser certificado[\s\S]*?<\/li>\n/,
    `<li><strong>Preço certificação iso 27001:</strong> sem tabela única; organismo cobra por dias (27006-1) e implantação soma horas internas e consultoria. Página dedicada: <a href="/quanto-custa-iso-27001/">quanto custa ISO 27001</a>. <a href="#custo">Detalhe neste artigo</a>.</li>\n<li><strong>27701 (privacidade):</strong> SGPI pode ser certificado <strong>sem</strong> 27001 desde 2025; integrar reduz retrabalho. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">Hub ISO 27701</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação 27701</a> · <a href="/quanto-custa-iso-27701/">custo 27701</a>.</li>\n`
  );
  writeFileSync(p, body, "utf8");
  console.log("certificacao-iso-27001 link quanto-custa ok");
}

patch75();
buildGestaoProcessos();
buildQuanto27001();
patchCertificacao27001Link();
console.log("Lote operacional + 27001 concluído.");
