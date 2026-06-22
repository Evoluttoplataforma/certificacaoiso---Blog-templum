// Linkbuilding contextual → orbitgestao.com.br (plataforma de gestão da Templum).
// Roda no build (não altera os .md). Insere NO MÁXIMO 1 link por artigo, na 1ª
// menção relevante em TEXTO CORRIDO — nunca em títulos, nunca dentro de links já
// existentes, nunca em código/imagens. Âncora = a própria expressão genérica
// encontrada (varia naturalmente por artigo → evita over-optimization).
import path from "node:path";

const ORBIT = "https://orbitgestao.com.br";

// Expressões-alvo em ordem de prioridade (mais específica → mais genérica).
// A primeira que aparecer (no 1º nó de texto elegível) vira o link.
const TARGETS = [
  /\bgest[ãa]o de processos\b/i,
  /\bmapeamento de processos\b/i,
  /\bgest[ãa]o da qualidade\b/i,
  /\bgest[ãa]o de indicadores\b/i,
  /\bindicadores de desempenho\b/i,
  /\bgest[ãa]o de pessoas\b/i,
  /\bgest[ãa]o estrat[ée]gica\b/i,
  /\bgest[ãa]o empresarial\b/i,
  /\bprodutividade\b/i,
  /\blideran[çc]a\b/i,
  /\bgest[ãa]o\b/i,
];

// Tipos de nó cujos filhos NÃO podem receber link.
const SKIP = new Set([
  "heading", "link", "linkReference", "code", "inlineCode",
  "image", "imageReference", "definition", "html",
]);

export default function remarkOrbitLinks() {
  return (tree, file) => {
    const slug = file?.path ? path.basename(file.path).replace(/\.mdx?$/, "") : "blog";
    const url = `${ORBIT}/?utm_source=blog&utm_medium=link-contextual&utm_campaign=${encodeURIComponent(slug)}`;
    let done = false;

    const walk = (node) => {
      if (done || !node || !Array.isArray(node.children)) return;
      if (SKIP.has(node.type)) return; // não desce em título/link/código…

      for (let i = 0; i < node.children.length; i++) {
        if (done) return;
        const child = node.children[i];
        if (child.type === "text") {
          for (const re of TARGETS) {
            const m = child.value.match(re);
            if (!m) continue;
            const start = m.index;
            const end = start + m[0].length;
            const before = child.value.slice(0, start);
            const after = child.value.slice(end);
            const repl = [];
            if (before) repl.push({ type: "text", value: before });
            repl.push({
              type: "link",
              url,
              title: null,
              children: [{ type: "text", value: m[0] }],
            });
            if (after) repl.push({ type: "text", value: after });
            node.children.splice(i, 1, ...repl);
            done = true;
            break;
          }
        } else {
          walk(child);
        }
      }
    };

    walk(tree);
  };
}
