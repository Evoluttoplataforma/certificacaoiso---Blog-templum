// Camada de dados do blog — lê os posts do Supabase NO BUILD (não em runtime).
// Devolve no MESMO formato da antiga content collection ({ slug, data, content })
// pra os componentes (ArticleCard, Sidebar) não precisarem mudar.
// Keys públicas (anon, RLS protege). Fallback embutido p/ não depender de env.
const SB_URL = import.meta.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const SB_ANON = import.meta.env.SUPABASE_ANON_KEY || "sb_publishable_Yfg9Ts5WRqD4Gc3jeWAS2A_-YWZrtiQ";
const H = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

function normalize(p) {
  return {
    id: p.id,
    slug: p.slug,
    content: p.content || "",
    data: {
      title: p.title,
      description: p.excerpt || "",
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
