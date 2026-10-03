import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
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
    if (!process.env[k]) process.env[k] = v;
  }
}
const SB = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
const slug = "ozempic-mentira-gestao-de-processos";
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const url = `https://app.templum.com.br/register?utm_source=blog&utm_medium=link-contextual&utm_campaign=${slug}`;

const res = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${slug}&select=content`, { headers: H });
const [row] = await res.json();
let c = row.content;
c = c.replace(
  /Orbit Gest[aã]o, dispon[ií]vel em orbitgestao\.com\.br/gi,
  `Templum OS, disponível em <a href="${url}" rel="noopener noreferrer" target="_blank">app.templum.com.br</a>`,
);
await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${slug}`, {
  method: "PATCH",
  headers: { ...H, "Content-Type": "application/json" },
  body: JSON.stringify({ content: c, revised_at: new Date().toISOString() }),
});
console.log("ok");
