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
  "iso-45001": { display: "ISO 45001", crm: "ISO 45001" },
  "iso-27001": { display: "ISO 27001", crm: "ISO 27001" },
  "iso-22000": { display: "FSSC 22000", crm: "FSSC 22000" },
  "iso-17025": { display: "ISO 17025", crm: "" }, // sem opção no cf_produto do CRM
  "pbqp-h": { display: "PBQP-H", crm: "PBQP-H" },
  "o-que-e-sassmaq": { display: "SASSMAQ", crm: "SASSMAQ" },
  "o-que-e-a-iso-37001": { display: "ISO 37001", crm: "ISO 37001" },

  // --- alta intenção comercial (quem já está decidindo) ---
  "quanto-custa-iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "passo-a-passo-certificacao-iso-9001": { display: "ISO 9001", crm: "ISO 9001" },
  "iso-9001-requisitos-tudo-que-voce-precisa-saber": { display: "ISO 9001", crm: "ISO 9001" },
  // GERIC é a fila técnica da Caixa para financiar obra. O CRM tem produto próprio
  // para isso, então o lead entra como GERIC — e não como PBQP-H, que é o meio.
  "principais-duvidas-sobre-o-geric": { display: "GERIC", crm: "GERIC" },

  // --- teste: maior página do blog por impressão (372k/6 meses), intenção de processo.
  // Público é de qualidade/processos, mas não está pesquisando norma. Se o form não
  // converter aqui em ~60 dias, tire desta lista antes de tirar das outras.
  "o-que-e-fluxograma-de-processos": { display: "ISO 9001", crm: "ISO 9001" },
};

export function normaDoForm(slug) {
  return LEAD_FORM_PAGES[slug] || null;
}
