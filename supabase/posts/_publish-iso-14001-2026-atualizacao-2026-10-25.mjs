#!/usr/bin/env node
/** Atualização ISO 14001:2026 publicada (25/out/2026) → Supabase. */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SLUGS = [
  "iso-14001",
  "iso-14001-2",
  "guia-definitivo-das-mudancas-iso-2026",
  "consultoria-iso-14001",
];

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
for (const slug of SLUGS) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const metaPath = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
  const rows = await fetch(`${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`, {
    headers: H,
  }).then((r) => r.json());
  if (!rows.length) {
    console.warn(slug, "nao existe no Supabase");
    continue;
  }
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at", "tags"]) {
    if (meta[k] !== undefined && meta[k] !== null) campos[k] = meta[k];
  }
  const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${rows[0].id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(slug, r.ok ? "ok" : "fail", r.status);
}
