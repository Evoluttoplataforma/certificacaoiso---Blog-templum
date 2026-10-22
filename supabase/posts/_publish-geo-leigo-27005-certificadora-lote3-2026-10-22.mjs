#!/usr/bin/env node
/** Lote 3 GEO: ISO/IEC 27005 (novo) + certificadora transversal (22/out/2026) → Supabase. */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SLUGS_PATCH = [
  "como-escolher-consultoria-iso",
  "iso-27001",
  "como-implementar-a-iso-27001",
  "certificacao-iso-27001-etapas-prazo-custo",
];
const SLUG_INSERT = "iso-iec-27005-gestao-riscos-seguranca-informacao";
const CAT_ID = "73d8e99d-517b-41c2-8c2e-8f9229355ceb";
const CAT_NAME = "Segurança e Compliance";

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

async function upsertSlug(slug, insertIfMissing) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const metaPath = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const rows = await fetch(`${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`, {
    headers: H,
  }).then((r) => r.json());

  const campos = {
    content: html,
    revised_at: new Date().toISOString(),
  };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at", "tags"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  if (meta.seo_description) campos.excerpt = meta.seo_description.slice(0, 280);
  if (insertIfMissing) {
    campos.status = "published";
    campos.category_id = CAT_ID;
    campos.category_name = CAT_NAME;
    campos.canonical_url = `https://certificacaoiso.com.br/${slug}/`;
    campos.reading_time_min = Math.max(1, Math.round(words / 230));
  }

  if (rows.length) {
    const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${rows[0].id}`, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify(campos),
    });
    console.log(slug, r.ok ? "patch ok" : "patch fail", r.status);
    return;
  }
  if (!insertIfMissing) {
    console.warn(slug, "nao existe no Supabase");
    return;
  }
  const row = {
    slug,
    author_name: "Daniela Albuquerque",
    ...campos,
    published_at: meta.published_at || new Date().toISOString(),
  };
  const r = await fetch(`${API}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: { ...H, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  const j = await r.json();
  console.log(slug, "insert", r.status, j[0]?.id || j);
}

for (const slug of SLUGS_PATCH) {
  await upsertSlug(slug, false);
}
await upsertSlug(SLUG_INSERT, true);
