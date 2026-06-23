// Importa os comentários históricos do WordPress (export WXR) → blog_templum_comments.
// Usa a SERVICE_ROLE (bypassa RLS p/ inserir como 'approved') vinda de env — NUNCA commitar:
//   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node supabase/import-comments.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!URL || !KEY) { console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_KEY"); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const XML = path.resolve(__dirname, "../../blog-certificacaoiso/certificaoiso.WordPress.2026-06-22.xml");

const cdata = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1].trim() : "";
};

console.log("Lendo XML…");
const xml = fs.readFileSync(XML, "utf8");

// 1) mapa slug → comentários
const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
const rows = []; // {slug, author, email, content, date}
let totalComments = 0;
for (const item of items) {
  const type = cdata(item, "wp:post_type");
  if (type && type !== "post") continue;
  const slug = cdata(item, "wp:post_name");
  if (!slug) continue;
  const comments = item.match(/<wp:comment>[\s\S]*?<\/wp:comment>/g) || [];
  for (const c of comments) {
    totalComments++;
    if (cdata(c, "wp:comment_approved") !== "1") continue;          // só aprovados
    const ct = cdata(c, "wp:comment_type"); if (ct && ct !== "comment") continue; // ignora pingback/trackback
    const content = cdata(c, "wp:comment_content");
    if (!content) continue;
    rows.push({
      slug,
      author: cdata(c, "wp:comment_author") || "Visitante",
      email: cdata(c, "wp:comment_author_email") || null,
      content,
      date: (cdata(c, "wp:comment_date_gmt") || cdata(c, "wp:comment_date") || "").replace(" ", "T") + "Z",
    });
  }
}
console.log(`Comentários no XML: ${totalComments} | aprovados+válidos: ${rows.length}`);

// 2) mapa slug → post_id (só posts publicados existentes no Supabase)
console.log("Buscando posts no Supabase…");
const slugToId = new Map();
for (let from = 0; ; from += 1000) {
  const r = await fetch(`${URL}/rest/v1/blog_templum_posts?select=id,slug`, { headers: { ...H, Range: `${from}-${from + 999}` } });
  const batch = await r.json();
  batch.forEach((p) => slugToId.set(p.slug, p.id));
  if (batch.length < 1000) break;
}
console.log(`Posts no Supabase: ${slugToId.size}`);

// 3) guarda contra rodar 2x
const cnt = await fetch(`${URL}/rest/v1/blog_templum_comments?select=id`, { headers: { ...H, Range: "0-0", Prefer: "count=exact" } });
const existing = +(cnt.headers.get("content-range") || "*/0").split("/")[1] || 0;
if (existing > 0 && process.env.FORCE !== "1") {
  console.error(`Já existem ${existing} comentários. Rode com FORCE=1 p/ inserir mesmo assim.`); process.exit(1);
}

// 4) monta linhas com post_id (descarta comentário de post inexistente)
const payload = rows
  .filter((r) => slugToId.has(r.slug))
  .map((r) => ({ post_id: slugToId.get(r.slug), author_name: r.author.slice(0, 200), author_email: r.email, content: r.content, status: "approved", created_at: r.date }));
const semPost = rows.length - payload.length;
console.log(`A inserir: ${payload.length} | descartados (post não migrado): ${semPost}`);

// 5) insere em lotes
let ok = 0;
for (let i = 0; i < payload.length; i += 500) {
  const chunk = payload.slice(i, i + 500);
  const r = await fetch(`${URL}/rest/v1/blog_templum_comments`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(chunk) });
  if (!r.ok) { console.error(`Lote ${i}: ${r.status} ${(await r.text()).slice(0, 200)}`); process.exit(1); }
  ok += chunk.length; console.log(`  ${ok}/${payload.length}`);
}
console.log(`✓ ${ok} comentários importados como 'approved'.`);
