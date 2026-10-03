#!/usr/bin/env node
/**
 * Publica o post como-verificar-certificacao-pbqp-h (INSERT se slug livre).
 *   node supabase/posts/_publish-como-verificar-certificacao-pbqp-h.mjs
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

const slug = "como-verificar-certificacao-pbqp-h";
const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
const meta = JSON.parse(readFileSync(path.join(AQUI, `${slug}.meta.json`), "utf8"));
const CAT_ID = "51a809b7-c11d-4e22-a1c0-1ed084acb7eb";

const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const reading = Math.max(1, Math.round(words / 230));

async function main() {
  const check = await fetch(`${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${slug}&select=id,status`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const existing = await check.json();
  if (Array.isArray(existing) && existing.length) {
    console.log("Slug já existe — use aplicar-conteudo.mjs");
    process.exit(0);
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
    category_name: "Construção Civil",
    tags: ["PBQP-H", "SiAC", "certificação", "construção civil"],
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
  const body = await ins.text();
  if (!ins.ok) {
    console.error("INSERT falhou:", ins.status, body);
    process.exit(1);
  }
  const [post] = JSON.parse(body);
  console.log("Publicado:", post.slug, post.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
