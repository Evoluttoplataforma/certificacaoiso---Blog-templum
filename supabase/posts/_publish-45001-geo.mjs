/**
 * Fases A+B+C GEO ISO 45001: gera hubs, aplica no Supabase, patch nr-1 links.
 * node supabase/posts/_publish-45001-geo.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const POSTS = path.join(ROOT, "supabase", "posts");

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

for (const script of [
  "_build-iso-45001-hub.mjs",
  "_build-iso-45001-perigos-patch.mjs",
  "_build-nr-1-riscos-psicossociais-geo.mjs",
  "_build-ohsas-45001-geo.mjs",
  "_build-nr-1-hub-geo.mjs",
]) {
  const r = spawnSync(process.execPath, [path.join(POSTS, script)], { stdio: "inherit", cwd: POSTS });
  if (r.status !== 0) process.exit(r.status || 1);
}

const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const CAT_SST = {
  category_id: "47628dfe-71bd-426e-b828-f43569bcc870",
  category_name: "Saúde e Segurança do Trabalho",
  author_name: "Ricardo Tocha",
};

const SLUGS = [
  "iso-45001",
  "consultoria-iso-45001",
  "passo-a-passo-certificacao-iso-45001",
  "iso-45003-vs-iso-45001",
  "consultoria-iso-sistema-integrado-9001-14001-45001",
  "iso-45001-perigos",
  "quanto-custa-iso-45001",
  "iso-45001-requisitos-tudo-que-voce-precisa-saber",
  "nr-1-e-iso-45001",
  "nr-1-riscos-psicossociais",
  "iso-45001-cliente-edital-exige-certificado",
  "ohsas-18001-e-iso-45001",
  "nr-1",
];

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

function loadSlug(slug) {
  const html = readFileSync(path.join(POSTS, `${slug}.html`), "utf8");
  const metaPath = path.join(POSTS, `${slug}.meta.json`);
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
  return { html, meta };
}

async function fetchPost(slug) {
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id,slug,title,content`;
  const rows = await (await fetch(q, { headers: H })).json();
  return rows[0] || null;
}

async function insertPost(slug, html, meta) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const publishedAt = meta.published_at || new Date().toISOString();
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
    published_at: publishedAt,
    revised_at: meta.revised_at || publishedAt,
    reading_time_min: Math.max(1, Math.round(words / 230)),
    tags: meta.tags || [],
    ...CAT_SST,
  };
  const r = await fetch(`${API}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insert ${slug}: ${r.status} ${await r.text()}`);
  console.log(`  criado: ${slug}`);
}

async function patchPost(slug, html, meta) {
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`;
  const antes = await (await fetch(`${q}&select=slug,title,tldr,content,faq,seo_title,seo_description`, { headers: H })).json();
  if (!antes.length) throw new Error(`post sumiu: ${slug}`);
  const dia = new Date().toISOString().slice(0, 10);
  const bk = path.join(POSTS, `../backup/${slug}-antes-${dia}.json`);
  writeFileSync(bk, JSON.stringify(antes[0], null, 2));
  console.log(`  backup: ${path.relative(ROOT, bk)}`);

  const campos = { content: html };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at", "revised_at"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  if (meta.revised_at === undefined) campos.revised_at = new Date().toISOString();

  const r = await fetch(q, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(campos),
  });
  if (!r.ok) throw new Error(`patch ${slug}: ${r.status} ${await r.text()}`);
  console.log(`  aplicado: ${slug}`);
}

async function patchNr1Links() {
  const slug = "nr-1";
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${slug}&select=slug,content`;
  const rows = await (await fetch(q, { headers: H })).json();
  if (!rows.length) {
    console.log("  nr-1: post não encontrado, skip");
    return;
  }
  let content = rows[0].content;
  const marker = "consultoria-iso-45001";
  if (content.includes(marker)) {
    console.log("  nr-1: links 45001 já presentes");
    return;
  }
  const insert =
    '<p><strong>Certificação ISO 45001:</strong> para estruturar SST além do PGR legal, veja o <a href="/iso-45001/">guia ISO 45001</a>, <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo até certificar</a> e <a href="/consultoria-iso-45001/">consultoria ISO 45001</a>. Psicossocial: <a href="/iso-45003-vs-iso-45001/">ISO 45003 vs 45001</a>.</p>\n\n';
  content = content.replace(/<h2 id="para-que-serve">/, insert + '<h2 id="para-que-serve">');

  const dia = new Date().toISOString().slice(0, 10);
  writeFileSync(path.join(POSTS, `../backup/${slug}-antes-45001-geo-${dia}.json`), JSON.stringify(rows[0], null, 2));

  const r = await fetch(q, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify({ content, revised_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`patch nr-1: ${r.status} ${await r.text()}`);
  console.log("  aplicado: nr-1 (links 45001)");
}

for (const slug of SLUGS) {
  console.log(`\n--- ${slug} ---`);
  const { html, meta } = loadSlug(slug);
  const existing = await fetchPost(slug);
  if (!existing) await insertPost(slug, html, meta);
  else await patchPost(slug, html, meta);
}

console.log("\n--- nr-1 (fase C) ---");
await patchNr1Links();

console.log("\nConcluído. Próximo: npm run build (+ push se quiser llms no ar).");
