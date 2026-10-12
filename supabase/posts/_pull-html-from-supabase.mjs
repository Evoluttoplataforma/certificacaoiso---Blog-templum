/** Grava posts/*.html a partir do Supabase (slug único ou lista). */
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

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("uso: node _pull-html-from-supabase.mjs <slug> ...");
  process.exit(1);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

for (const slug of slugs) {
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=slug,content,title,tldr,faq,seo_title,seo_description`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  if (!rows[0]?.content) {
    console.warn("skip", slug, "sem conteudo");
    continue;
  }
  writeFileSync(path.join(AQUI, `${slug}.html`), rows[0].content, "utf8");
  const meta = {};
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq"]) {
    if (rows[0][k] !== undefined && rows[0][k] !== null) meta[k] = rows[0][k];
  }
  writeFileSync(path.join(AQUI, `${slug}.meta.json`), JSON.stringify(meta, null, 2), "utf8");
  console.log("ok", slug, rows[0].content.length);
}
