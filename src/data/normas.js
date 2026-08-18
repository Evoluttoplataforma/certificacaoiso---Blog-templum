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


// --- Norma → valor aceito pelo cf_produto do Orbit ------------------------------
// cf_produto é um SELECT. Valor fora da lista faz o saveToOrbit do site reenviar o lead
// SEM NENHUM custom field (é o fallback dele): o lead entra, mas cego — sem porte, sem
// faturamento, sem página, sem UTM. Ver o comentário longo em data/lead-form-pages.js.
// Lista válida: ISO 9001 · ISO 14001 · ISO 27001 · ISO 45001 · ISO 37001 · PBQP-H ·
//               FSSC 22000 · HACCP · ESG · SGI · SASSMAQ · GERIC · LGPD
// Norma sem produto equivalente (ISO 17025, 50001, IATF...) mapeia para "" de propósito:
// melhor perder o produto e manter os outros campos do que cegar o lead inteiro.
const CRM_PRODUTO = {
  "ISO 9001": "ISO 9001",
  "ISO 14001": "ISO 14001",
  "ISO 27001": "ISO 27001",
  "ISO 45001": "ISO 45001",
  "ISO 37001": "ISO 37001",
  "PBQP-H": "PBQP-H",
  "FSSC 22000": "FSSC 22000",
  // O produto vendido para quem busca ISO 22000 é o FSSC 22000 — mesmo mapeamento que
  // data/lead-form-pages.js já usa na página "iso-22000".
  "ISO 22000": "FSSC 22000",
  "HACCP": "HACCP",
  "LGPD": "LGPD",
  "SASSMAQ": "SASSMAQ",
  "GERIC": "GERIC",
  "ESG": "ESG",
  "SGI": "SGI",
};

// Exposto para a página /form, que resolve norma → produto no navegador (a norma só é
// conhecida ali pela querystring). Mesma fonte da função abaixo: um mapa, não dois.
export const CRM_PRODUTO_MAP = CRM_PRODUTO;

export function crmDaNorma(norma) {
  return CRM_PRODUTO[(norma || "").trim()] || "";
}

// Rótulos que a página /form aceita em ?norma= — evita headline com texto arbitrário
// vindo da URL (o valor é escrito na página, então precisa ser de lista fechada).
export const NORMAS_VALIDAS = Object.keys(CRM_PRODUTO).concat([
  "ISO 17025", "ISO 50001", "ISO 27701", "ISO 26000", "ISO 56002", "ISO 31000",
  "ISO 55001", "ISO 13485", "ISO 22301", "ISO 20000", "ISO 37301", "ISO 19011",
  "IATF 16949", "BRCGS", "SA 8000", "AS 9100",
]);
