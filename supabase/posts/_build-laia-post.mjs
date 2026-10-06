import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const exportPath = path.join(
  root,
  "supabase/backup/como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa-export-2026-10-06.json",
);
const j = JSON.parse(readFileSync(exportPath, "utf8"));
let c = j.content;

const introOld =
  /<p>No cenário empresarial atual[\s\S]*?<h2 id="o-que-e-o-laia-levantamento-de-aspectos-e-impactos-ambientais">/;

const introNew = `<p><strong>LAIA</strong> (Levantamento de Aspectos e Impactos Ambientais) é o processo de listar, para cada atividade da empresa, o que interage com o meio ambiente (<strong>aspecto</strong>) e qual alteração isso provoca (<strong>impacto</strong>), depois classificar o que é <strong>significativo</strong> pelos critérios que a organização define. Na <a href="/iso-14001-2/">ISO 14001</a>, isso alimenta o requisito 6.1.2 e os controles do capítulo 8.</p>
<p>Guia do blog Certificação ISO, da <a href="https://templum.com.br/iso-14001/"><strong>Templum Consultoria</strong></a>. Conceitos: <a href="/como-identificar-aspecto-impacto-ambiental/">aspecto x impacto</a> · hub <a href="/iso-14001-2/#o-processo-de-implementacao-da-iso-14001">implantação e certificação 14001</a> · <a href="/consultoria-iso-14001/">consultoria ISO 14001</a>.</p>
<p><strong>Neste artigo:</strong></p>
<ul>
<li><a href="#o-que-e-o-laia-levantamento-de-aspectos-e-impactos-ambientais">O que é o LAIA</a></li>
<li><a href="#aspectos-ambientais">Aspectos ambientais</a></li>
<li><a href="#impactos-ambientais">Impactos ambientais</a></li>
<li><a href="#realizando-o-laia">Realizando o LAIA (etapas)</a></li>
<li><a href="#beneficios-do-laia">Benefícios do LAIA</a></li>
<li><a href="#conclusao">Conclusão</a></li>
</ul>

<h2 id="o-que-e-o-laia-levantamento-de-aspectos-e-impactos-ambientais">`;

if (!introOld.test(c)) {
  console.error("intro pattern not found");
  process.exit(1);
}
c = c.replace(introOld, introNew);

c = c.replace(
  /<p>Além disso, o LAIA é uma exigência legal para diversas atividades[\s\S]*?<p>O LAIA é uma das etapas fundamentais para a elaboração desses estudos\.<\/p>/,
  `<p><strong>ISO 14001 x licenciamento:</strong> o LAIA do SGA documenta aspectos e impactos da operação certificada (incluindo condições anormais e emergência). Estudo de Impacto Ambiental (EIA/RIMA) atende licenciamento de empreendimentos na escala definida pela legislação (ex.: Resolução CONAMA 237/1997). Os dois podem se complementar, mas não são o mesmo documento nem a mesma finalidade.</p>`,
);

// Repetição excessiva no texto legado
const repeticao =
  / A identificação de alterações nas propriedades físicas do meio ambiente[^<]*/g;
c = c.replace(repeticao, "");

const repeticao2 =
  / As alterações nas propriedades físicas do meio ambiente[^<]*/g;
c = c.replace(repeticao2, "");

c = c.replace(
  /<p>Quer saber mais sobre a <a href="\/iso-14001-2\/">ISO 14001<\/a>[\s\S]*?<\/p>\s*$/,
  `<p class="post-aprofunde"><strong>Aprofunde:</strong> <a href="/iso-14001-2/">Guia ISO 14001</a> · <a href="/como-identificar-aspecto-impacto-ambiental/">Aspecto e impacto: diferença</a> · <a href="/controles-operacionais-iso-14001-requisito-8-1/">Controles operacionais (8.1)</a> · <a href="/aspectos-ambientais-transportadoras/">Aspectos em transportadoras</a></p>`,
);

const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa.html",
);
writeFileSync(out, c);
console.log("written", out, c.length);
