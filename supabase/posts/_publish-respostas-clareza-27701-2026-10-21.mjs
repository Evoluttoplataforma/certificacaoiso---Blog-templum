#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SLUGS = [
  "certificacao-iso-27701-etapas-e-requisitos",
  "como-implementar-a-iso-27701",
  "quanto-custa-iso-27701",
  "iso-27701-lgpd-gdpr-conformidade",
  "qual-a-relacao-da-iso-27001-com-a-iso-27701",
];
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
for (const slug of SLUGS) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const rows = await fetch(`${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`, {
    headers: H,
  }).then((r) => r.json());
  if (!rows.length) {
    console.warn("skip", slug);
    continue;
  }
  const campos = {
    content: html,
    revised_at: new Date().toISOString(),
    reading_time_min: Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 230)),
  };
  const r = await fetch(`${API}/rest/v1/blog_templum_posts?id=eq.${rows[0].id}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(slug, r.ok ? "patch ok" : "fail", r.status);
}
