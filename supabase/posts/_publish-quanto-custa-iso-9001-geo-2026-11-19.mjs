#!/usr/bin/env node
/** Reforço GEO quanto-custa-iso-9001 (19/nov/2026) → Supabase PATCH. */
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
const slug = "quanto-custa-iso-9001";
const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
const meta = JSON.parse(readFileSync(path.join(AQUI, `${slug}.meta.json`), "utf8"));
const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`;
const rows = await fetch(q, { headers: H }).then((r) => r.json());
if (!rows.length) {
  console.error(slug, "nao existe no Supabase");
  process.exit(1);
}
const campos = {
  content: html,
  revised_at: new Date().toISOString(),
  title: meta.title,
  tldr: meta.tldr,
  seo_title: meta.seo_title,
  seo_description: meta.seo_description,
  faq: meta.faq,
};
const r = await fetch(q, {
  method: "PATCH",
  headers: { ...H, Prefer: "return=minimal" },
  body: JSON.stringify(campos),
});
console.log(slug, r.ok ? "ok" : "fail", r.status, "chars", html.length);
