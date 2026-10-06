/** Prepends GEO intro to iso-45001-perigos from backup */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const backup = JSON.parse(
  readFileSync(path.join(dir, "../backup/iso-45001-perigos-antes-orbit-os-2026-10-01.json"), "utf8"),
);

const prepend = `<p><strong>Perigos e riscos</strong> são o núcleo da cláusula 6.1 da <a href="/iso-45001/">ISO 45001</a>: identificar fontes de dano, avaliar probabilidade e severidade, definir controles na <strong>hierarquia de controles</strong> e revisar após mudanças ou incidentes. No Brasil, o mesmo raciocínio alimenta o <strong>PGR</strong> da <a href="/nr-1/">NR-1</a>.</p>
<p>Guia do blog Certificação ISO (Templum). Passos até certificar: <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo ISO 45001</a> · Consultoria: <a href="/consultoria-iso-45001/">consultoria ISO 45001</a> · Psicossocial: <a href="/iso-45003-vs-iso-45001/">ISO 45003 vs 45001</a> · Planilha: <a href="/presentes/planilha-planilha-perigos-e-riscos/">planilha perigos e riscos</a>.</p>
`;

let c = backup.content;
if (!c.includes("passo-a-passo-certificacao-iso-45001")) {
  c = c.replace(/<p><img src="\/wp-content\/uploads\/2025\/09\/Imagem-Blog/, prepend + '<p><img src="/wp-content/uploads/2025/09/Imagem-Blog');
}

writeFileSync(path.join(dir, "iso-45001-perigos.html"), c, "utf8");

const meta = {
  title: "ISO 45001: perigos e riscos na gestão proativa de SST",
  seo_title: "ISO 45001 perigos e riscos: identificar, avaliar e controlar",
  seo_description:
    "Perigos e riscos na ISO 45001: conceitos, hierarquia de controles, psicossocial, PGR/NR-1 e passo a passo até certificar.",
  tldr:
    "Perigo é a fonte potencial de dano; risco combina probabilidade e severidade. A ISO 45001 exige processo contínuo de identificação e avaliação, participação dos trabalhadores e hierarquia de controles. Integra com PGR da NR-1.",
  faq: [
    {
      pergunta: "Qual a diferença entre perigo e risco na ISO 45001?",
      resposta:
        "<p><strong>Perigo</strong> é a fonte (máquina, químico, assédio). <strong>Risco</strong> é a combinação de probabilidade e severidade desse perigo. Seção <a href=\"/iso-45001-perigos/#conceitos-fundamentais-o-que-sao-perigos-e-riscos\">conceitos</a>.</p>",
    },
    {
      pergunta: "Como a ISO 45001 trata riscos psicossociais?",
      resposta:
        "<p>Como perigos/riscos de SST, no inventário e plano. A ISO 45003 detalha método. <a href=\"/iso-45003-vs-iso-45001/\">45003 vs 45001</a>.</p>",
    },
  ],
};

writeFileSync(path.join(dir, "iso-45001-perigos.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("iso-45001-perigos.html + meta gerados");
