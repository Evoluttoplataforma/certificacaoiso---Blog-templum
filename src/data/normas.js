// Qual norma a página trata — usado como tag do Microsoft Clarity (e reutilizável).
//
// Por que não sai só de `categories`: em lib/posts.js esse array é [categoria, ...tags],
// e as tags quase nunca escrevem a norma. Medido em 18/08/2026: das 1.002 páginas de
// artigo, apenas 52 traziam a norma nas tags — a tag chegava vazia em 95% do blog, o que
// mata justamente a comparação que interessa (conversão por norma). Título e slug sabem.
//
// A lista de números é EXPLÍCITA, e ordenada do maior para o menor, de propósito:
//   - explícita porque `iso-?\d{4,5}` casa o ano da edição ("ISO 9001:2015" → "ISO 2015");
//   - maior primeiro porque assim "iso-90012015" (slug sem hífen antes do ano) cai em
//     9001 em vez de não casar nada, e "iso-14001" nunca é lido como um número de 4.
const ISO_NUMS = [
  "9001", "14001", "45001", "45003", "27001", "27002", "27701", "22000", "22301", "22716",
  "37001", "37301", "17025", "17020", "17021", "17065", "50001", "26000", "56002", "31000",
  "55001", "41001", "21001", "21500", "13485", "20000", "39001", "30401", "10002", "10015",
  "19011", "14064", "14067", "28000", "15189", "20121", "44001", "46001", "3834", "9004",
].sort((a, b) => b.length - a.length || a.localeCompare(b));

// Não-ISO que puxam lead no blog. Testado antes do padrão ISO: "FSSC 22000 vs ISO 22000"
// é uma página de FSSC.
const OUTRAS = [
  [/fssc\s*-?\s*22000/i, "FSSC 22000"],
  [/pbqp\s*-?\s*h/i, "PBQP-H"],
  [/iatf\s*-?\s*16949/i, "IATF 16949"],
  [/\bhaccp\b|\bappcc\b/i, "HACCP"],
  [/\bbrcgs?\b/i, "BRCGS"],
  [/\blgpd\b/i, "LGPD"],
  [/\bsa\s*-?\s*8000\b/i, "SA 8000"],
  [/\bas\s*-?\s*9100\b/i, "AS 9100"],
];

const ISO_RE = new RegExp("iso[\\s._:-]?(" + ISO_NUMS.join("|") + ")", "i");

// Ordem do haystack = ordem de prioridade: categoria/tags curadas antes do texto livre.
export function normaDaPagina({ categories = [], title = "", slug = "" } = {}) {
  const hay = [...(categories || []), title, slug].filter(Boolean).join(" | ");
  for (const [re, label] of OUTRAS) if (re.test(hay)) return label;
  const m = hay.match(ISO_RE);
  return m ? "ISO " + m[1] : "";
}
