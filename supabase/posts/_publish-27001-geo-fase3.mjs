#!/usr/bin/env node
/** node supabase/posts/_publish-27001-geo-fase3.mjs */
import { spawnSync } from "node:child_process";
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

const CAT_SEC = { category_id: "73d8e99d-517b-41c2-8c2e-8f9229355ceb", category_name: "Segurança e Compliance", author_name: "Daniela Albuquerque" };

const SLUGS = {
  "iso-27000-vs-iso-27001": CAT_SEC,
  "iso-27001-anexo-a-mapeamento-politicas": CAT_SEC,
  "treinamento-iso-27001": CAT_SEC,
  "iso-27001": CAT_SEC,
  "certificacao-iso-27001-etapas-prazo-custo": CAT_SEC,
};

for (const script of ["_build-iso-27001-hub-geo-full.mjs", "_build-certificacao-27001-geo.mjs"]) {
  const r = spawnSync(process.execPath, [path.join(AQUI, script)], { stdio: "inherit", cwd: AQUI });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

function load(slug) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const meta = JSON.parse(readFileSync(path.join(AQUI, `${slug}.meta.json`), "utf8"));
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return { html, meta, reading: Math.max(1, Math.round(words / 230)) };
}

async function getPost(slug) {
  const r = await fetch(`${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`, { headers: H });
  return (await r.json())[0];
}

async function insert(slug, html, meta, reading, cat) {
  const publishedAt = new Date().toISOString();
  const row = {
    title: meta.title,
    slug,
    content: html,
    excerpt: (meta.seo_description || meta.tldr || "").slice(0, 280),
    tldr: meta.tldr,
    faq: meta.faq,
    seo_title: meta.seo_title,
    seo_description: meta.seo_description,
    canonical_url: `https://certificacaoiso.com.br/${slug}/`,
    status: "published",
    published_at: meta.published_at || publishedAt,
    revised_at: publishedAt,
    reading_time_min: reading,
    tags: meta.tags || [],
    ...cat,
  };
  const ins = await fetch(`${SB_URL}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!ins.ok) throw new Error(`insert ${slug}: ${await ins.text()}`);
  console.log("criado", slug, (await ins.json())[0]?.id);
}

async function patch(slug, html, meta) {
  const q = `${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`;
  const antes = await (await fetch(`${q}&select=*`, { headers: H })).json();
  if (!antes.length) throw new Error(`missing ${slug}`);
  writeFileSync(path.join(AQUI, "..", "backup", `${slug}-antes-${new Date().toISOString().slice(0, 10)}.json`), JSON.stringify(antes[0], null, 2));
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq"]) if (meta[k] !== undefined) campos[k] = meta[k];
  const r = await fetch(q, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(campos) });
  if (!r.ok) throw new Error(`patch ${slug}: ${await r.text()}`);
  console.log("aplicado", slug);
}

for (const [slug, cat] of Object.entries(SLUGS)) {
  const { html, meta, reading } = load(slug);
  const ex = await getPost(slug);
  if (ex) await patch(slug, html, meta);
  else await insert(slug, html, meta, reading, cat);
}
console.log("Concluído.");
