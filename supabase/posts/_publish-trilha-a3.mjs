#!/usr/bin/env node
/** Publica Trilha A3 (Supabase). */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(AQUI, "..", "..");
{
  const envPath = path.join(ROOT, ".env");
  if (existsSync(envPath)) {
    for (const linha of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const t = linha.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const SLUGS = [
  "iso-14001",
  "o-que-e-fluxograma-de-processos",
  "checklist-preparacao-auditoria-interna-iso",
  "consultoria-iso-14001",
  "como-identificar-aspecto-impacto-ambiental",
  "como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa",
  "consultoria-iso-sistema-integrado-9001-14001",
  "passo-a-passo-certificacao-iso-45001",
  "quanto-custa-iso-9001",
];

async function publishSlug(slug) {
  const htmlPath = path.join(AQUI, `${slug}.html`);
  if (!existsSync(htmlPath)) {
    console.warn("skip", slug);
    return;
  }
  const html = readFileSync(htmlPath, "utf8");
  const mp = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  if (!rows.length) {
    console.warn(slug, "nao no Supabase");
    return;
  }
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  const r = await fetch(q, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(slug, r.status);
}

for (const slug of SLUGS) await publishSlug(slug);
console.log("Trilha A3 publicada");
