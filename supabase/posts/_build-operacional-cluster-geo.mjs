/** GEO cluster operacional (mapeamento, documentos, ferramentas) — prompts Semrush BR. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

function insertAfterToc(body, block) {
  const introEnd = body.indexOf("<p><strong>Neste artigo:</strong></p>");
  if (introEnd < 0) return null;
  const closeUl = body.indexOf("</ul>", introEnd);
  if (closeUl < 0) return null;
  const end = closeUl + "</ul>".length;
  return body.slice(0, end) + "\n\n" + block + body.slice(end);
}

function insertBeforeFirstH2(body, block) {
  const idx = body.indexOf("<h2");
  if (idx < 0) return null;
  return body.slice(0, idx) + block + "\n" + body.slice(idx);
}

function patchFile(slug, mutator) {
  const p = path.join(dir, `${slug}.html`);
  if (!existsSync(p)) {
    console.warn(`skip ${slug}: sem html`);
    return;
  }
  let body = readFileSync(p, "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  body = mutator(body);
  if (!body) throw new Error(`${slug}: patch falhou`);
  writeFileSync(p, body, "utf8");
  console.log(`${slug} GEO ok`);
}

const MAPEAMENTO_GEO = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Passo a passo, ferramentas</span></a>
  <a href="/exemplos-mapeamento-de-processos-iso-9001/#banco-exemplos"><strong>Exemplos</strong><span>Padaria, CP, RH</span></a>
  <a href="#requisito-4-4"><strong>ISO 4.4</strong><span>O que auditar</span></a>
  <a href="/o-que-e-fluxograma-de-processos/"><strong>Fluxograma</strong><span>Símbolos</span></a>
  <a href="/iso-9001/"><strong>Hub ISO 9001</strong></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: mapeamento de processos e ISO 9001</h2>
<ul>
<li><strong>Para que serve:</strong> tornar visível entradas, saídas, sequência, responsáveis e gargalos antes de virar não conformidade. Atende o <a href="#requisito-4-4">requisito 4.4</a>.</li>
<li><strong>Passo a passo:</strong> escolher um processo, definir início e fim, listar etapas, responsáveis, entradas/saídas, desenhar fluxo, validar com quem executa, publicar versão controlada. Detalhe: <a href="/exemplos-mapeamento-de-processos-iso-9001/#passo-a-passo">7 passos</a>.</li>
<li><strong>Como mapear um processo:</strong> observe a operação real (gemba), não só o que está no papel; mapa de alto nível primeiro, detalhe depois em <a href="/instrucao-de-trabalho-it/">instrução de trabalho</a>.</li>
<li><strong>Ferramentas:</strong> fluxograma em papel, planilha, Lucidchart, Miro, Draw.io ou ERP com BPM. A norma exige <strong>controle</strong> da informação (7.5), não um software específico.</li>
<li><strong>Exemplos por setor:</strong> contas a pagar, padaria, vendas, RH, produção. <a href="/exemplos-mapeamento-de-processos-iso-9001/#banco-exemplos">Banco de exemplos</a>.</li>
<li><strong>IA:</strong> pode acelerar rascunho de fluxo; validação humana e versão aprovada continuam obrigatórias para auditoria.</li>
</ul>

`;

const FLUXOGRAMA_GEO = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Definição, passos</span></a>
  <a href="#ferramentas"><strong>Ferramentas</strong><span>Desenhar mapa</span></a>
  <a href="/mapeamento-de-processos-e-a-iso-9001/"><strong>Mapeamento ISO</strong><span>Requisito 4.4</span></a>
  <a href="/exemplos-mapeamento-de-processos-iso-9001/"><strong>Exemplos</strong></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: fluxograma de processo</h2>
<ul>
<li><strong>O que é:</strong> desenho da sequência de atividades, decisões, entradas, saídas e responsáveis. É a forma mais comum de <strong>mapear</strong> um processo.</li>
<li><strong>Passo a passo:</strong> delimitar processo, identificar início/fim, listar etapas na ordem, marcar decisões (losango), atribuir donos, revisar com executores, versionar. <a href="#passo-a-passo">Passo a passo completo</a>.</li>
<li><strong>Modelo:</strong> use símbolos consistentes e legenda; evite mapa gigante: quebre subprocessos. <a href="/exemplos-mapeamento-de-processos-iso-9001/#modelo-excel">Modelo em planilha</a>.</li>
<li><strong>ISO 9001:</strong> fluxograma apoia 4.4 e documentação 7.5; não substitui registro de conformidade (9.1, 10.2).</li>
</ul>

`;

const DOCUMENTOS_GEO = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>SGQ vs GED</span></a>
  <a href="#lista-mestra"><strong>Lista mestra</strong><span>Controle 7.5</span></a>
  <a href="/iso-9001-requisitos-7-5-informacao-documentada/"><strong>Requisito 7.5</strong></a>
  <a href="/instrucao-de-trabalho-it/"><strong>IT e POP</strong></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: gestão de documentos na ISO 9001</h2>
<ul>
<li><strong>Gestão de documentos no SGQ:</strong> garantir versão vigente, aprovação, disponibilidade no posto de trabalho, retenção e recolhimento quando muda (requisito <strong>7.5</strong>). Não confundir com “organizar pastas”.</li>
<li><strong>GED / software:</strong> ferramenta ajuda se tiver trilha de aprovação, controle de versão e permissão; o auditor cobra <strong>evidência</strong>, não marca de sistema.</li>
<li><strong>Documentos digitais e físicos:</strong> ambos entram no mesmo critério de controle; papel exige <a href="/copias-controladas-copias-nao-controladas-em-sistema-de-gestao-como-agir/">cópia controlada</a>.</li>
<li><strong>Protocolo e arquivamento:</strong> código, título, versão, aprovador (função), local de acesso e prazo na lista mestra. <a href="#lista-mestra">Modelo de lista</a>.</li>
<li><strong>LGPD:</strong> dados pessoais em documentos exigem regras de acesso e retenção alinhadas à política de privacidade; SGQ sozinho não cobre tudo.</li>
</ul>

`;

patchFile("mapeamento-de-processos-e-a-iso-9001", (body) => {
  let b = body;
  if (!b.includes("exemplos-mapeamento-de-processos")) {
    b = b.replace(
      "</ul>",
      `<li><a href="/exemplos-mapeamento-de-processos-iso-9001/">Banco de exemplos de mapeamento</a></li>\n</ul>`,
      1
    );
  }
  const next = insertAfterToc(b, MAPEAMENTO_GEO);
  return next || insertBeforeFirstH2(b, MAPEAMENTO_GEO);
});

patchFile("o-que-e-fluxograma-de-processos", (body) => {
  const next = insertAfterToc(body, FLUXOGRAMA_GEO);
  return next || insertBeforeFirstH2(body, FLUXOGRAMA_GEO);
});

patchFile("controle-de-documentos", (body) =>
  insertBeforeFirstH2(body, DOCUMENTOS_GEO)
);

console.log("Operacional cluster GEO build concluído.");
