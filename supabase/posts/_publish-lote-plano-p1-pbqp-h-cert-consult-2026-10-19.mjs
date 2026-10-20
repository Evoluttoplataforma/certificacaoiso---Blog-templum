#!/usr/bin/env node
/** Publica lote P1 PBQP-H certificação + consultoria (19/out/2026) → Supabase. */
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
const CAT_ID = "51a809b7-c11d-4e22-a1c0-1ed084acb7eb";
const CAT = { category_id: CAT_ID, category_name: "Construção Civil" };

const SLUGS = [
  "pbqp-h",
  "como-conseguiur-a-certificacao-do-pbqp-h",
  "pbqp-h-qual-o-custo-para-certificacao",
  "consultoria-pbqp-h",
];

async function publishSlug(slug) {
  const htmlPath = path.join(AQUI, `${slug}.html`);
  if (!existsSync(htmlPath)) {
    console.warn("skip", slug, "sem html");
    return;
  }
  const html = readFileSync(htmlPath, "utf8");
  const mp = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  if (rows.length) {
    const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${rows[0].id}`, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify(campos),
    });
    console.log(slug, r.ok ? "patch ok" : "patch fail", r.status);
    return;
  }
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const row = {
    title: meta.title || slug,
    slug,
    content: html,
    excerpt: (meta.tldr || meta.seo_description || "").slice(0, 280),
    tldr: meta.tldr,
    faq: meta.faq,
    seo_title: meta.seo_title,
    seo_description: meta.seo_description,
    canonical_url: `https://certificacaoiso.com.br/${slug}/`,
    status: "published",
    published_at: meta.published_at || new Date().toISOString(),
    revised_at: new Date().toISOString(),
    reading_time_min: Math.max(1, Math.round(words / 230)),
    tags: meta.tags || ["PBQP-H"],
    ...CAT,
  };
  const r = await fetch(`${API}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  const j = await r.json();
  console.log(slug, "insert", r.status, j[0]?.id || j);
}

for (const s of SLUGS) await publishSlug(s);
