import fs from "node:fs";
import path from "node:path";
const SITE = "https://certificacaoiso.com.br";
const DIST = "dist";
const BLOG = "src/content/blog";

// 1) Mapa slug → lastmod (updatedDate || pubDate) lendo o frontmatter dos posts.
const lastmod = {};
if (fs.existsSync(BLOG)) {
  for (const f of fs.readdirSync(BLOG)) {
    if (!f.endsWith(".md")) continue;
    const slug = f.replace(/\.md$/, "");
    const src = fs.readFileSync(path.join(BLOG, f), "utf-8");
    const fm = src.slice(0, src.indexOf("\n---", 3));
    const pub = (fm.match(/^pubDate:\s*(.+)$/m) || [])[1];
    const upd = (fm.match(/^updatedDate:\s*(.+)$/m) || [])[1];
    const d = (upd || pub || "").trim();
    if (d) lastmod[`/${slug}/`] = new Date(d).toISOString().slice(0, 10);
  }
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
