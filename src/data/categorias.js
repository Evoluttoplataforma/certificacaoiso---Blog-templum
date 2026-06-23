// Categorias do blog (nome exato do WordPress → slug/ícone/cor).
// A cor puxa do design system da Templum (sub-marcas por norma).
export const categorias = [
  { nome: "Qualidade e Inovação", slug: "qualidade-e-inovacao", icon: "solar:medal-ribbon-star-bold", cor: "#1167E4",
    desc: "Tudo sobre ISO 9001 e gestão da qualidade: como mapear processos, reduzir não conformidades, engajar a equipe e transformar a certificação em resultado real. Conteúdos práticos para sair do retrabalho e da papelada solta rumo a um sistema de gestão que sustenta o crescimento — com o método e a garantia de 200% da Templum." },
  { nome: "Construção Civil", slug: "construcao-civil", icon: "solar:buildings-2-bold", cor: "#7F2611",
    desc: "PBQP-H, ISO 9001 na obra e a Norma de Desempenho explicados sem juridiquês. Aqui você encontra guias de níveis do PBQP-H, controle de qualidade em canteiro, gestão de fornecedores e o que o auditor cobra — para construtoras que querem qualificação, acesso a financiamento e obras com menos desperdício." },
  { nome: "Segurança dos Alimentos", slug: "seguranca-dos-alimentos", icon: "solar:donut-bitten-bold", cor: "#FFB600",
    desc: "FSSC 22000, ISO 22000, HACCP e as boas práticas de fabricação na prática. Conteúdos para indústrias e operações de alimentos que precisam garantir segurança, atender clientes e mercados exigentes e regularizar o negócio — do diagnóstico à auditoria de certificação." },
  { nome: "Meio Ambiente", slug: "meio-ambiente", icon: "solar:leaf-bold", cor: "#00A844",
    desc: "ISO 14001 e gestão ambiental para empresas que querem reduzir impacto, atender requisitos legais e ganhar competitividade. Da análise crítica pela direção aos aspectos e impactos ambientais, reunimos o que importa para implantar e manter um sistema de gestão ambiental que funciona." },
  { nome: "Saúde e Segurança do Trabalho", slug: "saude-e-seguranca-do-trabalho", icon: "solar:shield-warning-bold", cor: "#FF5925",
    desc: "ISO 45001, integração com as NRs e gestão proativa de perigos e riscos. Conteúdos para empresas que querem proteger pessoas, reduzir acidentes e afastamentos e demonstrar maturidade em SST — com processos claros, indicadores e cultura de segurança." },
  { nome: "Auditoria", slug: "auditoria", icon: "solar:clipboard-check-bold", cor: "#14A7AF",
    desc: "Como chegar pronto na auditoria: não conformidades, ações corretivas, análise de causa raiz e evidências que o auditor realmente pede. Guias e modelos para auditorias internas e de certificação que viram melhoria contínua, não dor de cabeça." },
  { nome: "Segurança e Compliance", slug: "seguranca-e-compliance", icon: "solar:shield-keyhole-bold", cor: "#14A7AF",
    desc: "ISO 27001, LGPD e gestão de compliance para proteger informação e reduzir riscos. Do mapeamento de processos ao tratamento de dados pessoais, conteúdos para empresas que precisam de segurança da informação com base sólida e auditável." },
  { nome: "Gestão e Marketing", slug: "gestao-e-marketing", icon: "solar:chart-2-bold", cor: "#BC0000",
    desc: "Gestão, liderança, processos e crescimento para quem usa a certificação como alavanca de negócio. OKR, indicadores, fluxo de caixa, relacionamento com o cliente e produtividade — ideias práticas para organizar a empresa e crescer do jeito certo." },
  { nome: "Transportes e Logística", slug: "transportes-e-logistica", icon: "solar:delivery-bold", cor: "#2E3191",
    desc: "SASSMAQ, ISO 9001 e gestão para operações de transporte e logística. Conteúdos sobre segurança, qualidade no atendimento, controle de frota e os requisitos que abrem portas com grandes embarcadores e clientes exigentes." },
  { nome: "ESG", slug: "esg", icon: "solar:earth-bold", cor: "#9DBF0D",
    desc: "ESG na prática, por onde começar e como provar resultado. Da governança às metas ambientais e sociais, reunimos conteúdos para empresas que querem estruturar a agenda ESG com indicadores reais — e não só discurso." },
  { nome: "IA", slug: "ia", icon: "solar:cpu-bolt-bold", cor: "#FF5925",
    desc: "Inteligência artificial aplicada à gestão e à certificação, sem hype. Casos reais de onde a IA gera retorno em processos, atendimento e análise de dados — e como adotar com baixo risco. Conteúdos para empresários e gestores, não para cientistas de dados." },
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
