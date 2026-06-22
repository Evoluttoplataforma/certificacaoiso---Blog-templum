// Importa os 1.015 markdown → blog_templum_posts (+ categorias) no Supabase.
// Usa a SERVICE_ROLE key (bypassa RLS). NUNCA commitar a key — vem de env:
//   SUPABASE_URL=https://yfpdrckyuxltvznqfqgh.supabase.co \
//   SUPABASE_SERVICE_KEY=<service_role> node supabase/import.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
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

// 1) Categorias (upsert por slug) → mapa nome→id
const catRows = categorias.map((c, i) => ({ name: c.nome, slug: c.slug, color: c.cor, icon: c.icon, sort_order: i }));
const cats = await rest("POST", "blog_templum_categories?on_conflict=slug", catRows);
const catId = {};
for (const c of cats) catId[c.slug] = c.id;
console.log(`categorias: ${cats.length}`);

// 2) Posts
const files = fs.readdirSync(BLOG).filter((f) => f.endsWith(".md"));
const rows = [];
for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const { data: d, content } = matter(fs.readFileSync(path.join(BLOG, f), "utf8"));
  const cat0 = (d.categories && d.categories[0]) || "";
  const wc = content ? content.replace(/[#>*_`\[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length : 0;
  rows.push({
    title: d.title, slug, content,
    excerpt: d.description || null,
    tldr: d.tldr || null,
    faq: d.faq || [],
    featured_image: d.heroImage || null,
    author_name: d.author || "Equipe Templum",
    category_id: cat0 ? (catId[slugify(cat0)] || null) : null,
    category_name: cat0 || null,
    tags: (d.categories || []).slice(1),
    status: d.draft ? "draft" : "published",
    published_at: d.pubDate ? new Date(d.pubDate).toISOString() : null,
    seo_title: d.seoTitle || null,
    seo_description: d.seoDescription || null,
    seo_keywords: d.keywords || [],
    og_image: d.ogImage || null,
    reading_time_min: Math.max(1, Math.round(wc / 200)),
    wp_id: d.wpId || null,
    updated_at: d.updatedDate ? new Date(d.updatedDate).toISOString() : (d.pubDate ? new Date(d.pubDate).toISOString() : null),
  });
}

// 3) Insere em lotes (upsert por slug)
let ok = 0;
for (let i = 0; i < rows.length; i += 100) {
  const batch = rows.slice(i, i + 100);
  const res = await rest("POST", "blog_templum_posts?on_conflict=slug", batch);
  ok += res.length;
  console.log(`  ${ok}/${rows.length}`);
}
console.log(`\n✅ posts importados: ${ok}`);
