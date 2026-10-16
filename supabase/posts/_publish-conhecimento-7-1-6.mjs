#!/usr/bin/env node
/** Publica conhecimento-organizacional-iso-9001-2026-requisito-7-1-6 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(AQUI, "..", "..");
const SLUG = "conhecimento-organizacional-iso-9001-2026-requisito-7-1-6";
const CAT_ID = "94802fc7-6dfd-4677-8054-e7092a3d5f91";

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

const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const html = readFileSync(path.join(AQUI, `${SLUG}.html`), "utf8");
const meta = JSON.parse(readFileSync(path.join(AQUI, `${SLUG}.meta.json`), "utf8"));
const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const reading = Math.max(1, Math.round(words / 230));
const excerpt = meta.tldr?.slice(0, 320) || null;

const campos = {
  content: html,
  excerpt,
  tldr: meta.tldr,
  faq: meta.faq,
  seo_title: meta.seo_title,
  seo_description: meta.seo_description,
  title: meta.title,
  revised_at: new Date().toISOString(),
  reading_time_min: reading,
  canonical_url: `https://certificacaoiso.com.br/${SLUG}/`,
  tags: meta.tags || ["ISO 9001", "ISO 9001:2026", "7.1.6"],
};

const check = await fetch(`${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${SLUG}&select=id`, { headers: H });
const existing = await check.json();

if (Array.isArray(existing) && existing.length) {
  const r = await fetch(`${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${SLUG}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(SLUG, "patch", r.status);
  process.exit(r.ok ? 0 : 1);
}

const row = {
  ...campos,
  slug: SLUG,
  status: "published",
  published_at: meta.published_at || new Date().toISOString(),
  author_name: "Ricardo Tocha",
  category_id: CAT_ID,
  category_name: "Qualidade e Inovação",
  seo_keywords: ["conhecimento organizacional ISO 9001", "requisito 7.1.6", "migração ISO 9001 2026"],
};

const ins = await fetch(`${SB_URL}/rest/v1/blog_templum_posts`, {
  method: "POST",
  headers: { ...H, Prefer: "return=representation" },
  body: JSON.stringify(row),
});
if (!ins.ok) {
  console.error("INSERT falhou:", ins.status, await ins.text());
  process.exit(1);
}
const [post] = await ins.json();
console.log("INSERT OK", post.id, post.slug);
