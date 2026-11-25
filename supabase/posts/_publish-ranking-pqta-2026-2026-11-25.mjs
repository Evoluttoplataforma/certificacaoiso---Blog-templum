#!/usr/bin/env node
/**
 * Publica /ranking-pqta-2026-atualizacao-pontos-iso-cartorios/
 * Uso: node supabase/posts/_publish-ranking-pqta-2026-2026-11-25.mjs
 */
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
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const SB = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const CAT = "94802fc7-6dfd-4677-8054-e7092a3d5f91";
const CAT_NAME = "Qualidade e Inovação";
const AUTHOR = "Daniela Albuquerque";
const AGORA = new Date().toISOString();
const H = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const item = {
  slug: "ranking-pqta-2026-atualizacao-pontos-iso-cartorios",
  tags: [
    "PQTA",
    "Ranking PQTA",
    "cartórios",
    "NBR 15906",
    "ISO 9001",
    "ISO 27001",
    "ISO 45001",
    "ISO 14001",
  ],
  seo_keywords: [
    "ranking PQTA 2026",
    "ranking PQTA 2027",
    "pontos ranking PQTA",
    "ISO 27001 cartório",
    "NBR 15906",
    "Provimento 213",
    "Diamante PQTA",
    "certificação cartório",
  ],
};

function words(html) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

async function upsert() {
  const html = readFileSync(path.join(AQUI, `${item.slug}.html`), "utf8");
  const meta = JSON.parse(readFileSync(path.join(AQUI, `${item.slug}.meta.json`), "utf8"));
  const n = words(html);
  const row = {
    title: meta.title,
    slug: item.slug,
    content: html,
    excerpt: meta.tldr.slice(0, 280),
    tldr: meta.tldr,
    faq: meta.faq,
    author_name: AUTHOR,
    category_id: CAT,
    category_name: CAT_NAME,
    tags: item.tags,
    status: "published",
    published_at: AGORA,
    revised_at: AGORA,
    seo_title: meta.seo_title,
    seo_description: meta.seo_description,
    seo_keywords: item.seo_keywords,
    canonical_url: `https://certificacaoiso.com.br/${item.slug}/`,
    reading_time_min: Math.max(1, Math.round(n / 230)),
  };

  const check = await fetch(
    `${SB}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(item.slug)}&select=id,slug`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  );
  const existing = await check.json();
  if (existing?.[0]?.id) {
    const { slug, published_at, ...body } = row;
    const res = await fetch(`${SB}/rest/v1/blog_templum_posts?id=eq.${existing[0].id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ ...body, updated_at: AGORA }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`PATCH ${item.slug}: ${res.status} ${text}`);
    console.log("atualizado", item.slug, "palavras", n);
    return;
  }
  const res = await fetch(`${SB}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: H,
    body: JSON.stringify(row),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`INSERT ${item.slug}: ${res.status} ${text}`);
  console.log("criado", item.slug, "palavras", n, "seo", meta.seo_description.length);
}

await upsert();
