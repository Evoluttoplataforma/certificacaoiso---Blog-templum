/** GEO nr-1-mei-microempresa-epp: portas, respostas, cluster, sem travessão. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const row = JSON.parse(
  readFileSync(path.join(dir, "../backup/nr-1-mei-microempresa-epp-export-2026-10-06.json"), "utf8"),
);

function semTravessao(html) {
  return html
    .replace(/\u2014/g, ". ")
    .replace(/\u2013/g, ", ")
    .replace(/ — /g, ". ")
    .replace(/ —/g, ". ")
    .replace(/ – /g, ", ")
    .replace(/ \.  /g, ". ")
    .replace(/\.  +/g, ". ");
}

const head = `<p><strong>MEI, microempresa e EPP</strong> têm <strong>tratamento diferenciado</strong> na <a href="/nr-1/">NR-1</a> (item 1.8): em hipóteses específicas, dispensam de <em>elaborar o PGR</em> ou o PCMSO. <strong>Não isentam</strong> de cumprir a norma (1.8.5).</p>
<p>Guia <strong>Certificação ISO</strong> (Templum). <a href="/nr-1-se-aplica-a-minha-empresa/">A NR-1 se aplica à minha empresa?</a> · <a href="/nr-1-riscos-psicossociais/">psicossocial no PGR</a> · <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a> · <a href="/passo-a-passo-certificacao-iso-45001/">certificar ISO 45001</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>PGR, PCMSO, 1.8</span></a>
  <a href="#mei"><strong>MEI</strong><span>1.8.1</span></a>
  <a href="#me-epp"><strong>ME e EPP</strong><span>Três condições</span></a>
  <a href="#teste"><strong>Teste rápido</strong><span>Grau de risco</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: MEI, ME e EPP</h2>
<ul>
<li><strong>MEI precisa de PGR?</strong> Não elaborar PGR (1.8.1). Demais NR continuam. Quem contrata MEI inclui-o no PGR nas dependências (1.8.1.1).</li>
<li><strong>ME/EPP dispensada de PGR?</strong> Só se grau 1 ou 2 (NR-4), levantamento sem agentes físico/químico/biológico (NR-9) <strong>e</strong> declaração digital (1.6.1). Tudo cumulativo (1.8.4).</li>
<li><strong>PCMSO:</strong> dispensa separada (1.8.6), inclui ergonômico. ASO e exames continuam (1.8.7.1).</li>
<li><strong>Psicossocial:</strong> quem não elabora PGR não formaliza no documento, mas NRs e passivo (nexo, FAP) permanecem. <a href="/nr-1-riscos-psicossociais/">Guia psicossocial</a>.</li>
<li><strong>ISO 45001:</strong> opcional; ajuda quem precisa de PGR ou quer SGSSO. <a href="/quanto-custa-iso-45001/">Quanto custa</a>.</li>
</ul>

`;

let c = row.content.trim();
if (!c.includes('id="respostas-diretas"')) {
  c = c.replace(/^<p>"Sou MEI/, head + '<p>"Sou MEI');
}
c = semTravessao(c);

writeFileSync(path.join(dir, "nr-1-mei-microempresa-epp.html"), c, "utf8");

const meta = {
  title: row.title,
  seo_title: row.seo_title,
  seo_description:
    "Item 1.8 NR-1: MEI, ME e EPP, dispensa de PGR e PCMSO, condições cumulativas, grau de risco, psicossocial e ISO 45001.",
  tldr: row.tldr.replace(/\u2014/g, ". ").replace(/ — /g, ". "),
  faq: row.faq.map((f) => ({
    ...f,
    resposta: semTravessao(f.resposta),
  })),
};

writeFileSync(path.join(dir, "nr-1-mei-microempresa-epp.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("nr-1-mei-microempresa-epp GEO ok");
