// Camada de dados do blog — lê os posts do Supabase NO BUILD (não em runtime).
// Devolve no MESMO formato da antiga content collection ({ slug, data, content })
// pra os componentes (ArticleCard, Sidebar) não precisarem mudar.
// Keys públicas (anon, RLS protege). Fallback embutido p/ não depender de env.
import populares from "../data/populares.json";
import emAltaData from "../data/em-alta.json";

const SB_URL = import.meta.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const SB_ANON = import.meta.env.SUPABASE_ANON_KEY || "sb_publishable_Yfg9Ts5WRqD4Gc3jeWAS2A_-YWZrtiQ";
const H = { apikey: SB_ANON, Authorization: `Bearer ${SB_ANON}` };

// --- Leitura do Supabase no build, com retry -------------------------------------
// O build INTEIRO depende destas requisições: se uma falha, o deploy falha (ou pior,
// publica degradado). E elas falham — em 18/08/2026 o build quebrou duas vezes seguidas
// com 521/522 (Cloudflare: origem do Supabase fora) no 3º lote de posts, e um curl direto
// no mesmo minuto deu 503 num range e 200 nos outros. É instabilidade transitória de
// segundos: exatamente o caso que retry resolve e que sem retry vira "deploy intermitente".
//
// Duas defesas além do retry:
//   - TIMEOUT por tentativa. O build que falhou ficou 4 minutos pendurado antes de
//     desistir; um fetch travado é pior que um erro rápido, porque não retenta.
//   - 200 com corpo não-JSON também retenta. A página de erro do Cloudflare chega como
//     HTML, e JSON.parse nela estouraria longe daqui, com stack sem sentido.
const SB_TRIES = 5;
const SB_TIMEOUT_MS = 25_000;
// 4xx é erro nosso (chave errada, filtro inválido): insistir só atrasa o build.
// 408/425/429 e 5xx/52x são transitórios.
const SB_RETRY_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 520, 521, 522, 523, 524, 525, 527]);
const sbSleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sbJson(path, { headers = H, label = "" } = {}) {
  const rotulo = label || path.split("?")[0];
  let ultimo = "";
  let feitas = 0;
  for (let tentativa = 1; tentativa <= SB_TRIES; tentativa++) {
    feitas = tentativa;
    try {
      const r = await fetch(`${SB_URL}${path}`, { headers, signal: AbortSignal.timeout(SB_TIMEOUT_MS) });
      const corpo = await r.text();
      if (r.ok) {
        try {
          return JSON.parse(corpo);
        } catch {
          ultimo = `200 com corpo não-JSON: ${corpo.slice(0, 120).replace(/\s+/g, " ")}`;
        }
      } else {
        ultimo = `HTTP ${r.status}: ${corpo.slice(0, 120).replace(/\s+/g, " ")}`;
        if (!SB_RETRY_STATUS.has(r.status)) break;
      }
    } catch (e) {
      ultimo = `${e.name === "TimeoutError" ? "timeout" : "rede"}: ${e.message}`;
    }
    if (tentativa < SB_TRIES) {
      const espera = 1000 * 2 ** (tentativa - 1) + Math.floor(Math.random() * 300);
      console.warn(`[supabase] ${rotulo} — ${ultimo}. Tentativa ${tentativa}/${SB_TRIES}, nova em ${espera}ms`);
      await sbSleep(espera);
    }
  }
  // `feitas`, não SB_TRIES: em 4xx a função para na 1ª: dizer "falhou em 5 tentativas"
  // mandaria quem for debugar caçar um problema de rede que não existe.
  throw new Error(`Supabase ${rotulo}: falhou em ${feitas} tentativa(s) — ${ultimo}`);
}

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
// Imagens que não existem mais (quebradas) — tratadas como sem-imagem no build.
const BROKEN_IMAGES = new Set([
  "/wp-content/uploads/2021/05/Design-sem-nome-41.webp",
  "/wp-content/uploads/2021/05/Design-sem-nome-22.webp",
]);

function processContent(html) {
  if (!html) return "";
  let out = html;

  // band-aid: conteúdo colado com "<br>" escapado (&lt;br&gt;) renderiza como texto literal.
  // Converte em quebra real (o fix definitivo é o botão "Estruturar" no CMS).
  out = out.replace(/&lt;\s*br\s*\/?\s*&gt;/gi, "<br>");

  // 0) remove <img> com extensão dupla quebrada (ex.: .webp.gif) → imagem interna 404
  out = out.replace(/<img\b[^>]*src="[^"]*\.(?:webp|jpe?g|png)\.gif"[^>]*>/gi, "");

  // 0b) remove os BANNERS DE ISCA/e-book do meio do artigo (decisão: tirar dos artigos).
  //     Detecta SÓ pelo filename da imagem (não pega o banner de consultoria → /form, que fica).
  const isIscaBanner = (imgTag) => {
    const file = ((imgTag.match(/src="([^"]*)"/i) || [])[1] || "").split("/").pop();
    return /(?:e-?book|ebook|iscas?_banner|planilha[_-]|guia[_-]|-o-guia-completo-|pesq-google-08-analise)/i.test(file);
  };
  out = out.replace(/<a\b[^>]*>\s*(<img\b[^>]*>)\s*<\/a>/gi, (m, img) => (isIscaBanner(img) ? "" : m)); // banner linkado
  out = out.replace(/<img\b[^>]*>/gi, (m) => (isIscaBanner(m) ? "" : m));                                // banner solto
  out = out.replace(/<a\b[^>]*>\s*<\/a>/gi, "").replace(/<p>\s*<\/p>/gi, "");                            // limpa sobras vazias

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

// Imagem por categoria (usada nos cards de listagem — ver ArticleCard.astro).
// Fallback pra posts com category_name legado/órfão (não bate com nenhuma das categorias atuais) ou sem categoria.
const DEFAULT_CATEGORY_IMAGE = "/assets/categorias/default.jpg";
let _catImgMap = null;
async function getCategoryImageMap() {
  if (_catImgMap) return _catImgMap;
  // Falha aqui QUEBRA o build de propósito. O fallback silencioso que existia antes era
  // pior que o erro: 1.002 cards publicados com a imagem default e ninguém percebendo.
  const cats = await sbJson(`/rest/v1/blog_templum_categories?select=name,image_url`, { label: "categorias/imagem" });
  _catImgMap = Object.fromEntries(cats.filter((c) => c.image_url).map((c) => [c.name, c.image_url]));
  return _catImgMap;
}

function normalize(p, catImgMap = {}) {
  return {
    id: p.id,
    slug: p.slug,
    content: processContent(p.content || ""),
    data: {
      title: p.title,
      description: (p.excerpt && p.excerpt.trim()) || snippetFrom(p.content),
      heroImage: (p.featured_image && !BROKEN_IMAGES.has(p.featured_image)) ? p.featured_image : undefined,
      categoryImage: catImgMap[p.category_name] || DEFAULT_CATEGORY_IMAGE,
      author: p.author_name || "Equipe Templum",
      pubDate: p.published_at ? new Date(p.published_at) : new Date(),
      updatedDate: p.updated_at ? new Date(p.updated_at) : undefined,
      // revisão editorial CURADA (col. revised_at) — não confundir com updatedDate, que o
      // trigger toca em qualquer UPDATE (inclui lotes: 799 posts na mesma data). É esta que
      // alimenta o selo "Atualizado em", o dateModified e o lastmod.
      revisedDate: p.revised_at ? new Date(p.revised_at) : undefined,
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
  const catImgMap = await getCategoryImageMap();
  const all = [];
  let from = 0;
  // Lote de 250, não 1.000. Com 1.009 posts publicados, pedir 1.000 de uma vez com
  // `select=*` (content inteiro) dá 8,4 MB e ~5 s por requisição — encostado no
  // statement_timeout do role anon. Em 18/08/2026 o build começou a falhar de forma
  // intermitente com 57014 (canceling statement due to statement timeout): passava
  // 1 vez em 3. Como o build lê o Supabase, build intermitente = deploy intermitente.
  // Em lotes de 250 cada requisição fica em ~2 MB / ~1 s, com folga pra tabela crescer.
  const size = 250;
  for (;;) {
    const batch = await sbJson(
      `/rest/v1/blog_templum_posts?status=eq.published&select=*&order=published_at.desc`,
      { headers: { ...H, Range: `${from}-${from + size - 1}` }, label: `posts ${from}-${from + size - 1}` }
    );
    all.push(...batch);
    if (batch.length < size) break;
    from += size;
  }
  _cache = all.map((p) => normalize(p, catImgMap));
  return _cache;
}

// --- "Mais acessados" ---
// Ranking por CLIQUES orgânicos do Search Console, congelado em src/data/populares.json
// (gerado por `node scripts/populares.mjs <pasta do export>`). É proxy de acesso, não
// pageview: não conta tráfego direto/social. Se um dia houver contador de views no
// Supabase, é só trocar a fonte do mapa abaixo — a assinatura da função fica igual.
// Post fora do ranking (recém-publicado, sem histórico) vai pro fim, ordenado por data:
// a home nunca fica curta e conteúdo novo não fica invisível pra sempre.
// `emAltaPrimeiro` existe pra separar duas decisões que a home toma: QUEM é o destaque
// (o mais forte em cliques — em 19/08 a ISO 9001, com 2.264, que também é a norma que
// mais vende) e QUEM aparece primeiro no grid. Sem essa separação, o post de maior
// crescimento roubava o hero e a ISO 9001 caía pro 4º card.
export async function getPopularPosts(limite, { emAltaPrimeiro = false } = {}) {
  const posts = await getAllPosts();
  const cliques = new Map(populares.ranking.map((r) => [r.slug, r.cliques]));
  // "Em alta" (src/data/em-alta.json) é CRESCIMENTO de cliques em 7 dias, não volume:
  // o 5S cresceu 400% com +12 cliques, enquanto o fluxograma tem 1.986 em 6 meses e não
  // aparece na lista. Por isso o em-alta só REORDENA — não substitui o ranking. Sem isso,
  // dois posts que estão subindo agora (GERIC em 18º, 5S em 27º) nunca chegariam à home,
  // que mostra 15 cards; e trocar a base pelo crescimento derrubaria os que já provaram.
  const emAlta = new Map(emAltaData.slugs.map((s, i) => [s.slug, i]));
  const ordenado = [...posts].sort((a, b) => {
    if (emAltaPrimeiro) {
      const qa = emAlta.has(a.slug), qb = emAlta.has(b.slug);
      // entre os em alta, mantém a ordem de crescimento do painel
      if (qa && qb) return emAlta.get(a.slug) - emAlta.get(b.slug);
      if (qa !== qb) return qa ? -1 : 1;
    }
    const ca = cliques.get(a.slug) ?? -1;
    const cb = cliques.get(b.slug) ?? -1;
    if (ca !== cb) return cb - ca;
    return +new Date(b.data.pubDate) - +new Date(a.data.pubDate);
  });
  return limite ? ordenado.slice(0, limite) : ordenado;
}

// Slug → variação, pra home marcar o card com selo. Fora daqui, ninguém precisa saber
// que o post está em alta: é sinal de curadoria da home, não atributo do artigo.
export function emAltaMap() {
  return new Map(emAltaData.slugs.map((s) => [s.slug, s.variacao]));
}

// --- Iscas (lead magnets / landing pages) ---
let _iscas = null;
export async function getAllIscas() {
  if (_iscas) return _iscas;
  _iscas = await sbJson(
    `/rest/v1/blog_templum_iscas?active=eq.true&select=*&order=segment,title`,
    { label: "iscas" }
  );
  return _iscas;
}
export async function getIsca(slug) {
  const all = await getAllIscas();
  return all.find((i) => i.slug === slug) || null;
}

// O mapa categoria→isca (buildIscaMap/getIscaForCategories) saiu em 19/08/2026 com a
// descontinuação das iscas: era o único consumidor de categories.isca_slug e do
// DEFAULT_ISCA_SLUG. A coluna segue no Supabase — se as iscas voltarem, o histórico
// deste arquivo tem a implementação inteira.

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
