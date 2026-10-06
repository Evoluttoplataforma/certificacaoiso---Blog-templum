/** GEO hub /nr-1/: respostas diretas, cluster ISO 45001 e psicossocial. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const row = JSON.parse(readFileSync(path.join(dir, "../backup/nr-1-export-2026-10-06.json"), "utf8"));

function semTravessao(html) {
  return html
    .replace(/\u2014/g, ". ")
    .replace(/\u2013/g, ", ")
    .replace(/ — /g, ". ")
    .replace(/ —/g, ". ")
    .replace(/ – /g, ", ")
    .replace(/" \.  /g, '": ')
    .replace(/ \.  /g, ". ")
    .replace(/\.  +/g, ". ");
}

const head = `<p><strong>A NR-1</strong> organiza o gerenciamento de riscos ocupacionais (GRO) e o <strong>PGR</strong> para empresas com empregados CLT. Desde 2024, fatores <strong>psicossociais</strong> entram no inventário nos mesmos moldes dos demais riscos; fiscalização punitiva referente à redação vigente desde <strong>26 de maio de 2026</strong>.</p>
<p>Guia do blog <strong>Certificação ISO</strong> (Templum). Psicossocial: <a href="/nr-1-riscos-psicossociais/">NR-1 e riscos psicossociais</a> · SGSSO: <a href="/iso-45001/">ISO 45001</a> · <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a> · <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo certificação</a> · <a href="/quanto-custa-iso-45001/">quanto custa</a> · <a href="/iso-45001-cliente-edital-exige-certificado/">cliente ou edital exige ISO 45001</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>PGR, psicossocial, 45001</span></a>
  <a href="#gro-pgr"><strong>GRO e PGR</strong><span>Inventário e plano</span></a>
  <a href="#psicossociais"><strong>Psicossocial</strong><span>Item 1.5.3.2.1</span></a>
  <a href="/nr-1-riscos-psicossociais/"><strong>Guia completo</strong><span>Psicossocial no PGR</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: NR-1</h2>
<ul>
<li><strong>Quem precisa cumprir?</strong> Empregadores com empregados CLT (item 1.2.1). MEI/ME/EPP têm dispensa parcial de PGR, não da norma.</li>
<li><strong>O que é o PGR?</strong> Documento com inventário de riscos + plano de ação (item 1.5.7.1).</li>
<li><strong>Psicossocial é opcional?</strong> Não. Entra no inventário como os demais riscos. <a href="/nr-1-riscos-psicossociais/">Guia psicossocial</a>.</li>
<li><strong>ISO 45001 substitui NR-1?</strong> Não. Complementa; item 1.5.3.1.2 admite SGSSO. Certificação dá revisão do PGR a cada 3 anos (1.5.4.4.6.1). <a href="/nr-1-e-iso-45001/">Mapa NR-1 x 45001</a>.</li>
<li><strong>45003 vs 45001:</strong> 45003 orienta psicossocial; certificação é ISO 45001. <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a>.</li>
</ul>

`;

let c = row.content.trim();
if (!c.includes('id="respostas-diretas"')) {
  c = head + c;
}

c = c.replace(
  /<p><strong>Certificação ISO 45001:<\/strong>[\s\S]*?<\/p>\s*\n\s*\n<h2 id="para-que-serve">/,
  `<p><strong>Certificação ISO 45001:</strong> para estruturar SST além do PGR legal, veja <a href="/iso-45001/">guia ISO 45001</a>, <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">requisitos 4 a 10</a>, <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo</a>, <a href="/quanto-custa-iso-45001/">quanto custa</a>, <a href="/consultoria-iso-45001/">consultoria</a> e <a href="/iso-45003-vs-iso-45001/">ISO 45003 vs 45001</a>.</p>

<h2 id="para-que-serve">`,
);

c = semTravessao(c);

writeFileSync(path.join(dir, "nr-1.html"), c, "utf8");

const meta = {
  title: row.title,
  seo_title: row.seo_title,
  seo_description:
    "NR-1: GRO, PGR, psicossocial, ordem de serviço, capacitação e MEI/ME/EPP. Links para ISO 45001, passo a passo, custo e guia de riscos psicossociais.",
  tldr: row.tldr,
  faq: [
    ...row.faq,
    {
      pergunta: "Como a ISO 45001 ajuda no PGR e nos riscos psicossociais?",
      resposta:
        "<p>O SGSSO certificável usa a mesma lógica de inventário, controles e participação dos trabalhadores. Quem já tem 45001 estende o escopo psicossocial. <a href=\"/nr-1-e-iso-45001/\">NR-1 e ISO 45001</a> · <a href=\"/iso-45001-perigos/\">perigos e riscos</a>.</p>",
    },
    {
      pergunta: "Quanto custa certificar na ISO 45001 além do PGR?",
      resposta:
        "<p>Projeto à parte: consultoria de implantação + organismo certificador. <a href=\"/quanto-custa-iso-45001/\">Quanto custa a ISO 45001</a>.</p>",
    },
  ],
};

writeFileSync(path.join(dir, "nr-1.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("nr-1.html + meta gerados");
