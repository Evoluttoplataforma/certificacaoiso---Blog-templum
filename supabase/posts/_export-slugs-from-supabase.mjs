#!/usr/bin/env node
/** Exporta posts do Supabase para supabase/posts/<slug>.html + .meta.json */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("uso: node _export-slugs-from-supabase.mjs slug1 slug2 ...");
  process.exit(1);
}

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

const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}
const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

for (const slug of slugs) {
  const rows = await fetch(
    `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=content,title,tldr,seo_title,seo_description,faq,published_at,tags`,
    { headers: H },
  ).then((r) => r.json());
  if (!rows.length) {
    console.warn("nao existe:", slug);
    continue;
  }
  const { content, ...meta } = rows[0];
  writeFileSync(path.join(AQUI, `${slug}.html`), content, "utf8");
  const m = {};
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at", "tags"]) {
    if (meta[k] != null) m[k] = meta[k];
  }
  writeFileSync(path.join(AQUI, `${slug}.meta.json`), `${JSON.stringify(m, null, 1)}\n`, "utf8");
  console.log("ok", slug, content.length);
}
