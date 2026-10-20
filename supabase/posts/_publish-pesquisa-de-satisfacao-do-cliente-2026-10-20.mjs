#!/usr/bin/env node
/** Publica pillar pesquisa-de-satisfacao-do-cliente (20/out/2026) → Supabase. */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SLUG = "pesquisa-de-satisfacao-do-cliente";
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
const CAT_ID = "94802fc7-6dfd-4677-8054-e7092a3d5f91";

const html = readFileSync(path.join(AQUI, `${SLUG}.html`), "utf8");
const meta = JSON.parse(readFileSync(path.join(AQUI, `${SLUG}.meta.json`), "utf8"));
const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(SLUG)}&select=id`;
const rows = await fetch(q, { headers: H }).then((r) => r.json());

const campos = {
  content: html,
  revised_at: new Date().toISOString(),
  status: "published",
  category_id: CAT_ID,
  category_name: "Qualidade e Inovação",
  canonical_url: `https://certificacaoiso.com.br/${SLUG}/`,
  reading_time_min: Math.max(1, Math.round(words / 230)),
  tags: meta.tags || ["ISO 9001", "Satisfação do cliente"],
};
for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at"]) {
  if (meta[k] !== undefined) campos[k] = meta[k];
}
if (meta.seo_description) campos.excerpt = meta.seo_description.slice(0, 280);

if (rows.length) {
  const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${rows[0].id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(SLUG, r.ok ? "patch ok" : "patch fail", r.status);
} else {
  const row = {
    slug: SLUG,
    author_name: "Daniela Albuquerque",
    ...campos,
    published_at: meta.published_at || new Date().toISOString(),
  };
  const r = await fetch(`${API}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  const j = await r.json();
  console.log(SLUG, "insert", r.status, j[0]?.id || j);
}
