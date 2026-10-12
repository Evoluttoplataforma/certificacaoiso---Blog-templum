#!/usr/bin/env node
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

const SLUGS = [
  "iso-27001",
  "certificacao-iso-27001-etapas-prazo-custo",
  "quanto-custa-iso-27001",
  "requisitos-da-iso-27001",
  "como-implementar-a-iso-27001",
  "auditoria-iso-27001",
  "consultoria-iso-27001",
  "iso-27701-2025-o-que-muda-independencia-da-iso-27001",
  "certificacao-iso-27701-etapas-e-requisitos",
  "quanto-custa-iso-27701",
  "como-implementar-a-iso-27701",
  "consultoria-iso-27701",
  "relacao-do-lgpd-com-a-iso-27001",
  "qual-a-relacao-da-iso-27001-com-a-iso-27701",
];

for (const slug of SLUGS) {
  const htmlPath = path.join(AQUI, `${slug}.html`);
  if (!existsSync(htmlPath)) {
    console.warn("skip", slug);
    continue;
  }
  const html = readFileSync(htmlPath, "utf8");
  const mp = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  if (!rows.length) {
    console.warn(slug, "nao no Supabase");
    continue;
  }
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  const r = await fetch(q, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(slug, r.status);
}

console.log("Lote 27001/27701 publicado");
