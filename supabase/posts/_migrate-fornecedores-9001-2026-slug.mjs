#!/usr/bin/env node
/** Migra slug legado a-qualificacao-de-fornecedores-segundo-a-iso-90012015 → qualificacao-de-fornecedores-iso-9001-2026-requisito-8-4 */
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

const OLD_SLUG = "a-qualificacao-de-fornecedores-segundo-a-iso-90012015";
const NEW_SLUG = "qualificacao-de-fornecedores-iso-9001-2026-requisito-8-4";

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const html = readFileSync(path.join(AQUI, `${NEW_SLUG}.html`), "utf8");
const meta = JSON.parse(readFileSync(path.join(AQUI, `${NEW_SLUG}.meta.json`), "utf8"));
const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const campos = {
  slug: NEW_SLUG,
  content: html,
  revised_at: new Date().toISOString(),
  canonical_url: `https://certificacaoiso.com.br/${NEW_SLUG}/`,
  title: meta.title,
  tldr: meta.tldr,
  seo_title: meta.seo_title,
  seo_description: meta.seo_description,
  faq: meta.faq,
  reading_time_min: Math.max(1, Math.round(words / 230)),
};

const qOld = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(OLD_SLUG)}&select=id,slug`;
const oldRows = await fetch(qOld, { headers: H }).then((r) => r.json());
const qNew = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(NEW_SLUG)}&select=id`;
const newRows = await fetch(qNew, { headers: H }).then((r) => r.json());

if (oldRows.length && !newRows.length) {
  const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${oldRows[0].id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log("migrate", OLD_SLUG, "→", NEW_SLUG, "patch id", oldRows[0].id, r.status);
} else if (newRows.length) {
  const r = await fetch(`${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(NEW_SLUG)}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(NEW_SLUG, "patch", r.status);
  if (oldRows.length) {
    const d = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${oldRows[0].id}`, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify({ status: "draft", revised_at: new Date().toISOString() }),
    });
    console.log(OLD_SLUG, "→ draft", d.status);
  }
} else {
  console.error("Post legado não encontrado:", OLD_SLUG);
  process.exit(1);
}

console.log("Migração fornecedores 2026 ok");
