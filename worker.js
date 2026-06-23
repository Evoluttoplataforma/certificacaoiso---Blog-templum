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

    // tudo o mais = estático
    return env.ASSETS.fetch(request);
  },
};
