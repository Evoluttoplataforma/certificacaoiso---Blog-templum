/**
 * Cria posts inexistentes e aplica conteúdo versionado (posts/*.html + .meta.json).
 * Uso: node supabase/publicar-posts-geo.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
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

const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const SLUGS = [
  "como-escolher-consultoria-iso",
  "consultoria-iso-9001",
  "consultoria-iso-37001",
  "gestao-indicadores-iso-9001-2026-requisitos-6-2-e-9-1",
  "consultoria-iso-9001-imobiliaria",
  "manter-certificacao-iso-apos-certificar",
  "homologacao-fornecedores-iso-9001",
  "consultoria-iso-9001-pme-remota",
  "iso-9001-cliente-edital-exige-certificado",
  "fssc-22000-vs-iso-22000-na-pratica",
  "como-obter-certificacao-fssc-22000-brasil",
  "fssc-22000-organismos-certificadores-brasil",
  "consultoria-iso-sistema-integrado-9001-14001",
  "consultoria-iso-9001-construcao-civil-licitacoes",
  "consultoria-iso-evidencias-auditoria-externa",
  "fssc-22000-versao-7",
  "certificacao-fssc-22000",
  "consultoria-iso-14001",
  "consultoria-iso-27001",
  "iso-14001-2",
  "iso-9001",
  "passo-a-passo-certificacao-iso-9001",
];

const CAT_QUALIDADE = {
  category_id: "94802fc7-6dfd-4677-8054-e7092a3d5f91",
  category_name: "Qualidade e Inovação",
  author_name: "Ricardo Tocha",
};

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

function postsDir() {
  return path.join(ROOT, "supabase", "posts");
}

function loadSlug(slug) {
  const base = postsDir();
  const html = readFileSync(path.join(base, `${slug}.html`), "utf8");
  const metaPath = path.join(base, `${slug}.meta.json`);
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
    ...CAT_QUALIDADE,
  };
  const r = await fetch(`${API}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insert ${slug}: ${r.status} ${await r.text()}`);
  const created = await r.json();
  console.log(`  criado: ${slug} id=${created[0]?.id || "?"}`);
}

async function patchPost(slug, html, meta) {
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`;
  const antes = await (await fetch(`${q}&select=slug,title,tldr,content,faq,seo_title,seo_description`, { headers: H })).json();
  if (!antes.length) throw new Error(`post sumiu: ${slug}`);
  const dia = new Date().toISOString().slice(0, 10);
  const bk = path.join(postsDir(), `../backup/${slug}-antes-${dia}.json`);
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

for (const slug of SLUGS) {
  console.log(`\n--- ${slug} ---`);
  const { html, meta } = loadSlug(slug);
  const existing = await fetchPost(slug);
  if (!existing) await insertPost(slug, html, meta);
  else await patchPost(slug, html, meta);
}

console.log("\nConcluído. Próximo: rebuild (CMS ou npm run build + deploy).");
