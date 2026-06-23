// Camada de dados do blog — lê os posts do Supabase NO BUILD (não em runtime).
// Devolve no MESMO formato da antiga content collection ({ slug, data, content })
// pra os componentes (ArticleCard, Sidebar) não precisarem mudar.
// Keys públicas (anon, RLS protege). Fallback embutido p/ não depender de env.
const SB_URL = import.meta.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const SB_ANON = import.meta.env.SUPABASE_ANON_KEY || "sb_publishable_Yfg9Ts5WRqD4Gc3jeWAS2A_-YWZrtiQ";
const H = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

// Trecho único a partir do conteúdo (fallback de descrição quando não há excerpt).
function snippetFrom(html) {
  const txt = (html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
  if (!txt) return "";
  if (txt.length <= 155) return txt;
  const cut = txt.slice(0, 155);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

// Otimização AIEO/GEO do conteúdo (no build, p/ todos os posts):
// 1) hierarquia de heading: desloca p/ o nível mais raso virar h2 (o título da página é o h1)
// 2) âncoras sem texto (vazias ou só com <img>) ganham aria-label
// 3) âncoras genéricas ("clique aqui"…) p/ a Templum viram texto descritivo
function processContent(html) {
  if (!html) return "";
  let out = html;

  // 1) heading hierarchy
  const levels = [...out.matchAll(/<h([1-6])\b/gi)].map((m) => +m[1]);
  if (levels.length) {
    const shift = Math.min(...levels) - 2; // queremos o mais raso = 2
    if (shift !== 0) {
      out = out.replace(/<(\/?)h([1-6])\b/gi, (m, slash, n) => {
        const lvl = Math.max(2, Math.min(6, Number(n) - shift));
        return `<${slash}h${lvl}`;
      });
    }
  }

  // 2) âncoras sem texto ÚTIL (vazias, só-imagem, ou texto = URL crua) → texto/aria-label descritivo
  out = out.replace(/<a\b([^>]*?)>([\s\S]*?)<\/a>/gi, (m, attrs, inner) => {
    const href = (attrs.match(/\bhref\s*=\s*"([^"]*)"/i) || [])[1] || "";
    const text = inner.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, " ").trim();
    const hasImg = /<img\b/i.test(inner);
    const isUrlText = !text || /^(https?:\/\/|www\.)\S+$/i.test(text) || (href && text === href);
    if (!isUrlText) return m; // já tem texto descritivo → não mexe
    const dom = ((href.match(/^https?:\/\/(?:www\.)?([^/]+)/i) || [])[1] || "").replace(/"/g, "");
    let label;
    if (/youtube|youtu\.be/i.test(href)) label = "Assistir ao vídeo no YouTube";
    else if (/templum\.com\.br/i.test(href)) label = "Conheça a consultoria da Templum";
    else if (dom) label = "Acessar " + dom;
    else return m;
    if (hasImg) { // imagem (com/sem texto) → preserva, adiciona aria-label
      if (/aria-label\s*=/i.test(attrs)) return m;
      return `<a${attrs} aria-label="${label}">${inner}</a>`;
    }
    return `<a${attrs}>${label}</a>`; // texto = URL crua/vazio → vira texto descritivo
  });

  // 3) anchor text genérico → descritivo (apenas links Templum, p/ não desvirtuar)
  out = out.replace(/(<a\b[^>]*href="[^"]*templum\.com\.br[^"]*"[^>]*>)(\s*)(clique aqui|saiba mais|leia mais|veja aqui|acesse aqui|confira aqui|veja mais|aqui)(\s*)(<\/a>)/gi,
    (m, open, s1, _t, s2, close) => `${open}${s1}Conheça a consultoria da Templum${s2}${close}`);

  return out;
}

function normalize(p) {
  return {
    id: p.id,
    slug: p.slug,
    content: processContent(p.content || ""),
    data: {
      title: p.title,
      description: (p.excerpt && p.excerpt.trim()) || snippetFrom(p.content),
      heroImage: p.featured_image || undefined,
      author: p.author_name || "Equipe Templum",
      pubDate: p.published_at ? new Date(p.published_at) : new Date(),
      updatedDate: p.updated_at ? new Date(p.updated_at) : undefined,
      categories: [p.category_name, ...(p.tags || [])].filter(Boolean),
      tldr: p.tldr || undefined,
      faq: p.faq || [],
      seoTitle: p.seo_title || undefined,
      seoDescription: p.seo_description || undefined,
      keywords: p.seo_keywords || [],
      ogImage: p.og_image || undefined,
      readingTime: p.reading_time_min || undefined,
    },
  };
}

let _cache = null;

// Todos os posts publicados (paginado, memoizado).
export async function getAllPosts() {
  if (_cache) return _cache;
  const all = [];
  let from = 0;
  const size = 1000;
  for (;;) {
    const r = await fetch(
      `${SB_URL}/rest/v1/blog_templum_posts?status=eq.published&select=*&order=published_at.desc`,
      { headers: { ...H, Range: `${from}-${from + size - 1}` } }
    );
    if (!r.ok) throw new Error("Supabase posts: " + r.status + " " + (await r.text()).slice(0, 200));
    const batch = await r.json();
    all.push(...batch);
    if (batch.length < size) break;
    from += size;
  }
  _cache = all.map(normalize);
  return _cache;
}

// --- Iscas (lead magnets / landing pages) ---
let _iscas = null;
export async function getAllIscas() {
  if (_iscas) return _iscas;
  const r = await fetch(
    `${SB_URL}/rest/v1/blog_templum_iscas?active=eq.true&select=*&order=segment,title`,
    { headers: H }
  );
  if (!r.ok) throw new Error("Supabase iscas: " + r.status + " " + (await r.text()).slice(0, 200));
  _iscas = await r.json();
  return _iscas;
}
export async function getIsca(slug) {
  const all = await getAllIscas();
  return all.find((i) => i.slug === slug) || null;
}

// Mapa categoria(norma) → isca destaque (definido no CMS: categories.isca_slug).
const DEFAULT_ISCA_SLUG = "ebook-empresarios";
let _iscaMap = null;
async function buildIscaMap() {
  if (_iscaMap) return _iscaMap;
  const [iscas, catsRes] = await Promise.all([
    getAllIscas(),
    fetch(`${SB_URL}/rest/v1/blog_templum_categories?select=name,isca_slug`, { headers: H }),
  ]);
  const cats = catsRes.ok ? await catsRes.json() : [];
  const bySlug = Object.fromEntries(iscas.map((i) => [i.slug, i]));
  const map = {};
  for (const c of cats) {
    const i = c.isca_slug && bySlug[c.isca_slug];
    if (i) map[c.name] = { slug: i.slug, titulo: i.title };
  }
  const d = bySlug[DEFAULT_ISCA_SLUG] || iscas[0];
  _iscaMap = { map, default: d ? { slug: d.slug, titulo: d.title } : null };
  return _iscaMap;
}
// Isca relevante p/ as categorias do artigo (cai no default se nenhuma mapeada).
export async function getIscaForCategories(categories) {
  const { map, default: def } = await buildIscaMap();
  for (const c of categories || []) if (map[c]) return map[c];
  return def;
}

// "Resposta rápida": usa o tldr; senão extrai a 1ª frase do HTML.
export function tldrOf(post) {
  if (post.data.tldr) return post.data.tldr;
  const txt = (post.content || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
  if (!txt) return post.data.description || "";
  if (txt.length <= 320) return txt;
  const slice = txt.slice(0, 320);
  const end = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  return end > 140 ? slice.slice(0, end + 1) : slice.slice(0, slice.lastIndexOf(" ")) + "…";
}
