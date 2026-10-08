#!/usr/bin/env node
/** Builders cluster 27701 + patch Supabase. node supabase/posts/_publish-27701-geo-fase3.mjs */
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

for (const script of [
  "_build-iso-27701-hub-geo-full.mjs",
  "_build-27701-cluster-geo.mjs",
  "_build-certificacao-27701-geo.mjs",
]) {
  const r = spawnSync(process.execPath, [path.join(AQUI, script)], { stdio: "inherit", cwd: AQUI });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const KEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const SLUGS = [
  "iso-27701-2025-o-que-muda-independencia-da-iso-27001",
  "certificacao-iso-27701-etapas-e-requisitos",
  "como-implementar-a-iso-27701",
  "iso-27701-lgpd-gdpr-conformidade",
  "consultoria-iso-27701",
  "qual-a-relacao-da-iso-27001-com-a-iso-27701",
];
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

function load(slug) {
  const html = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const metaPath = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
  return { html, meta };
}

async function patch(slug, html, meta) {
  const q = `${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`;
  const antes = await (await fetch(`${q}&select=*`, { headers: H })).json();
  if (!antes.length) throw new Error(`missing ${slug}`);
  writeFileSync(
    path.join(AQUI, "..", "backup", `${slug}-antes-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify(antes[0], null, 2),
  );
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "tags"])
    if (meta[k] !== undefined) campos[k] = meta[k];
  const r = await fetch(q, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(campos) });
  if (!r.ok) throw new Error(`patch ${slug}: ${await r.text()}`);
  console.log("aplicado", slug);
}

for (const slug of SLUGS) {
  const { html, meta } = load(slug);
  await patch(slug, html, meta);
}
console.log("Concluído fase 3 ISO 27701 GEO.");
