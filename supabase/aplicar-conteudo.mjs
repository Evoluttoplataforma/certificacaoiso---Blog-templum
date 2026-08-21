// Aplica no Supabase um conteúdo versionado em supabase/posts/<slug>.html (+ .meta.json).
//
// Por que existe: o corpo dos posts mora no banco, mas post grande escrito à mão merece
// revisão em diff antes de virar produção — e merece poder voltar. Então o texto vive no
// repositório e este script é o que empurra. O .meta.json é opcional e aceita tldr,
// seo_title, seo_description e faq.
//
//   SUPABASE_SERVICE_KEY=... node supabase/aplicar-conteudo.mjs iso-9001
//   SUPABASE_SERVICE_KEY=... node supabase/aplicar-conteudo.mjs iso-9001 --dry
//
// Antes de sobrescrever, grava o estado atual em supabase/backup/<slug>-antes-<data>.json.
// Sem esse backup o script não continua: reescrita de post sem rollback não se faz.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

// `API` e não `URL`: const URL sombreia o construtor global e o script morre na
// primeira linha que usa new URL(). Custou um minuto; fica registrado.
const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
const slug = process.argv[2];
const dry = process.argv.includes("--dry");

if (!slug) { console.error("uso: node supabase/aplicar-conteudo.mjs <slug> [--dry]"); process.exit(1); }
if (!KEY && !dry) { console.error("falta SUPABASE_SERVICE_KEY no ambiente"); process.exit(1); }

const base = new URL("./posts/", import.meta.url);
const html = readFileSync(new URL(`${slug}.html`, base), "utf8");
const metaPath = new URL(`${slug}.meta.json`, base);
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};

const campos = { content: html };
for (const k of ["tldr", "seo_title", "seo_description", "faq"]) if (meta[k] !== undefined) campos[k] = meta[k];

const palavras = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(`${slug}: ${html.length} bytes · ${palavras} palavras · campos: ${Object.keys(campos).join(", ")}`);
if (dry) { console.log("--dry: nada foi enviado"); process.exit(0); }

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${slug}`;

const antes = await (await fetch(`${q}&select=slug,title,tldr,content,faq,seo_title,seo_description`, { headers: H })).json();
if (!antes.length) { console.error(`post ${slug} não encontrado`); process.exit(1); }
const dia = new Date().toISOString().slice(0, 10);
const bk = new URL(`../backup/${slug}-antes-${dia}.json`, base);
writeFileSync(bk, JSON.stringify(antes[0], null, 1));
console.log("backup:", bk.pathname);

const r = await fetch(q, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(campos) });
if (!r.ok) { console.error("falhou:", r.status, await r.text()); process.exit(1); }
console.log("aplicado. rebuild do blog é o próximo passo (npm run build + push, ou publicar pelo CMS).");
