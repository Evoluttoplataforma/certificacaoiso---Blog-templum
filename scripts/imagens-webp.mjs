// Converte em WebP as imagens FIXAS do layout — as que aparecem em toda página e por
// isso pesam no LCP de todo mundo. Roda: node scripts/imagens-webp.mjs
//
// Por que existe (medido em 20/08/2026, relatório de LCP do Clarity: 5s, 42% "precisa
// de melhorias"): uma página de artigo baixava ~600KB de imagem ANTES da primeira
// imagem do texto. O pior item era a foto da Olívia — PNG de 260KB, 345x422, exibida
// a 44px na tarja do topo e 72px na sidebar. Um PNG de 260KB no caminho crítico rouba
// banda do elemento que o navegador vai medir como LCP (o h1 e o TL;DR, que são texto).
//
// Tamanhos escolhidos pelo slot real, com 2x para telas densas, e não pelo original:
//   · Olívia  → 160px (slot máximo 72px)
//   · categorias → 800px (slot do card 640x400)
// Os originais (.png/.jpg) FICAM no repo de propósito: HTML já em cache e conteúdo
// antigo no banco ainda podem apontar para eles. Trocar a extensão sem manter o
// arquivo velho é 404 na cara do leitor.
import { readdirSync, statSync } from "node:fs";
import sharp from "sharp";

const kb = (n) => String(Math.round(n / 1024)).padStart(4);

const JOBS = [
  { src: "public/assets/team/olivia-especialista.png", out: "public/assets/team/olivia-especialista.webp", w: 160, q: 84 },
  ...readdirSync("public/assets/categorias")
    .filter((f) => f.endsWith(".jpg"))
    .map((f) => ({
      src: `public/assets/categorias/${f}`,
      out: `public/assets/categorias/${f.replace(/\.jpg$/, ".webp")}`,
      w: 800,
      q: 76,
    })),
];

let antes = 0;
let depois = 0;
for (const j of JOBS) {
  const orig = statSync(j.src).size;
  const info = await sharp(j.src).resize(j.w).webp({ quality: j.q }).toFile(j.out);
  antes += orig;
  depois += info.size;
  console.log(`${kb(orig)}KB → ${kb(info.size)}KB  ${info.width}x${info.height}  ${j.out.replace("public", "")}`);
}
console.log(`\n${JOBS.length} imagens · ${kb(antes)}KB → ${kb(depois)}KB (-${Math.round((1 - depois / antes) * 100)}%)`);
