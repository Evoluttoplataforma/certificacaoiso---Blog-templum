// Importa os 1.015 markdown → blog_templum_posts (+ categorias) no Supabase.
// Converte markdown → HTML (editor do CMS é HTML) e preserva o linkbuilding do
// orbitgestao. Usa a SERVICE_ROLE (bypassa RLS) vinda de env — NUNCA commitar:
//   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node supabase/import.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { categorias, slugify } from "../src/data/categorias.js";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!URL || !KEY) { console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_KEY"); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG = path.resolve(__dirname, "../src/content/blog");

async function rest(method, table, body, params = "") {
  const r = await fetch(`${URL}/rest/v1/${table}${params}`, {
    method, headers: { ...H, Prefer: "resolution=merge-duplicates,return=representation" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`${method} ${table} ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

// --- linkbuilding orbitgestao no markdown (1 link/artigo, fora de título/link) ---
const ORBIT = "https://orbitgestao.com.br/?utm_source=blog&utm_medium=link-contextual";
const TARGETS = [/\bgest[ãa]o de processos\b/i, /\bmapeamento de processos\b/i, /\bgest[ãa]o da qualidade\b/i, /\bindicadores de desempenho\b/i, /\bgest[ãa]o estrat[ée]gica\b/i, /\bprodutividade\b/i, /\blideran[çc]a\b/i, /\bgest[ãa]o\b/i];
function orbitize(md, slug) {
  const url = `${ORBIT}&utm_campaign=${encodeURIComponent(slug)}`;
  const lines = md.split("\n"); let done = false;
  for (let i = 0; i < lines.length && !done; i++) {
    const l = lines[i];
    if (/^\s{0,3}#/.test(l) || /^\s*$/.test(l) || /\]\(/.test(l) || /^\s*[-*>|]/.test(l) || /^\s*!?\[/.test(l)) continue;
    for (const re of TARGETS) {
      const m = l.match(re);
      if (m) { lines[i] = l.slice(0, m.index) + `[${m[0]}](${url})` + l.slice(m.index + m[0].length); done = true; break; }
    }
  }
  return lines.join("\n");
}

// --- links internos absolutos → relativos (+ 4 órfãos), igual ao build ---
const REDIRECTS = {
  "/precos": "https://templum.com.br/form?utm_source=blog&utm_medium=organico",
  "/certificacast": "https://templum.com.br",
  "/elemento-planejamento-estrategico": "/elementos-planejamento-estrategico/",
  "/planejamento-estrategico": "/como-fazer-planejamento-estrategico/",
};
function relLink(p) {
  const m = (p || "/").match(/^([^?#]*)([?#].*)?$/); let path = m[1] || "/"; const tail = m[2] || "";
  if (!path.startsWith("/")) path = "/" + path;
  const key = path.replace(/\/+$/, "");
  if (REDIRECTS[key]) return REDIRECTS[key];
  if (!/\.[a-z0-9]+$/i.test(path) && !path.endsWith("/")) path += "/";
  return path + tail;
}
function relativize(html) {
  return html.replace(/(<a\b[^>]*\bhref=")https?:\/\/certificacaoiso\.com\.br([^"]*)(")/gi, (_m, a, p, c) => a + relLink(p) + c);
}

// 1) Categorias
const catRows = categorias.map((c, i) => ({ name: c.nome, slug: c.slug, color: c.cor, icon: c.icon, sort_order: i }));
const cats = await rest("POST", "blog_templum_categories?on_conflict=slug", catRows);
const catId = {}; for (const c of cats) catId[c.slug] = c.id;
console.log(`categorias: ${cats.length}`);

// 2) Posts (markdown → HTML)
const files = fs.readdirSync(BLOG).filter((f) => f.endsWith(".md"));
const rows = [];
for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const { data: d, content } = matter(fs.readFileSync(path.join(BLOG, f), "utf8"));
  const md = orbitize(content, slug);
  const html = relativize(marked.parse(md, { mangle: false, headerIds: false }));
  const cat0 = (d.categories && d.categories[0]) || "";
  const wc = content ? content.replace(/[#>*_`\[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length : 0;
  rows.push({
    title: d.title, slug, content: html,
    excerpt: d.description || null, tldr: d.tldr || null, faq: d.faq || [],
    featured_image: d.heroImage || null, author_name: d.author || "Equipe Templum",
    category_id: cat0 ? (catId[slugify(cat0)] || null) : null, category_name: cat0 || null,
    tags: (d.categories || []).slice(1),
    status: d.draft ? "draft" : "published",
    published_at: d.pubDate ? new Date(d.pubDate).toISOString() : null,
    seo_title: d.seoTitle || null, seo_description: d.seoDescription || null,
    seo_keywords: d.keywords || [], og_image: d.ogImage || null,
    reading_time_min: Math.max(1, Math.round(wc / 200)), wp_id: d.wpId || null,
    updated_at: d.updatedDate ? new Date(d.updatedDate).toISOString() : (d.pubDate ? new Date(d.pubDate).toISOString() : null),
  });
}

// 3) Insere em lotes (upsert por slug)
let ok = 0;
for (let i = 0; i < rows.length; i += 100) {
  const res = await rest("POST", "blog_templum_posts?on_conflict=slug", rows.slice(i, i + 100));
  ok += res.length; console.log(`  ${ok}/${rows.length}`);
}
console.log(`\n✅ posts importados: ${ok}`);
