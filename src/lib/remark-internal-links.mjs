// Links internos do conteúdo migrado vêm absolutos (https://certificacaoiso.com.br/slug/).
// Isso quebra a navegação local (vai pro domínio de produção) e não é o ideal nem em
// produção. Este plugin, no build:
//   1) converte link interno absoluto → root-relative (/slug/), funcionando em qualquer ambiente;
//   2) resolve 4 destinos órfãos (páginas que não viraram post) p/ alvos válidos → zero 404.
// Trata tanto links markdown (nós `link`) quanto links em HTML cru/tabelas (nós `html`).
// NÃO mexe em imagens → wp-content/uploads continua absoluto.
const HOST = /^https?:\/\/certificacaoiso\.com\.br/i;
const HOST_G = /https?:\/\/certificacaoiso\.com\.br/i;

// Órfãos (chave = path sem barra final) → destino correto.
const REDIRECTS = {
  "/precos": "https://templum.com.br/form?utm_source=blog&utm_medium=organico",
  "/certificacast": "https://templum.com.br",
  "/elemento-planejamento-estrategico": "/elementos-planejamento-estrategico/",
  "/planejamento-estrategico": "/como-fazer-planejamento-estrategico/",
};

// Recebe o que vem DEPOIS do host (ex.: "/slug/?q=1") e devolve o destino final.
function rewrite(rest) {
  rest = rest || "/";
  const m = rest.match(/^([^?#]*)([?#].*)?$/);
  let pathPart = m[1] || "/";
  const tail = m[2] || "";
  if (!pathPart.startsWith("/")) pathPart = "/" + pathPart;
  const key = pathPart.replace(/\/+$/, "");
  if (REDIRECTS[key]) return REDIRECTS[key];
  // mantém trailing slash (config trailingSlash:'always'), salvo se for arquivo (.pdf etc.)
  if (!/\.[a-z0-9]+$/i.test(pathPart) && !pathPart.endsWith("/")) pathPart += "/";
  return pathPart + tail;
}

export default function remarkInternalLinks() {
  return (tree) => {
    const visit = (node) => {
      if (!node) return;
      if (node.type === "link" && typeof node.url === "string" && HOST.test(node.url)) {
        node.url = rewrite(node.url.replace(HOST, ""));
      } else if (node.type === "html" && typeof node.value === "string" && HOST_G.test(node.value)) {
        // links dentro de tabelas/HTML cru: reescreve só o href de <a>, preserva <img src>.
        node.value = node.value.replace(
          /(<a\b[^>]*\bhref=")https?:\/\/certificacaoiso\.com\.br([^"]*)(")/gi,
          (_m, p1, path, p3) => p1 + rewrite(path) + p3
        );
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  };
}
