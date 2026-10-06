import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const envPath = path.join(root, ".env");
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
const slugs = process.argv.slice(2);
if (!KEY || !slugs.length) {
  console.error("uso: node supabase/posts/_export-slugs.mjs <slug> ...");
  process.exit(1);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const dia = new Date().toISOString().slice(0, 10);

for (const slug of slugs) {
  const u = `${API}/rest/v1/blog_templum_posts?slug=eq.${slug}&select=slug,title,tldr,content,faq,seo_title,seo_description`;
  const j = await (await fetch(u, { headers: H })).json();
  if (!j[0]) {
    console.error("missing", slug);
    continue;
  }
  const out = path.join(root, "supabase/backup", `${slug}-export-${dia}.json`);
  writeFileSync(out, JSON.stringify(j[0], null, 1));
  console.log(slug, j[0].content.length, "bytes", "->", out);
}
