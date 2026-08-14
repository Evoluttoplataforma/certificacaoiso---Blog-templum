// Worker do blog certificacaoiso.com.br
// Hoje: serve os arquivos estáticos (Astro build em ./dist).
// Futuro: /wp-content/* → R2 (imagens), /api/lead → Supabase + Mailchimp.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // redireciona www → apex
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.replace(/^www\./, "");
      return Response.redirect(url.toString(), 301);
    }

    // normaliza paths com espaço/%20 (links quebrados de conteúdo migrado)
    const decoded = decodeURIComponent(url.pathname);
    if (/\s/.test(decoded)) {
      url.pathname = decoded.replace(/\s+/g, "").replace(/\/{2,}/g, "/");
      return Response.redirect(url.toString(), 301);
    }

    // /acesso* → proxy p/ o Worker do CMS (path-based, sem precisar de rota/subdomínio).
    // O CMS remove o prefixo /acesso e seus redirects voltam sem ele → re-adicionamos.
    if (url.pathname === "/acesso" || url.pathname.startsWith("/acesso/")) {
      const CMS = "https://cms-blog-templum-certificacaoiso.templum.workers.dev";
      const target = CMS + url.pathname + url.search;
      const resp = await fetch(new Request(target, request), { redirect: "manual" });
      if (resp.status >= 300 && resp.status < 400) {
        const loc = resp.headers.get("location");
        if (loc && loc.startsWith("/") && !loc.startsWith("/acesso")) {
          const h = new Headers(resp.headers);
          h.set("location", "/acesso" + loc);
          return new Response(resp.body, { status: resp.status, headers: h });
        }
      }
      return resp;
    }

    // Categorias antigas do WordPress: /category/<slug>/ → /categoria/<slug>/ quando a
    // categoria ainda existe; senão, home.
    //
    // Isto morava no _redirects como duas regras com curinga, e não funcionava: a regra
    // ampla (/category/*) vencia a específica (/category/construcao-civil/*) nas DUAS
    // ordens possíveis — testado em produção —, então toda categoria antiga caía na home.
    // Aqui a precedência é nossa, e vale pras 112 categorias, não só uma. De quebra tira
    // do _redirects as últimas regras com curinga, que são as que contam contra o limite
    // de 100 "dynamic" da Cloudflare (ver o cabeçalho do fim daquele arquivo).
    const cat = url.pathname.match(/^\/category\/([^/]+)(?:\/|$)/);
    if (cat) {
      const target = new URL(url.toString());
      target.pathname = `/categoria/${cat[1]}/`;
      target.search = "";
      const catResp = await env.ASSETS.fetch(new Request(target.toString(), request));
      if (catResp.status === 200) return Response.redirect(target.toString(), 301);
      return Response.redirect(new URL("/", url).toString(), 301);
    }
    if (/^\/category\/?$/.test(url.pathname)) {
      return Response.redirect(new URL("/", url).toString(), 301);
    }

    // --- (futuro) imagens dos artigos via R2 ---
    // if (url.pathname.startsWith("/wp-content/") && env.IMAGES) {
    //   const obj = await env.IMAGES.get(url.pathname.replace(/^\//, ""));
    //   if (obj) return new Response(obj.body, {
    //     headers: { "content-type": obj.httpMetadata?.contentType || "image/webp",
    //                "cache-control": "public, max-age=31536000, immutable" },
    //   });
    // }

    // --- (futuro) captura de lead → Supabase + Mailchimp ---
    // if (url.pathname === "/api/lead" && request.method === "POST") { ... }

    let resp = await env.ASSETS.fetch(request);

    // Fallback: imagens antigas do WordPress (/wp-content/uploads/*.jpg|.png|.jpeg|.gif)
    // foram convertidas pra .webp na migração, mas os posts antigos e o índice do
    // Google ainda apontam pra extensão velha, que não existe mais → 404.
    // Diagnóstico da queda de tráfego (ago/2026): isso sozinho respondia por ~14%
    // dos cliques perdidos. 301 pra versão .webp resolve o link quebrado e devolve
    // o sinal de SEO pro Google reindexar a URL certa.
    if (resp.status === 404 && /^\/wp-content\/uploads\/.+\.(jpe?g|png|gif)$/i.test(url.pathname)) {
      const webpUrl = new URL(url.toString());
      webpUrl.pathname = url.pathname.replace(/\.(jpe?g|png|gif)$/i, ".webp");
      const webpResp = await env.ASSETS.fetch(new Request(webpUrl.toString(), request));
      if (webpResp.status === 200) {
        return Response.redirect(webpUrl.toString(), 301);
      }
    }

    // Fallbacks de 404 que dependem de nº de página (não dá pra listar em
    // _redirects, que é 1:1). Mesma varredura de ago/2026 sobre as URLs do
    // Search Console: 19 URLs de comment-page e 6 de índice paginado, juntas
    // ~4.000 impressões/mês jogadas fora em 404.
    if (resp.status === 404) {
      // Paginação de comentários do WordPress: /um-post/comment-page-3/ → /um-post/
      // Só redireciona se o post pai existir, pra não trocar 404 por 404.
      const cp = url.pathname.match(/^(\/.+?)\/comment-page-\d+\/?$/);
      if (cp) {
        const parent = new URL(url.toString());
        parent.pathname = `${cp[1]}/`;
        parent.search = "";
        const parentResp = await env.ASSETS.fetch(new Request(parent.toString(), request));
        if (parentResp.status === 200) {
          return Response.redirect(parent.toString(), 301);
        }
      }

      // Índice paginado do blog no WordPress: /blog/ e /blog/page/12/ → raiz,
      // que hoje é o próprio índice do blog.
      if (/^\/blog(\/page\/\d+)?\/?$/.test(url.pathname)) {
        return Response.redirect(new URL("/", url).toString(), 301);
      }

      // Categoria antiga fora de /categoria/: /construcao-civil/ e /construcao-civil/page/4/
      if (/^\/construcao-civil(\/page\/\d+)?\/?$/.test(url.pathname)) {
        return Response.redirect(new URL("/categoria/construcao-civil/", url).toString(), 301);
      }
    }

    // tudo o mais = estático
    return resp;
  },
};
