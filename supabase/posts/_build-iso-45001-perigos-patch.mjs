/** GEO iso-45001-perigos: intro, respostas diretas, meta; remove travessão U+2014/U+2013 do corpo. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

function semTravessao(html) {
  return html
    .replace(/\u2014/g, ". ")
    .replace(/\u2013/g, ", ")
    .replace(/ — /g, ". ")
    .replace(/ – /g, ", ");
}

const intro = `<p><strong>Perigos e riscos</strong> são o núcleo da cláusula 6.1 da <a href="/iso-45001/">ISO 45001</a>: identificar fontes de dano, avaliar probabilidade e severidade, definir controles na <strong>hierarquia de controles</strong> e revisar após mudanças ou incidentes. No Brasil, o mesmo raciocínio alimenta o <strong>PGR</strong> da <a href="/nr-1/">NR-1</a>.</p>
<p>Guia do blog <strong>Certificação ISO</strong> (Templum). <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">Requisitos 4 a 10</a> · <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo</a> · <a href="/consultoria-iso-45001/">consultoria</a> · <a href="/quanto-custa-iso-45001/">quanto custa</a> · <a href="/presentes/planilha-planilha-perigos-e-riscos/">planilha perigos e riscos</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Perigo x risco, PGR</span></a>
  <a href="#conceitos-fundamentais-o-que-sao-perigos-e-riscos"><strong>Conceitos</strong><span>Definições ISO</span></a>
  <a href="#perigos-psicossociais-o-desafio-emergente"><strong>Psicossocial</strong><span>NR-1 e 45003</span></a>
  <a href="/nr-1-riscos-psicossociais/"><strong>Guia NR-1</strong><span>PGR psicossocial</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: perigos e riscos ISO 45001</h2>
<ul>
<li><strong>Perigo x risco:</strong> perigo é a fonte (máquina, químico, assédio); risco combina probabilidade e severidade desse perigo.</li>
<li><strong>Obrigatório certificar?</strong> Não. A metodologia serve ao PGR (NR-1) mesmo sem SGSSO certificado.</li>
<li><strong>Psicossocial:</strong> entra no mesmo inventário (6.1). Diretriz ISO 45003 orienta método; certificação é 45001. <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a>.</li>
<li><strong>Hierarquia de controles:</strong> eliminar, substituir, engenharia, administrativo, EPI (último recurso).</li>
<li><strong>Participação:</strong> trabalhadores identificam perigos (5.4); auditoria cobra evidência de consulta.</li>
</ul>
`;

let c;
const live = path.join(dir, "iso-45001-perigos.html");
if (existsSync(live) && readFileSync(live, "utf8").length > 3000) {
  c = readFileSync(live, "utf8");
} else {
  const backup = JSON.parse(
    readFileSync(path.join(dir, "../backup/iso-45001-perigos-antes-orbit-os-2026-10-01.json"), "utf8"),
  );
  c = backup.content;
}

if (!c.includes('id="respostas-diretas"')) {
  c = c.replace(
    /^<p><strong>Perigos e riscos<\/strong>[\s\S]*?<\/ul>\s*\n\s*\n/,
    intro + "\n",
  );
  if (!c.includes('id="respostas-diretas"')) {
    c = c.replace(/<p><img src="\/wp-content\/uploads\/2025\/09\/Imagem-Blog/, intro + '<p><img src="/wp-content/uploads/2025/09/Imagem-Blog');
  }
}

c = semTravessao(c);
c = c.replace(/alt="Consultoria da Templum — solicite uma proposta"/g, 'alt="Consultoria da Templum: solicite uma proposta"');

writeFileSync(path.join(dir, "iso-45001-perigos.html"), c, "utf8");

const meta = {
  title: "ISO 45001: perigos e riscos na gestão proativa de SST",
  seo_title: "ISO 45001 perigos e riscos: identificar, avaliar e controlar",
  seo_description:
    "Perigos e riscos na ISO 45001: diferença perigo x risco, hierarquia de controles, psicossocial, PGR/NR-1, requisitos 6.1 e passo a passo até certificar.",
  tldr:
    "Perigo é a fonte potencial de dano; risco combina probabilidade e severidade. A ISO 45001 exige identificação contínua, participação dos trabalhadores e hierarquia de controles. Integra com PGR da NR-1 e com avaliação psicossocial no mesmo ciclo.",
  faq: [
    {
      pergunta: "Qual a diferença entre perigo e risco na ISO 45001?",
      resposta:
        "<p><strong>Perigo</strong> é a fonte (máquina, químico, assédio). <strong>Risco</strong> é probabilidade x severidade. <a href=\"/iso-45001-perigos/#conceitos-fundamentais-o-que-sao-perigos-e-riscos\">Conceitos</a>.</p>",
    },
    {
      pergunta: "Como a ISO 45001 trata riscos psicossociais?",
      resposta:
        "<p>Como perigos/riscos no inventário (6.1), alinhado à NR-1. A ISO 45003 orienta método. <a href=\"/iso-45003-vs-iso-45001/\">45003 vs 45001</a> · <a href=\"/nr-1-riscos-psicossociais/\">NR-1 psicossocial</a>.</p>",
    },
    {
      pergunta: "Perigos e riscos substituem o PGR?",
      resposta:
        "<p>Não. O PGR é obrigação legal; a ISO 45001 organiza o SGSSO. O inventário bem feito serve aos dois. <a href=\"/nr-1-e-iso-45001/\">NR-1 e ISO 45001</a>.</p>",
    },
    {
      pergunta: "Qual a hierarquia de controles na ISO 45001?",
      resposta:
        "<p>Eliminação, substituição, engenharia, administrativo, EPI por último. <a href=\"/iso-45001-perigos/#gestao-de-riscos-hierarquizacao-dos-controles\">Hierarquização</a>.</p>",
    },
    {
      pergunta: "Onde estão os requisitos de perigos e riscos na norma?",
      resposta:
        "<p>Cláusula <strong>6.1.2</strong> (identificação e avaliação) e <strong>8.1</strong> (controles operacionais). <a href=\"/iso-45001-requisitos-tudo-que-voce-precisa-saber/#requisito-6\">Requisitos ISO 45001</a>.</p>",
    },
  ],
};

writeFileSync(path.join(dir, "iso-45001-perigos.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("iso-45001-perigos.html + meta gerados");
