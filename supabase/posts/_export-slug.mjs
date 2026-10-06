/** Export one post from Supabase to backup JSON. node supabase/posts/_export-slug.mjs <slug> */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const slug = process.argv[2];
if (!slug) {
  console.error("uso: node _export-slug.mjs <slug>");
  process.exit(1);
}
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
const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=slug,title,content,tldr,faq,seo_title,seo_description`;
const rows = await (await fetch(q, { headers: H })).json();
if (!rows[0]) {
  console.error("post não encontrado:", slug);
  process.exit(1);
}
const out = path.join(ROOT, "supabase", "backup", `${slug}-export-2026-10-06.json`);
writeFileSync(out, JSON.stringify(rows[0], null, 2));
console.log("ok", rows[0].title, rows[0].content.length, out);
