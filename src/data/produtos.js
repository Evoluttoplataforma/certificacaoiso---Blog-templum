// Menu por PRODUTO (norma), e não por categoria editorial.
//
// Por que existe: as categorias ("Qualidade e Inovação", "Meio Ambiente") são divisões de
// redação. Quem chega no blog procura por NORMA — digita "ISO 9001", "PBQP-H", "FSSC
// 22000". O menu passou a falar essa língua em 19/08/2026.
//
// O destino é sempre o PILAR do blog, não a página de consultoria do site: o menu é
// navegação, e mandar pra fora do domínio no primeiro clique quebra a sessão e o
// visitor_id do Clarity. Quem quer falar com alguém tem o botão Contato no header.
//
// `url` conferida uma a uma no Supabase (status=published) — atenção às pegadinhas:
// a ISO 14001 mora em /iso-14001-2/ (o /iso-14001/ é rascunho), a ISO 22000 em /iso-22000/
// com título "FSSC ISO 22000", e a ISO 37001 em /o-que-e-a-iso-37001/, não em /iso-37001/.
//
// `icon` e `cor` saem de data/categorias.js de propósito: são nomes de ícone JÁ usados no
// projeto. O <iconify-icon> busca o ícone na API do Iconify em runtime — nome inventado
// não dá erro, só deixa um buraco no menu.
export const produtos = [
  { nome: "ISO 9001", url: "/iso-9001/", icon: "solar:medal-ribbon-star-bold", cor: "#1167E4" },
  { nome: "PBQP-H", url: "/pbqp-h/", icon: "solar:buildings-2-bold", cor: "#7F2611" },
  { nome: "ISO 27001", url: "/iso-27001/", icon: "solar:shield-keyhole-bold", cor: "#14A7AF" },
  { nome: "ISO 37001", url: "/o-que-e-a-iso-37001/", icon: "solar:clipboard-check-bold", cor: "#2E3191" },
  { nome: "FSSC / ISO 22000", url: "/iso-22000/", icon: "solar:donut-bitten-bold", cor: "#FFB600" },
  { nome: "ISO 14001", url: "/iso-14001-2/", icon: "solar:leaf-bold", cor: "#00A844" },
  { nome: "ISO 45001", url: "/iso-45001/", icon: "solar:shield-warning-bold", cor: "#FF5925" },
];
