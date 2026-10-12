#!/usr/bin/env node
/** Trilha A SERP: publica pillars certificação + migra slug iso-14001-2 → iso-14001 */
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
const CAT = {
  category_id: "94802fc7-6dfd-4677-8054-e7092a3d5f91",
  category_name: "Qualidade e Inovação",
  author_name: "Ricardo Tocha",
};

const SLUGS = [
  "iso-9001",
  "passo-a-passo-certificacao-iso-9001",
  "quanto-custa-iso-9001",
  "iso-27001",
  "certificacao-iso-27001-etapas-prazo-custo",
  "iso-45001",
  "passo-a-passo-certificacao-iso-45001",
  "iso-14001",
];

async function publishSlug(slug) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const mp = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  if (rows.length) {
    const r = await fetch(q, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify(campos),
    });
    console.log(slug, "patch", r.status);
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
    tags: meta.tags || [],
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

async function migrate14001() {
  const oldSlug = "iso-14001-2";
  const newSlug = "iso-14001";
  const html = readFileSync(path.join(AQUI, `${newSlug}.html`), "utf8");
  const meta = JSON.parse(readFileSync(path.join(AQUI, `${newSlug}.meta.json`), "utf8"));
  const qOld = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(oldSlug)}&select=id,slug`;
  const oldRows = await fetch(qOld, { headers: H }).then((r) => r.json());
  const qNew = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(newSlug)}&select=id`;
  const newRows = await fetch(qNew, { headers: H }).then((r) => r.json());

  const campos = {
    slug: newSlug,
    content: html,
    revised_at: new Date().toISOString(),
    canonical_url: `https://certificacaoiso.com.br/${newSlug}/`,
    title: meta.title,
    tldr: meta.tldr,
    seo_title: meta.seo_title,
    seo_description: meta.seo_description,
    faq: meta.faq,
  };

  if (oldRows.length && !newRows.length) {
    const id = oldRows[0].id;
    const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify(campos),
    });
    console.log("migrate", oldSlug, "→", newSlug, "patch id", id, r.status);
    return;
  }
  if (newRows.length) {
    await publishSlug(newSlug);
    if (oldRows.length) {
      const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${oldRows[0].id}`, {
        method: "PATCH",
        headers: { ...H, Prefer: "return=minimal" },
        body: JSON.stringify({ status: "draft", revised_at: new Date().toISOString() }),
      });
      console.log(oldSlug, "→ draft", r.status);
    }
    console.log("iso-14001 published (canonical)");
    return;
  }
  console.warn("iso-14001-2 not found; inserting iso-14001");
  await publishSlug(newSlug);
}

await migrate14001();
for (const slug of SLUGS) {
  if (slug === "iso-14001") continue;
  await publishSlug(slug);
}
console.log("Trilha A Supabase ok");
