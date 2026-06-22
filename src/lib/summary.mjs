// Gera uma "Resposta rápida" (TL;DR) decente a partir do corpo do artigo, quando
// o autor não definiu `tldr` no frontmatter. Pega o 1º parágrafo de prosa real
// (ignora títulos/imagens/legendas) e corta em FIM DE FRASE — nada de "…empresa d".
export function smartTldr(body, fallback = "", max = 360) {
  let t = (body || "")
    .replace(/```[\s\S]*?```/g, " ")        // blocos de código
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")    // imagens markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")  // links → só o texto
    .replace(/<[^>]+>/g, " ")                  // tags HTML
    .replace(/^\s*>+\s?/gm, "")                // citações
    .replace(/\r/g, "\n")
    .replace(/^[ \t]*[-+*]\s+/gm, "")          // marcadores de lista (- + *)
    .replace(/^[ \t]*\d+\.\s+/gm, "")          // listas numeradas (1. 2. …)
    .replace(/[#*_`|]/g, " ");                 // símbolos de markdown restantes

  // separa em parágrafos e escolhe o primeiro que é prosa de verdade
  const paras = t.split(/\n{2,}/).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
  let text = "";
  for (const p of paras) {
    if (p.length >= 60 && /[.!?]/.test(p)) { text = p; break; }
  }
  if (!text) text = (fallback || "").replace(/\s+/g, " ").trim();
  if (!text) return "";

  if (text.length <= max) return text;
  // corta no fim de frase mais próximo (antes do limite)
  const slice = text.slice(0, max);
  const end = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  if (end > 140) return slice.slice(0, end + 1).trim();
  // sem ponto à vista → corta na última palavra + reticências
  return slice.slice(0, slice.lastIndexOf(" ")).trim() + "…";
}
