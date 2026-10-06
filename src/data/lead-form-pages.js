// Páginas que recebem o formulário de consultoria no fim do artigo (LeadForm.astro).
//
// Por que uma lista curada, e não o blog inteiro: o form pede 7 campos. Em página de
// intenção informacional pura ("o que é fluxograma") ele custa espaço e converte pouco;
// em página de norma, onde o leitor está avaliando certificar, ele é o próximo passo
// natural. A régua da seleção foi impressão no Search Console (6 meses até 07/08/2026)
// cruzada com intenção comercial.
//
// Cada página tem DOIS rótulos, e a diferença importa:
//
//   display → o que aparece na headline ("Precisa de consultoria para X?").
//             É a linguagem do leitor.
//   crm     → o valor exato do campo `norma`, que o worker do site mapeia para o
//             custom field `cf_produto` do Orbit. Esse campo é um SELECT: valor fora
//             da lista faz o CRM recusar e o saveToOrbit reenviar SEM NENHUM campo
//             personalizado (o fallback dele) — ou seja, um rótulo errado aqui não
//             quebra o lead, mas apaga porte, faturamento, página e UTMs dele.
//
// As opções válidas de `cf_produto` são as de site/src/data/normas.js:
//   ISO 9001 · ISO 14001 · ISO 27001 · ISO 45001 · ISO 37001 · PBQP-H · FSSC 22000
//   HACCP · ESG · SGI · SASSMAQ · GERIC · LGPD
// Não existe opção para ISO 17025 — nesse caso crm vai "" e o interesse real segue
// na nota do lead, em vez de arrastar todos os custom fields para o lixo.
//
// Ao adicionar página nova: confirme que o artigo fala da norma do display E que o
// crm está na lista acima. Headline prometendo consultoria que o artigo não trata
// queima confiança; crm fora da lista silenciosamente cega o time comercial.
export const LEAD_FORM_PAGES = {
  // --- pilares de norma (maior volume de impressão) ---
  "iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "iso-14001-2": { display: "ISO 14001", crm: "ISO 14001" },
  "como-fazer-o-levantamento-de-aspectos-e-impactos-ambientais-da-minha-empresa": {
    display: "ISO 14001",
    crm: "ISO 14001",
  },
  "como-identificar-aspecto-impacto-ambiental": { display: "ISO 14001", crm: "ISO 14001" },
  "iso-45001": { display: "ISO 45001", crm: "ISO 45001" },
  "iso-27001": { display: "ISO 27001", crm: "ISO 27001" },
  // ISO 42001: display para headline; crm vazio até o Orbit ter cf_produto próprio
  // (valor inválido cega todos os custom fields — mesmo padrão do 17025).
  "iso-42001": { display: "ISO 42001", crm: "" },
  "iso-22000": { display: "FSSC 22000", crm: "FSSC 22000" },
  "fssc-22000": { display: "FSSC 22000", crm: "FSSC 22000" },
  "iso-17025": { display: "ISO 17025", crm: "" }, // sem opção no cf_produto do CRM
  "acreditacao-iso-17025-etapas": { display: "ISO 17025", crm: "" },
  "documentacao-iso-17025": { display: "ISO 17025", crm: "" },
  "iso-17025-vs-iso-9001": { display: "ISO 17025", crm: "" },
  "o-que-mudou-na-iso-170252017": { display: "ISO 17025", crm: "" },
  "pbqp-h": { display: "PBQP-H", crm: "PBQP-H" },
  "o-que-e-sassmaq": { display: "SASSMAQ", crm: "SASSMAQ" },
  "o-que-e-a-iso-37001": { display: "ISO 37001", crm: "ISO 37001" },
  "consultoria-iso-37001": { display: "ISO 37001", crm: "ISO 37001" },

  // --- alta intenção comercial (quem já está decidindo) ---
  "quanto-custa-iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "passo-a-passo-certificacao-iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "iso-9001-requisitos-tudo-que-voce-precisa-saber": { display: "ISO 9001", crm: "ISO 9001" },
  "consultoria-iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "como-escolher-consultoria-iso": { display: "ISO 9001", crm: "ISO 9001" },
  "gestao-indicadores-iso-9001-2026-requisitos-6-2-e-9-1": { display: "ISO 9001", crm: "ISO 9001" },
  "consultoria-iso-9001-imobiliaria": { display: "ISO 9001", crm: "ISO 9001" },
  "manter-certificacao-iso-apos-certificar": { display: "ISO 9001", crm: "ISO 9001" },
  "homologacao-fornecedores-iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "consultoria-iso-9001-pme-remota": { display: "ISO 9001", crm: "ISO 9001" },
  "iso-9001-cliente-edital-exige-certificado": { display: "ISO 9001", crm: "ISO 9001" },
  // GERIC é a fila técnica da Caixa para financiar obra. O CRM tem produto próprio
  // para isso, então o lead entra como GERIC — e não como PBQP-H, que é o meio.
  "principais-duvidas-sobre-o-geric": { display: "GERIC", crm: "GERIC" },

  // --- teste: maior página do blog por impressão (372k/6 meses), intenção de processo.
  // Público é de qualidade/processos, mas não está pesquisando norma. Se o form não
  // converter aqui em ~60 dias, tire desta lista antes de tirar das outras.
  "o-que-e-fluxograma-de-processos": { display: "ISO 9001", crm: "ISO 9001" },
  "mapeamento-de-processos-e-a-iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "as-sete-ferramentas-da-qualidade": { display: "ISO 9001", crm: "ISO 9001" },
  "o-que-e-nao-conformidade": { display: "ISO 9001", crm: "ISO 9001" },
  "a-qualificacao-de-fornecedores-segundo-a-iso-90012015": { display: "ISO 9001", crm: "ISO 9001" },

  // --- fundo de funil da vertical de ISO 27001 (10/09/2026) ---
  // As três páginas em que o leitor já não está perguntando "o que é": está decidindo
  // como fazer, com quem e por quanto. "consultoria iso 27001" (549 impressões em 6
  // meses, posição 19,5) e "contratar consultoria iso 27001" são consulta de compra —
  // o form aqui é o próximo passo, não interrupção.
  "consultoria-iso-27001": { display: "ISO 27001", crm: "ISO 27001" },
  "como-implementar-a-iso-27001": { display: "ISO 27001", crm: "ISO 27001" },
  "certificacao-iso-27001-etapas-prazo-custo": { display: "ISO 27001", crm: "ISO 27001" },
  "como-implementar-a-iso-27701": { display: "ISO 27001", crm: "ISO 27001" },
  "certificacao-iso-27701-etapas-e-requisitos": { display: "ISO 27001", crm: "ISO 27001" },
  "iso-27701-lgpd-gdpr-conformidade": { display: "ISO 27001", crm: "ISO 27001" },
  "iso-27701-2025-o-que-muda-independencia-da-iso-27001": { display: "ISO 27001", crm: "ISO 27001" },
  "consultoria-iso-27701": { display: "ISO 27001", crm: "ISO 27001" },
  "iso-27000-vs-iso-27001": { display: "ISO 27001", crm: "ISO 27001" },
  "iso-27001-anexo-a-mapeamento-politicas": { display: "ISO 27001", crm: "ISO 27001" },
  "semana-mundial-da-qualidade-2026": { display: "ISO 9001", crm: "ISO 9001" },

  // --- fundo de funil da vertical de FSSC 22000 (10/09/2026) ---
  // "certificação fssc 22000" e "requisitos fssc 22000" são consulta de quem já tem a
  // exigência do cliente na mesa; o form é o passo seguinte. O `crm` é FSSC 22000 nas
  // duas — é o produto que o comercial atende, mesmo quando a página fala de ISO 22000.
  "certificacao-fssc-22000": { display: "FSSC 22000", crm: "FSSC 22000" },
  "requisitos-fssc-22000": { display: "FSSC 22000", crm: "FSSC 22000" },
  "fssc-22000-vs-iso-22000-na-pratica": { display: "FSSC 22000", crm: "FSSC 22000" },
  "como-obter-certificacao-fssc-22000-brasil": { display: "FSSC 22000", crm: "FSSC 22000" },
  "fssc-22000-organismos-certificadores-brasil": { display: "FSSC 22000", crm: "FSSC 22000" },
  "consultoria-iso-sistema-integrado-9001-14001": { display: "SGI", crm: "SGI" },
  "consultoria-iso-9001-construcao-civil-licitacoes": { display: "ISO 9001", crm: "ISO 9001" },
  "consultoria-iso-evidencias-auditoria-externa": { display: "ISO 9001", crm: "ISO 9001" },
  "consultoria-iso-14001": { display: "ISO 14001", crm: "ISO 14001" },
  "consultoria-iso-45001": { display: "ISO 45001", crm: "ISO 45001" },
  "quanto-custa-iso-45001": { display: "ISO 45001", crm: "ISO 45001" },
  "iso-45001-requisitos-tudo-que-voce-precisa-saber": { display: "ISO 45001", crm: "ISO 45001" },
  "nr-1-e-iso-45001": { display: "ISO 45001", crm: "ISO 45001" },
  "iso-45001-cliente-edital-exige-certificado": { display: "ISO 45001", crm: "ISO 45001" },
  "passo-a-passo-certificacao-iso-45001": { display: "ISO 45001", crm: "ISO 45001" },
  "iso-45003-vs-iso-45001": { display: "ISO 45001", crm: "ISO 45001" },
  "iso-45001-perigos": { display: "ISO 45001", crm: "ISO 45001" },
  "consultoria-iso-sistema-integrado-9001-14001-45001": { display: "SGI", crm: "SGI" },

  // --- pilar da vertical de NR-1 (riscos psicossociais) ---
  // Ganha o formulário completo por dois motivos: a fiscalização punitiva já começou
  // (26/05/2026), então a intenção aqui é resolver um problema com prazo vencido, não
  // pesquisar conceito; e o `crm` é ISO 45001 porque a NR-1 não é certificável — o que a
  // Templum implanta é o sistema de gestão de SST (mesmo mapeamento de data/normas.js).
  "nr-1-riscos-psicossociais": { display: "NR-1", crm: "ISO 45001" },
};

export function normaDoForm(slug) {
  return LEAD_FORM_PAGES[slug] || null;
}
