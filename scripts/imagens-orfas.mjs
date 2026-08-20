// Lista (e opcionalmente apaga) as imagens de /wp-content que NADA referencia.
//
// Roda: node scripts/imagens-orfas.mjs           → só relatório (padrão, não apaga nada)
//       node scripts/imagens-orfas.mjs --apply   → apaga
//
// Pré-requisito: `npm run build` recente. O dist é a fonte de verdade do que o leitor
// pode pedir, porque é ele que contém o HTML de 1.020 posts, o sitemap, o rss e o
// search-index já com as substituições do processContent() aplicadas.
//
// Por que existe: herdamos 190MB de uploads do WordPress e 988 deles são as featured
// images dos posts — que este blog NUNCA renderiza (featured_image é nulo nos 1.020
// registros; o suporte a heroImage existe no código, mas nunca foi usado). Some-se
// um GIF de 19MB e o repo carregava 185MB de arquivo que nenhuma URL do site alcança,
// pesando em cada clone e em cada upload de deploy dos Workers Builds.
//
// O que NÃO é órfão:
//   · qualquer URL citada no dist (HTML, sitemap, rss, search-index);
//   · qualquer URL de scripts/imagens-orfas-keep.txt — as que vivem só no banco
//     (rascunhos, tabelas de backup, iscas) e por isso não aparecem no dist.
// Vale notar o que este script NÃO sabe: link externo apontando para uma imagem nossa.
// É risco aceito e reversível — os arquivos ficam no histórico do git (git checkout
// <commit> -- public/wp-content/... traz de volta).
import { readFileSync, readdirSync, statSync, unlinkSync, rmdirSync } from "node:fs";
import { join, relative } from "node:path";

const APLICAR = process.argv.includes("--apply");
const RE = /\/wp-content\/uploads\/[^"'\s)>]+/g;

// Comparar a URL crua com o nome do arquivo NÃO funciona, e essa foi a primeira versão
// deste script — que apagou uma imagem citada. Dois motivos, os dois presentes no repo:
//   · a URL vem percent-encoded no HTML (…12.11.29… aparece como %CC%80 no acento);
//   · o nome no disco pode estar em NFD (macOS) e no HTML em NFC — "à" com o acento
//     combinando é outra sequência de bytes que a mesma letra pré-composta.
// Daí a chave normalizada: decodifica e reduz as duas pontas à mesma forma Unicode.
function chave(u) {
  let d = u;
  try { d = decodeURIComponent(u); } catch { /* URL com % solto: usa como veio */ }
  return d.normalize("NFC");
}

function* arquivos(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* arquivos(p);
    else yield p;
  }
}

// 1) tudo que o dist cita
const citadas = new Set();
let lidos = 0;
for (const f of arquivos("dist")) {
  if (!/\.(html|xml|json|txt)$/i.test(f)) continue;
  lidos++;
  for (const m of readFileSync(f, "utf8").matchAll(RE)) citadas.add(chave(m[0].replace(/[.,;]+$/, "")));
}
if (!lidos) throw new Error("dist vazio — rode `npm run build` antes");

// 2) mais a lista curada do que só existe no banco
for (const l of readFileSync("scripts/imagens-orfas-keep.txt", "utf8").split("\n")) {
  const s = l.trim();
  if (s && !s.startsWith("#")) citadas.add(chave(s));
}

// 3) confronta com o disco
const orfas = [];
let bytesTotal = 0;
let bytesOrfas = 0;
for (const f of arquivos("public/wp-content")) {
  const url = "/" + relative("public", f).split("\\").join("/");
  const sz = statSync(f).size;
  bytesTotal += sz;
  if (!citadas.has(chave(url))) { orfas.push({ f, url, sz }); bytesOrfas += sz; }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + "MB";
orfas.sort((a, b) => b.sz - a.sz);
console.log(`referências vivas: ${citadas.size} (${lidos} arquivos do dist + keep.txt)`);
console.log(`em disco:          ${mb(bytesTotal)}`);
console.log(`órfãs:             ${orfas.length} arquivos · ${mb(bytesOrfas)}\n`);
console.log("as 10 maiores:");
for (const o of orfas.slice(0, 10)) console.log(`  ${String(Math.round(o.sz / 1024)).padStart(7)}KB  ${o.url}`);

if (!APLICAR) { console.log("\n(relatório só — rode com --apply para apagar)"); process.exit(0); }

for (const o of orfas) unlinkSync(o.f);
// pastas que ficaram vazias (uploads/2011/03 e afins) saem também
for (let i = 0; i < 6; i++) {
  for (const d of [...arquivos("public/wp-content")].map((f) => f.split("/").slice(0, -1).join("/"))) void d;
  const vazias = [];
  (function varre(dir) {
    const es = readdirSync(dir, { withFileTypes: true });
    for (const e of es) if (e.isDirectory()) varre(join(dir, e.name));
    if (readdirSync(dir).length === 0) vazias.push(dir);
  })("public/wp-content");
  if (!vazias.length) break;
  vazias.forEach((d) => rmdirSync(d));
}
console.log(`\napagados ${orfas.length} arquivos · ${mb(bytesOrfas)} liberados`);
