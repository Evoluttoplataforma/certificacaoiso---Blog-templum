// Menu de CERTIFICAÇÕES — as 13 que a Templum atende, na ordem do site.
//
// Por que não é por categoria editorial: "Qualidade e Inovação" é divisão de redação.
// Quem chega no blog procura por norma — digita "ISO 9001", "PBQP-H", "GERIC". O menu
// passou a falar essa língua em 19/08/2026.
//
// O destino é sempre o PILAR do blog, nunca a página de consultoria do site: menu é
// navegação, e sair do domínio no primeiro clique quebra a sessão e o visitor_id do
// Clarity. Quem quer falar tem o botão Contato no header.
//
// TODA url foi conferida no Supabase (status=published). Quatro não eram o óbvio:
//   · ISO 14001 → /iso-14001-2/           (o /iso-14001/ é RASCUNHO e daria 404)
//   · ISO 37001 → /o-que-e-a-iso-37001/   (não existe /iso-37001/)
//   · FSSC 22000 → /iso-22000/            (o hub se chama "FSSC ISO 22000")
//   · GERIC → /principais-duvidas-sobre-o-geric/
//
// Os ícones foram conferidos um a um na API do Iconify (api.iconify.design/solar.json):
// o <iconify-icon> resolve o nome em runtime e nome inexistente não dá erro — deixa um
// buraco no menu, que ninguém percebe até alguém reclamar. "solar:scales-bold" e
// "solar:truck-bold", que pareciam óbvios, NÃO existem; os certos são scale-bold e
// delivery-bold.
export const produtos = [
  { nome: "ISO 9001", desc: "Gestão da Qualidade", url: "/iso-9001/",
    icon: "solar:medal-ribbon-star-bold", cor: "#1167E4" },
  { nome: "ISO 14001", desc: "Gestão Ambiental", url: "/iso-14001-2/",
    icon: "solar:leaf-bold", cor: "#00A844" },
  { nome: "ISO 27001", desc: "Segurança da Informação", url: "/iso-27001/",
    icon: "solar:shield-keyhole-bold", cor: "#14A7AF" },
  { nome: "ISO 45001", desc: "Saúde e Segurança Ocupacional", url: "/iso-45001/",
    icon: "solar:shield-warning-bold", cor: "#FF5925" },
  { nome: "ISO 37001", desc: "Antissuborno", url: "/o-que-e-a-iso-37001/",
    icon: "solar:scale-bold", cor: "#2E3191" },
  { nome: "PBQP-H", desc: "Qualidade na Construção", url: "/pbqp-h/",
    icon: "solar:buildings-2-bold", cor: "#7F2611" },
  { nome: "FSSC 22000", desc: "Segurança de Alimentos", url: "/iso-22000/",
    icon: "solar:donut-bitten-bold", cor: "#FFB600" },
  { nome: "HACCP", desc: "Segurança de Alimentos", url: "/haccp-o-que-e/",
    icon: "solar:chef-hat-bold", cor: "#E08700" },
  { nome: "ESG", desc: "Ambiental, Social e Governança", url: "/o-que-e-esg/",
    icon: "solar:earth-bold", cor: "#9DBF0D" },
  // SGI é a única sem pilar de verdade: o melhor que existe é este post. Vale uma página
  // hub como a que a ISO 37001 ganhou — enquanto não houver, o menu aponta pro mais forte.
  { nome: "SGI", desc: "Sistema de Gestão Integrado", url: "/importancia-do-sgi-nas-organizacoes/",
    icon: "solar:layers-minimalistic-bold", cor: "#1167E4" },
  { nome: "SASSMAQ", desc: "Segurança no Transporte", url: "/o-que-e-sassmaq/",
    icon: "solar:delivery-bold", cor: "#2E3191" },
  { nome: "GERIC", desc: "Crédito Caixa Econômica", url: "/principais-duvidas-sobre-o-geric/",
    icon: "solar:wallet-money-bold", cor: "#7F2611" },
  { nome: "LGPD", desc: "Proteção de Dados", url: "/lgpd/",
    icon: "solar:lock-keyhole-bold", cor: "#14A7AF" },
];
