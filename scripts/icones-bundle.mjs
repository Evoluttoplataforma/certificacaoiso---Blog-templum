// Gera o pacote LOCAL de ícones e vendora o web component do Iconify.
//
// Roda: node scripts/icones-bundle.mjs   (precisa de rede; a API do Iconify é pública)
// Saída: public/assets/icons/icones.js          → window.IconifyPreload com os SVGs
//        public/assets/icons/iconify-icon.min.js → cópia de node_modules/iconify-icon
//
// Por que existe: o blog carregava o componente do CDN da jsdelivr e — o que é pior e
// passava batido — o componente busca o SVG de cada ícone em api.iconify.design EM
// RUNTIME. Eram dois terceiros no caminho de render de 1.020 páginas: dois DNS, dois
// TLS, e ícones que só pintam depois de uma resposta de fora. Com o preload, tudo é
// same-origin e cai na regra de cache imutável de /assets/* (public/_headers).
//
// São 34 ícones em todo o blog (33 do solar, 1 do ic), e o pacote sai com ~10KB — menos
// do que o handshake que ele elimina. O componente respeita window.IconifyPreload se
// estiver definido ANTES dele: é o que a ordem dos dois <script defer> em Base.astro
// garante (defer clássico executa na ordem do documento).
//
// AO ADICIONAR ÍCONE NOVO no código, rode este script de novo. Se esquecer, nada quebra:
// o componente busca o que faltar na API do Iconify, como antes — só aquele ícone volta
// a depender de rede externa. O relatório no fim lista o que entrou, para conferência.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DEST = "public/assets/icons";
// `icon="solar:x"` nos .astro e `icon: "solar:x"` nos .js de dados (data/categorias.js).
const RE = /\bicon\s*[:=]\s*["']([a-z0-9][a-z0-9-]*:[a-z0-9-]+)["']/g;

function* arquivos(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* arquivos(p);
    else yield p;
  }
}

// src é a fonte; dist entra quando existe, porque pega ícone que venha de conteúdo do
// banco (o bloco de CTA injetado no meio do artigo, por exemplo).
const usados = new Set();
for (const raiz of ["src", "dist"]) {
  try { statSync(raiz); } catch { continue; }
  for (const f of arquivos(raiz)) {
    if (!/\.(astro|js|mjs|ts|html)$/i.test(f)) continue;
    for (const m of readFileSync(f, "utf8").matchAll(RE)) usados.add(m[1]);
  }
}
if (!usados.size) throw new Error("nenhum ícone encontrado — o regex ou a estrutura mudou");

const porPrefixo = {};
for (const id of usados) {
  const [p, n] = id.split(":");
  (porPrefixo[p] = porPrefixo[p] || []).push(n);
}

const colecoes = [];
for (const [prefixo, nomes] of Object.entries(porPrefixo)) {
  const url = `https://api.iconify.design/${prefixo}.json?icons=${nomes.sort().join(",")}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`API do Iconify: HTTP ${r.status} em ${prefixo}`);
  const col = await r.json();
  const faltando = nomes.filter((n) => !col.icons?.[n] && !col.aliases?.[n]);
  if (faltando.length) throw new Error(`ícones inexistentes em ${prefixo}: ${faltando.join(", ")}`);
  colecoes.push(col);
  console.log(`${prefixo.padEnd(8)} ${String(nomes.length).padStart(3)} ícones`);
}

mkdirSync(DEST, { recursive: true });
const js = `/* Gerado por scripts/icones-bundle.mjs — não edite à mão. */\nwindow.IconifyPreload=${JSON.stringify(colecoes)};\n`;
writeFileSync(`${DEST}/icones.js`, js);
copyFileSync("node_modules/iconify-icon/dist/iconify-icon.min.js", `${DEST}/iconify-icon.min.js`);

const kb = (n) => Math.round(n / 1024) + "KB";
console.log(`\n${usados.size} ícones · icones.js ${kb(js.length)} · componente ${kb(statSync(`${DEST}/iconify-icon.min.js`).size)}`);
