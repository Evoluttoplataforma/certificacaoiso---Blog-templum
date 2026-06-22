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

    // /acesso → painel do CMS (Worker separado, domínio acesso.certificacaoiso.com.br)
    if (url.pathname === "/acesso" || url.pathname === "/acesso/") {
      return Response.redirect("https://acesso.certificacaoiso.com.br/", 302);
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
