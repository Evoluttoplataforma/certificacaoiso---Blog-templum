#!/usr/bin/env node
/** node supabase/posts/_publish-gsc-snippet-10.mjs — title/seo GSC CTR batch */
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

const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const SLUGS = [
  "iso-9001",
  "5s",
  "diferencas-entre-programa-5s-housekeeping",
  "passo-a-passo-certificacao-iso-9001",
  "quanto-custa-iso-9001",
  "iso-9001-requisitos-7-5-informacao-documentada",
  "instrucao-de-trabalho-it",
  "iso-14001-2",
  "calibracao-tudo-o-que-voce-precisa-saber",
  "iso-17025",
];

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

for (const slug of SLUGS) {
  const metaPath = path.join(AQUI, `${slug}.meta.json`);
  if (!existsSync(metaPath)) throw new Error(`sem meta: ${slug}`);
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  const q = `${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`;
  const antes = await (await fetch(`${q}&select=slug,title,seo_title,seo_description,excerpt`, { headers: H })).json();
  if (!antes.length) throw new Error(`missing ${slug}`);
  writeFileSync(
    path.join(AQUI, "..", "backup", `${slug}-antes-gsc-snippet-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify(antes[0], null, 2)
  );
  const campos = { revised_at: new Date().toISOString() };
  if (meta.title) campos.title = meta.title;
  if (meta.seo_title) campos.seo_title = meta.seo_title;
  if (meta.seo_description) {
    campos.seo_description = meta.seo_description;
    campos.excerpt = meta.seo_description.slice(0, 280);
  }
  const r = await fetch(q, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(campos) });
  if (!r.ok) throw new Error(`patch ${slug}: ${await r.text()}`);
  console.log("aplicado", slug);
}
console.log("Concluído.");
