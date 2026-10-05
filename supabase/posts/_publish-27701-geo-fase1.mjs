#!/usr/bin/env node
/** Aplica ou cria posts do batch 27701 GEO fase 1. node supabase/posts/_publish-27701-geo-fase1.mjs */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const CAT_ID = "73d8e99d-517b-41c2-8c2e-8f9229355ceb";
const CAT_NAME = "Segurança e Compliance";
const AUTHOR = "Daniela Albuquerque";

const SLUGS = [
  "como-implementar-a-iso-27701",
  "certificacao-iso-27701-etapas-e-requisitos",
  "iso-27701-2025-o-que-muda-independencia-da-iso-27001",
  "iso-27701-lgpd-gdpr-conformidade",
  "relacao-do-lgpd-com-a-iso-27001",
];

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

function load(slug) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const meta = JSON.parse(readFileSync(path.join(AQUI, `${slug}.meta.json`), "utf8"));
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return { html, meta, reading: Math.max(1, Math.round(words / 230)) };
}

async function getPost(slug) {
  const r = await fetch(`${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id,slug`, { headers: H });
  const rows = await r.json();
  return rows[0] || null;
}

async function insert(slug, html, meta, reading) {
  const publishedAt = new Date().toISOString();
  const row = {
    title: meta.title,
    slug,
    content: html,
    excerpt: (meta.seo_description || meta.tldr || "").slice(0, 280),
    tldr: meta.tldr,
    faq: meta.faq,
    author_name: AUTHOR,
    category_id: CAT_ID,
    category_name: CAT_NAME,
    tags: meta.tags || ["ISO 27701", "privacidade", "LGPD"],
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
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!ins.ok) throw new Error(`insert ${slug}: ${await ins.text()}`);
  const created = await ins.json();
  console.log("criado", slug, created[0]?.id);
}

async function patch(slug, html, meta) {
  const q = `${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`;
  const antes = await (await fetch(`${q}&select=*`, { headers: H })).json();
  if (!antes.length) throw new Error(`missing ${slug}`);
  const bk = path.join(AQUI, "..", "backup", `${slug}-antes-${new Date().toISOString().slice(0, 10)}.json`);
  writeFileSync(bk, JSON.stringify(antes[0], null, 2));
  console.log("backup", path.relative(ROOT, bk));

  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  const r = await fetch(q, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(campos) });
  if (!r.ok) throw new Error(`patch ${slug}: ${await r.text()}`);
  console.log("aplicado", slug);
}

for (const slug of SLUGS) {
  const { html, meta, reading } = load(slug);
  const ex = await getPost(slug);
  if (ex) await patch(slug, html, meta);
  else await insert(slug, html, meta, reading);
}
console.log("Concluído.");
