#!/usr/bin/env node
/**
 * INSERT dos 3 artigos novos do batch ISO 27001/27701 GEO (se slug livre).
 *   node supabase/posts/_publish-iso-27001-geo-ia-novos.mjs
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

const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY no .env");
  process.exit(1);
}

const CAT_ID = "73d8e99d-517b-41c2-8c2e-8f9229355ceb";
const SLUGS = [
  "iso-27001-para-pequenas-empresas",
  "como-implementar-a-iso-27701",
  "certificacao-iso-27701-etapas-e-requisitos",
];

const TAGS = {
  "iso-27001-para-pequenas-empresas": ["ISO 27001", "SGSI", "PME", "certificação"],
  "como-implementar-a-iso-27701": ["ISO 27701", "privacidade", "SGPI", "LGPD"],
  "certificacao-iso-27701-etapas-e-requisitos": ["ISO 27701", "certificação", "privacidade"],
};

async function publishSlug(slug) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const meta = JSON.parse(readFileSync(path.join(AQUI, `${slug}.meta.json`), "utf8"));
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const reading = Math.max(1, Math.round(words / 230));

  const check = await fetch(`${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${slug}&select=id,status`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const existing = await check.json();
  if (Array.isArray(existing) && existing.length) {
    console.log(slug, "já existe — use aplicar-conteudo.mjs");
    return;
  }

  const publishedAt = new Date().toISOString();
  const row = {
    title: meta.title,
    slug,
    content: html,
    excerpt: meta.seo_description,
    tldr: meta.tldr,
    faq: meta.faq,
    author_name: "Daniela Albuquerque",
    category_id: CAT_ID,
    category_name: "Segurança e Compliance",
    tags: TAGS[slug] || ["ISO 27001"],
    status: "published",
    published_at: publishedAt,
    revised_at: publishedAt,
    seo_title: meta.seo_title,
    seo_description: meta.seo_description,
    canonical_url: `https://certificacaoiso.com.br/${slug}/`,
    reading_time_min: reading,
  };

  const ins = await fetch(`${SB_URL}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!ins.ok) {
    console.error(slug, await ins.text());
    process.exit(1);
  }
  const created = await ins.json();
  console.log("publicado", slug, created[0]?.id);
}

for (const slug of SLUGS) {
  await publishSlug(slug);
}
