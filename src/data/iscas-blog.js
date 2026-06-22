// Mapa categoria do artigo → isca (material) relevante daquele segmento.
// As iscas vivem em templum.com.br/presentes/<slug>.
export const iscaPorCategoria = {
  "Qualidade e Inovação": { slug: "e-book-lucre-com-a-iso", titulo: "Lucre com a ISO 9001 — Transição e Implantação" },
  "Construção Civil": { slug: "e-book-guia-pbqp-h", titulo: "Guia Completo do PBQP-H" },
  "Segurança dos Alimentos": { slug: "e-book-seguranca-de-alimentos", titulo: "Segurança de Alimentos — Guia Prático" },
  "Meio Ambiente": { slug: "analise-critica-pela-direcao-iso-14001-guia-completo-e-pratico", titulo: "Análise Crítica pela Direção — ISO 14001" },
  "Saúde e Segurança do Trabalho": { slug: "e-book-a-nova-iso-45001", titulo: "A Nova ISO 45001 — Mudanças e Implementação" },
  "Auditoria": { slug: "planilha-relatorio-de-nao-conformidade", titulo: "Planilha de Relatório de Não Conformidade" },
  "Segurança e Compliance": { slug: "iso-27001-o-guia-completo-para-mapeamento-de-processos", titulo: "ISO 27001 — Guia de Mapeamento de Processos" },
  "Gestão e Marketing": { slug: "e-book-okr", titulo: "OKR na Prática" },
  "IA": { slug: "inteligencia-artificial-como-transformar-sua-empresa-com-ia-na-pratica", titulo: "Inteligência Artificial na Prática" },
  "ESG": { slug: "analise-critica-pela-direcao-iso-14001-guia-completo-e-pratico", titulo: "Análise Crítica pela Direção — ISO 14001" },
  "Transportes e Logística": { slug: "e-book-lucre-com-a-iso", titulo: "Lucre com a ISO 9001" },
};
export const iscaDefault = { slug: "ebook-empresarios", titulo: "Ebook Templum para Empresários" };

export function iscaDe(categorias) {
  for (const c of categorias || []) if (iscaPorCategoria[c]) return iscaPorCategoria[c];
  return iscaDefault;
}
