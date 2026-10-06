/** GEO ohsas-18001-e-iso-45001: respostas diretas, cluster 45001, FAQ. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const exportPath = path.join(dir, "../backup/ohsas-18001-e-iso-45001-export-2026-10-06.json");
const row = JSON.parse(readFileSync(exportPath, "utf8"));

const geo = `
<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>OHSAS, ISO 18001, validade</span></a>
  <a href="#comparativo"><strong>Comparativo</strong><span>OHSAS x 45001</span></a>
  <a href="#o-que-fazer-agora"><strong>Migrar</strong><span>Próximos passos</span></a>
  <a href="/passo-a-passo-certificacao-iso-45001/"><strong>Certificar</strong><span>Passo a passo</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: OHSAS 18001 e ISO 45001</h2>
<ul>
<li><strong>OHSAS 18001 ainda vale?</strong> Não. Cancelada em <strong>março de 2021</strong>; certificados expiraram.</li>
<li><strong>ISO 18001 existe?</strong> Não para SST. Quem busca “ISO 18001” quase sempre queria a OHSAS; sucessor é <a href="/iso-45001/">ISO 45001:2018</a>.</li>
<li><strong>ISO 45003 substitui 45001?</strong> Não. 45003 é diretriz psicossocial; certificável é 45001. <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a>.</li>
<li><strong>Migração:</strong> gap analysis, ajuste do SGSSO, auditoria interna, certificação ISO 45001. <a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo</a>.</li>
<li><strong>NR-1:</strong> ISO 45001 não substitui PGR; complementa. <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a>.</li>
</ul>
`;

let c = row.content;
if (!c.includes('id="respostas-diretas"')) {
  c = c.replace(
    /<p>Este guia responde[\s\S]*?<\/p>\n/,
    (m) => m + geo + "\n",
  );
}

const aprofunde = `<h2 id="aprofunde"><strong>Aprofunde</strong></h2>
<ul>
<li><a href="/iso-45001/">ISO 45001: o que é, requisitos e como certificar</a></li>
<li><a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">Requisitos ISO 45001 (cláusulas 4 a 10)</a></li>
<li><a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo certificação ISO 45001</a></li>
<li><a href="/quanto-custa-iso-45001/">Quanto custa a ISO 45001</a></li>
<li><a href="/consultoria-iso-45001/">Consultoria ISO 45001</a></li>
<li><a href="/iso-45001-cliente-edital-exige-certificado/">Cliente ou edital exige ISO 45001</a></li>
<li><a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a></li>
<li><a href="/iso-45001-perigos/">Perigos e riscos ISO 45001</a></li>
<li><a href="/perigos-e-riscos-na-ohsas-18001/">Perigos e riscos (lógica herdada da OHSAS)</a></li>
</ul>
<p><a href="https://templum.com.br/consultoria/iso-45001/">Consultoria Templum ISO 45001</a> · <a href="/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=ohsas-18001-e-iso-45001&amp;norma=ISO%2045001">Diagnóstico gratuito</a></p>`;

c = c.replace(/<h2 id="aprofunde">[\s\S]*?<\/ul>\s*<p><a href="https:\/\/templum\.com\.br\/iso-45001\/">[\s\S]*?<\/p>\s*$/m, aprofunde);

writeFileSync(path.join(dir, "ohsas-18001-e-iso-45001.html"), c, "utf8");

const meta = {
  title: row.title,
  seo_title: row.seo_title,
  seo_description:
    "OHSAS 18001 cancelada em 2021. Diferenças para ISO 45001, mito da ISO 18001, migração, passo a passo, custo e NR-1/PGR.",
  tldr: row.tldr,
  faq: [
    ...row.faq,
    {
      pergunta: "Como certificar na ISO 45001 depois da OHSAS?",
      resposta:
        "<p>Gap para cláusulas 4 a 10, operação do SGSSO, auditoria interna e organismo acreditado. <a href=\"/passo-a-passo-certificacao-iso-45001/\">Passo a passo ISO 45001</a>.</p>",
    },
    {
      pergunta: "Quanto custa migrar de OHSAS para ISO 45001?",
      resposta:
        "<p>Depende do que já existe do sistema antigo. Contas: consultoria + organismo. <a href=\"/quanto-custa-iso-45001/\">Quanto custa a ISO 45001</a>.</p>",
    },
  ],
};

writeFileSync(path.join(dir, "ohsas-18001-e-iso-45001.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("ohsas-18001-e-iso-45001.html + meta gerados");
