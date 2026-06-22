// Categorias do blog (nome exato do WordPress → slug/ícone/cor).
// A cor puxa do design system da Templum (sub-marcas por norma).
export const categorias = [
  { nome: "Qualidade e Inovação", slug: "qualidade-e-inovacao", icon: "solar:medal-ribbon-star-bold", cor: "#1167E4" },
  { nome: "Construção Civil", slug: "construcao-civil", icon: "solar:buildings-2-bold", cor: "#7F2611" },
  { nome: "Segurança dos Alimentos", slug: "seguranca-dos-alimentos", icon: "solar:donut-bitten-bold", cor: "#FFB600" },
  { nome: "Meio Ambiente", slug: "meio-ambiente", icon: "solar:leaf-bold", cor: "#00A844" },
  { nome: "Saúde e Segurança do Trabalho", slug: "saude-e-seguranca-do-trabalho", icon: "solar:shield-warning-bold", cor: "#FF5925" },
  { nome: "Auditoria", slug: "auditoria", icon: "solar:clipboard-check-bold", cor: "#14A7AF" },
  { nome: "Segurança e Compliance", slug: "seguranca-e-compliance", icon: "solar:shield-keyhole-bold", cor: "#14A7AF" },
  { nome: "Gestão e Marketing", slug: "gestao-e-marketing", icon: "solar:chart-2-bold", cor: "#BC0000" },
  { nome: "Transportes e Logística", slug: "transportes-e-logistica", icon: "solar:delivery-bold", cor: "#2E3191" },
  { nome: "ESG", slug: "esg", icon: "solar:earth-bold", cor: "#9DBF0D" },
  { nome: "IA", slug: "ia", icon: "solar:cpu-bolt-bold", cor: "#FF5925" },
];

// nome → slug (p/ mapear as categorias dos posts)
export const slugDe = Object.fromEntries(categorias.map((c) => [c.nome, c.slug]));

export function slugify(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// metadados de qualquer categoria (curada ou não) — nunca retorna undefined
const curadaPorSlug = Object.fromEntries(categorias.map((c) => [c.slug, c]));
export function catMeta(nome) {
  const slug = slugDe[nome] || slugify(nome);
  return curadaPorSlug[slug] || { nome, slug, icon: "solar:tag-bold", cor: "var(--orange)" };
}
