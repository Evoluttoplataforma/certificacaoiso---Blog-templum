/** Prepend GEO + cluster 45001 em nr-1-riscos-psicossociais a partir do export Supabase. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const exportPath = path.join(dir, "../backup/nr-1-riscos-psicossociais-export-2026-10-06.json");
const row = JSON.parse(readFileSync(exportPath, "utf8"));

function semTravessao(html) {
  return html
    .replace(/\u2014/g, ". ")
    .replace(/\u2013/g, ", ")
    .replace(/ — /g, ". ")
    .replace(/ – /g, ", ");
}

const head = `<p><strong>Riscos psicossociais na NR-1</strong> entram no PGR nos mesmos moldes dos riscos físicos: identificação, avaliação, matriz, plano de ação e evidência. A fiscalização punitiva referente à redação de 2024 começou em <strong>26 de maio de 2026</strong>.</p>
<p>Guia do blog <strong>Certificação ISO</strong> (Templum). <a href="/nr-1/">NR-1</a> · <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a> · <a href="/iso-45003-vs-iso-45001/">ISO 45003 vs 45001</a> · <a href="/iso-45001-perigos/">perigos e riscos</a> · <a href="/consultoria-iso-45001/">consultoria ISO 45001</a> · <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo certificação</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Prazo, clima, 45001</span></a>
  <a href="#o-que-a-nr-1-passou-a-exigir"><strong>O que exige</strong><span>PGR e GRO</span></a>
  <a href="#como-aproveitar-o-que-voce-ja-tem"><strong>ISO 45001</strong><span>Estender o SGSSO</span></a>
  <a href="/quanto-custa-iso-45001/"><strong>Custo</strong><span>Certificar SGSSO</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: NR-1 e riscos psicossociais</h2>
<ul>
<li><strong>O que entra no PGR?</strong> Fatores psicossociais do trabalho (demanda, controle, esforço, recompensa, assédio, etc.), com instrumento validado, não pesquisa de clima genérica.</li>
<li><strong>Canal de denúncias basta?</strong> Não. É um elemento; falta inventário, matriz e plano de ação.</li>
<li><strong>ISO 45001 substitui NR-1?</strong> Não. A 45001 é SGSSO voluntário; NR-1 é lei. Quem tem 45001 estende o escopo. <a href="/nr-1-e-iso-45001/">Mapa NR-1 x cláusulas</a>.</li>
<li><strong>ISO 45003 é certificação?</strong> Não. Diretriz psicossocial; certificável é a <strong>ISO 45001</strong>. <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a>.</li>
<li><strong>Quanto custa certificar depois do PGR?</strong> Consultoria + organismo, contas separadas. <a href="/quanto-custa-iso-45001/">Quanto custa a ISO 45001</a>.</li>
</ul>
`;

let c = row.content.trim();
if (!c.includes('id="respostas-diretas"')) {
  c = head + "\n" + c.replace(/^<p>Se você está lendo/, "<p>Se você está lendo");
}
c = semTravessao(c);

writeFileSync(path.join(dir, "nr-1-riscos-psicossociais.html"), c, "utf8");

const meta = {
  title: row.title,
  seo_title: row.seo_title,
  seo_description:
    "NR-1 e riscos psicossociais no PGR: prazo, instrumentos validados, ISO 45001, 45003, custo e passo a passo para certificar SGSSO.",
  tldr: row.tldr,
  faq: [
    ...row.faq,
    {
      pergunta: "Riscos psicossociais entram na ISO 45001?",
      resposta:
        "<p>Sim, na cláusula 6.1 (perigos e riscos), no mesmo ciclo do PGR. <a href=\"/iso-45001-perigos/#perigos-psicossociais-o-desafio-emergente\">Perigos psicossociais</a> · <a href=\"/iso-45001-requisitos-tudo-que-voce-precisa-saber/#requisito-6\">Requisitos 6.1</a>.</p>",
    },
    {
      pergunta: "Como certificar na ISO 45001 após adequar o PGR?",
      resposta:
        "<p>Comprometimento, escopo, legal, controles, auditoria interna e organismo certificador. <a href=\"/passo-a-passo-certificacao-iso-45001/\">Passo a passo ISO 45001</a>.</p>",
    },
  ],
};

writeFileSync(path.join(dir, "nr-1-riscos-psicossociais.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("nr-1-riscos-psicossociais.html + meta gerados");
