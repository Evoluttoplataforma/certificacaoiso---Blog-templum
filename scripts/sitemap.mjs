import fs from "node:fs";
import path from "node:path";
const SITE = "https://certificacaoiso.com.br";
const DIST = "dist";

// 1) Mapa slug → lastmod, lido do SUPABASE (mesma fonte do build).
// Antes isto lia o frontmatter de src/content/blog/*.md — 1.015 arquivos LEGADOS de antes da
// migração pro Supabase. O lastmod ficava congelado (o /iso-9001/ apontava jan/2025) e não
// refletia nada do conteúdo realmente servido.
// Usa revised_at (revisão curada) || published_at — NÃO updated_at, que o trigger toca em
// qualquer UPDATE e deixaria centenas de posts com o mesmo lastmod.
const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const SB_ANON = process.env.SUPABASE_ANON_KEY || "sb_publishable_Yfg9Ts5WRqD4Gc3jeWAS2A_-YWZrtiQ";

const lastmod = {};
try {
  // Paginado com Range (mesmo padrão de src/lib/posts.js): o PostgREST corta em 1000 linhas
  // por default e já são 1.007 posts publicados — sem isto, os últimos ficam sem lastmod.
  const size = 1000;
  for (let from = 0; ; from += size) {
    const r = await fetch(
      `${SB_URL}/rest/v1/blog_templum_posts?status=eq.published&select=slug,published_at,revised_at`,
      { headers: { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}`, Range: `${from}-${from + size - 1}` } },
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const batch = await r.json();
    for (const p of batch) {
      const d = p.revised_at || p.published_at;
      if (d) lastmod[`/${p.slug}/`] = new Date(d).toISOString().slice(0, 10);
    }
    if (batch.length < size) break;
  }
} catch (e) {
  // Sem lastmod o sitemap continua válido — melhor isso que quebrar o build ou publicar data errada.
  console.warn(`sitemap: falhou ao ler datas do Supabase (${e.message}) — segue sem lastmod`);
}

// 2) Varre o dist e monta o sitemap.
const urls = [];
function walk(dir, base = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name), base + "/" + e.name);
    else if (e.name === "index.html") {
      let u = (base || "/") + "/";
      u = u.replace(/\/+/g, "/");
      if (!/\/(404|admin)\//.test(u)) urls.push(u === "//" ? "/" : u);
    }
  }
}
walk(DIST);

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...new Set(urls)].sort().map((u) => {
    const lm = lastmod[u];
    return `  <url><loc>${SITE}${u}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ""}</url>`;
  }).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml);
console.log("sitemap.xml:", new Set(urls).size, "URLs ·", Object.keys(lastmod).length, "com lastmod");
