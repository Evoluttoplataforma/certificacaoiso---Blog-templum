#!/usr/bin/env node
/** Publica lote A3 legado 14001-2 + cluster NR-1 (14/out/2026). */
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

const SLUGS = [
  "guia-definitivo-das-mudancas-iso-2026",
  "iso-9001-requisitos-tudo-que-voce-precisa-saber",
  "iso-14001-2",
  "consultoria-iso-14001",
  "consultoria-iso-sistema-integrado-9001-14001",
  "como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa",
  "nr-1",
  "nr-1-e-iso-45001",
  "nr-1-riscos-psicossociais",
  "nr-1-se-aplica-a-minha-empresa",
  "nr-1-mei-microempresa-epp",
];

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

for (const slug of SLUGS) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const mp = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  if (!rows.length) {
    console.error(slug, "nao encontrado");
    process.exit(1);
  }
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  const r = await fetch(q, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(slug, "patch", r.status);
}
