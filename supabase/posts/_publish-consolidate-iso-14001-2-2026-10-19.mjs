#!/usr/bin/env node
/** Consolida ISO 14001: legado iso-14001-2 → rascunho (canônico /iso-14001/ + 301). */
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

const CANONICAL = "iso-14001";
const LEGADO = "iso-14001-2";

async function publishSlug(slug) {
  const htmlPath = path.join(AQUI, `${slug}.html`);
  if (!existsSync(htmlPath)) {
    console.warn("skip", slug, "sem html");
    return;
  }
  const html = readFileSync(htmlPath, "utf8");
  const mp = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id,status`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  const campos = {
    content: html,
    revised_at: new Date().toISOString(),
    status: "published",
    canonical_url: `https://certificacaoiso.com.br/${slug}/`,
  };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  if (!rows.length) {
    console.warn(slug, "nao existe no Supabase");
    return;
  }
  const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${rows[0].id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(slug, "published", r.status, "was", rows[0].status);
}

async function draftLegado() {
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(LEGADO)}&select=id,status`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  if (!rows.length) {
    console.log(LEGADO, "nao encontrado (ok)");
    return;
  }
  const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${rows[0].id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify({
      status: "draft",
      revised_at: new Date().toISOString(),
      canonical_url: `https://certificacaoiso.com.br/${CANONICAL}/`,
    }),
  });
  console.log(LEGADO, "→ draft", r.status, "was", rows[0].status);
}

await publishSlug(CANONICAL);
await draftLegado();
