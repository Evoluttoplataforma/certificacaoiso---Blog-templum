/**
 * Publica criativos de webinar em public/assets/webinars/{slug}.webp
 * (usados pelo WebinarCard no fim de todos os artigos; troca automática por data).
 *
 * Modo A — WEBP prontos do designer (pasta out-YYYY-MM + manifest.json):
 *   node scripts/webinars-publish-assets.mjs scripts/criativos-webinars/out-2026-10
 *
 * Modo B — PNG _feed 1080 (gera webp 640px; requer sharp):
 *   node scripts/webinars-webp.mjs scripts/criativos-webinars/out-2026-10
 */
import { copyFileSync, existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { WEBINARS } from "../src/data/webinars.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(root, "public/assets/webinars");

const pastaArg = process.argv[2];
if (!pastaArg) {
  console.error("Uso: node scripts/webinars-publish-assets.mjs <pasta-com-manifest>");
  process.exit(1);
}

const pasta = resolve(pastaArg);
const manifestPath = join(pasta, "manifest.json");
if (!existsSync(manifestPath)) {
  console.error(`manifest.json não encontrado em ${pasta}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const map = manifest.arquivos || manifest.files;
if (!map || typeof map !== "object") {
  console.error("manifest precisa de arquivos: { \"slug\": \"arquivo.webp\", ... }");
  process.exit(1);
}

const slugsValidos = new Set(WEBINARS.map((w) => w.slug));
let ok = 0;

for (const [slug, arquivo] of Object.entries(map)) {
  if (!slugsValidos.has(slug)) {
    console.warn(`aviso: slug "${slug}" não está em src/data/webinars.js — publicando mesmo assim`);
  }
  const src = join(pasta, arquivo);
  if (!existsSync(src)) {
    console.error(`faltando: ${src}`);
    process.exit(1);
  }
  const dest = join(DEST, `${slug}.webp`);
  copyFileSync(src, dest);
  const kb = Math.round(statSync(dest).size / 1024);
  console.log(`${slug.padEnd(28)} ← ${basename(arquivo)}  (${kb} KB)`);
  ok++;
}

console.log(`\n${ok} arquivo(s) em ${DEST}/`);
console.log("Próximo: conferir datas em src/data/webinars.js e npm run build");
