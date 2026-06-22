// Migração WordPress (WXR) → Astro content collection (markdown).
// Lê o export, converte o HTML dos posts em markdown (turndown), preserva
// slug/autor/data/categorias/imagem destacada. NÃO perde nada: relatório no fim.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WXR = path.resolve(ROOT, "../blog-certificacaoiso/certificaoiso.WordPress.2026-06-22.xml");
const OUT = path.resolve(ROOT, "src/content/blog");
const STAGING = /https?:\/\/9b1f63b4dc1b9cdf2da88\.admin\.hardypress\.com/g;
const LIVE = "https://certificacaoiso.com.br";

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
td.use(gfm);
// preserva <figure>/<iframe> (vídeos) como HTML, não tenta converter
td.keep(["iframe"]);

const xml = fs.readFileSync(WXR, "utf-8");

function decode(s) {
  return (s || "")
    .replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");
}
function tag(block, name) {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? m[1] : "";
}

// 1) Mapa de autores (login → nome de exibição)
const authors = {};
for (const a of xml.matchAll(/<wp:author>([\s\S]*?)<\/wp:author>/g)) {
  const login = decode(tag(a[1], "wp:author_login")).trim();
  const name = decode(tag(a[1], "wp:author_display_name")).trim();
  if (login) authors[login] = name || login;
}

// 2) Itens
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

// 3) Mapa de attachments (post_id → url) p/ resolver imagem destacada
const attByService = {};
for (const it of items) {
  if (!it.includes("<wp:post_type><![CDATA[attachment]]>")) continue;
  const id = decode(tag(it, "wp:post_id")).trim();
  let url = decode(tag(it, "wp:attachment_url")).trim() || decode(tag(it, "guid")).trim();
  if (id && url) attByService[id] = url.replace(STAGING, LIVE);
}

function frontmatterString(v) {
  // YAML seguro: aspas duplas com escape
  return '"' + String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}
function slugify(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let ok = 0, skipped = 0, noContent = 0;
const slugSeen = new Set();
const report = [];

for (const it of items) {
  if (!it.includes("<wp:post_type><![CDATA[post]]>")) continue;
  if (!it.includes("<wp:status><![CDATA[publish]]>")) continue;

  const title = decode(tag(it, "title")).trim();
  let slug = decode(tag(it, "wp:post_name")).trim() || slugify(title);
  slug = slug.replace(/^\/+|\/+$/g, "");
  if (!slug) { skipped++; continue; }
  while (slugSeen.has(slug)) slug = slug + "-2";
  slugSeen.add(slug);

  const wpId = parseInt(decode(tag(it, "wp:post_id")).trim() || "0", 10);
  const date = decode(tag(it, "wp:post_date")).trim();
  const modified = decode(tag(it, "wp:post_modified")).trim();
  const login = decode(tag(it, "dc:creator")).trim();
  const author = authors[login] || "Equipe Templum";
  const excerpt = decode(tag(it, "excerpt:encoded")).replace(/<[^>]+>/g, "").trim();
  const cats = [...it.matchAll(/domain="category"[^>]*><!\[CDATA\[(.*?)\]\]>/g)].map((m) => m[1])
    .filter((c) => c && c !== "Uncategorized");

  // imagem destacada via _thumbnail_id
  let hero = "";
  const metas = [...it.matchAll(/<wp:postmeta>([\s\S]*?)<\/wp:postmeta>/g)].map((m) => m[1]);
  for (const mt of metas) {
    if (decode(tag(mt, "wp:meta_key")).trim() === "_thumbnail_id") {
      const tid = decode(tag(mt, "wp:meta_value")).trim();
      if (attByService[tid]) hero = attByService[tid];
    }
  }

  // conteúdo: HTML Gutenberg → markdown
  let html = decode(tag(it, "content:encoded"));
  html = html.replace(/<!--\s*\/?wp:[^>]*-->/g, ""); // tira comentários de bloco do Gutenberg
  html = html.replace(STAGING, LIVE);
  let md = "";
  try { md = td.turndown(html).trim(); } catch (e) { md = html; }
  if (!md) noContent++;

  // Banners (imagens linkadas) → CTA pro form da Templum, COM a referência da
  // página (utm_campaign = slug do artigo). Assim o lead é atribuído ao artigo.
  const formCta = `https://templum.com.br/form?utm_source=blog&utm_medium=banner-artigo&utm_campaign=${encodeURIComponent(slug)}`;
  md = md.replace(/(\[!\[[^\]]*\]\([^)]*\)\])\([^)]*\)/g, `$1(${formCta})`);

  const desc = excerpt || md.replace(/[#>*_`\[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 155);

  const fm = [
    "---",
    `title: ${frontmatterString(title)}`,
    `description: ${frontmatterString(desc)}`,
    `pubDate: ${date ? new Date(date.replace(" ", "T") + "Z").toISOString() : new Date().toISOString()}`,
    modified && modified !== date ? `updatedDate: ${new Date(modified.replace(" ", "T") + "Z").toISOString()}` : null,
    `author: ${frontmatterString(author)}`,
    `categories: [${cats.map(frontmatterString).join(", ")}]`,
    hero ? `heroImage: ${frontmatterString(hero)}` : null,
    `wpId: ${wpId}`,
    "draft: false",
    "---",
    "",
    md,
    "",
  ].filter((l) => l !== null).join("\n");

  fs.writeFileSync(path.join(OUT, `${slug}.md`), fm, "utf-8");
  ok++;
  report.push({ slug, title, cats: cats.join("|"), hero: !!hero });
}

console.log(`\n=== MIGRAÇÃO CONCLUÍDA ===`);
console.log(`posts migrados: ${ok}`);
console.log(`pulados (sem slug): ${skipped}`);
console.log(`sem conteúdo: ${noContent}`);
console.log(`autores mapeados: ${Object.keys(authors).length} → ${Object.values(authors).join(", ")}`);
console.log(`com imagem destacada: ${report.filter((r) => r.hero).length}/${ok}`);
fs.writeFileSync(path.resolve(ROOT, "scripts/migration-report.json"), JSON.stringify(report, null, 2));
console.log(`relatório: scripts/migration-report.json`);
