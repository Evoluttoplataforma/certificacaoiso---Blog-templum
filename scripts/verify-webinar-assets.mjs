/**
 * Falha o build se o webinar da semana não tiver .webp em public/assets/webinars/.
 * Evita publicar HTML apontando para arte 404.
 */
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { webinarAtual, WEBINARS } from "../src/data/webinars.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public/assets/webinars");

const w = webinarAtual();
if (!w) {
  console.log("verify-webinar-assets: nenhum webinar ativo (série encerrada); ok.");
  process.exit(0);
}

const path = join(dir, `${w.slug}.webp`);
if (!existsSync(path)) {
  console.error(
    `verify-webinar-assets: falta ${path}\n` +
      `  Webinar ativo: ${w.titulo} (${w.data})\n` +
      `  Rode: npm run webinars:assets`
  );
  process.exit(1);
}

const faltando = WEBINARS.filter((x) => +new Date(x.fim) > Date.now())
  .filter((x) => !existsSync(join(dir, `${x.slug}.webp`)))
  .map((x) => x.slug);

if (faltando.length) {
  console.warn("verify-webinar-assets: aviso, slugs futuros sem arquivo:", faltando.join(", "));
}

console.log(`verify-webinar-assets: ok (${w.slug}.webp)`);
