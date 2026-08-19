// Converte os criativos de webinar (PNG 1080x1080, ~1,6MB cada) em webp de 640px
// para public/assets/webinars/. Os PNGs originais NÃO entram no repo: 11MB de imagem
// que o leitor nunca baixaria no tamanho original.
//
// Roda: node scripts/webinars-webp.mjs "<pasta dos criativos>"
// Nomeia pelo slug do webinar (ver src/data/webinars.js), não pelo nome do arquivo do
// designer — assim trocar o criativo de uma data é sobrescrever um arquivo só.
import { readdirSync } from "node:fs";
import sharp from "sharp";

const pasta = process.argv[2] || "/Users/rodrigofurniel/Documents/Criativos-Webinars-Ago-Set-2026";
const DEST = "public/assets/webinars";

// nome do arquivo do designer → slug estável (00a_19-08_analise-critica_feed… → analise-critica)
const slugDoArquivo = (f) => (f.match(/^\d+[a-z]?_\d{2}-\d{2}_([a-z-]+)_feed/) || [])[1];

const arquivos = readdirSync(pasta).filter((f) => /_feed-1080x1080\.png$/.test(f));
if (!arquivos.length) throw new Error(`nenhum criativo _feed encontrado em ${pasta}`);

for (const f of arquivos.sort()) {
  const slug = slugDoArquivo(f);
  if (!slug) { console.warn(`pulado (nome fora do padrão): ${f}`); continue; }
  const info = await sharp(`${pasta}/${f}`).resize(640).webp({ quality: 78 }).toFile(`${DEST}/${slug}.webp`);
  console.log(`${slug.padEnd(22)} ${String(Math.round(info.size / 1024)).padStart(4)}KB  ${info.width}x${info.height}`);
}
console.log(`\n${arquivos.length} criativos convertidos em ${DEST}/`);
