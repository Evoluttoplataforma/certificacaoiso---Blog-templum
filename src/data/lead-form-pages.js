// Páginas que recebem o formulário de consultoria no fim do artigo (LeadForm.astro).
//
// Por que uma lista curada, e não o blog inteiro: o form pede 6 campos. Em página de
// intenção informacional pura ("o que é fluxograma") ele custa espaço e converte pouco;
// em página de norma, onde o leitor está avaliando certificar, ele é o próximo passo
// natural. A régua da seleção foi impressão no Search Console (6 meses até 07/08/2026)
// cruzada com intenção comercial.
//
// O valor é o NOME DA NORMA que entra na headline ("Precisa de consultoria para X?") e
// no campo `norma` do lead. É explícito de propósito: derivar da tag via ctaParaNorma()
// erraria em página sem CTA próprio — /iso-17025/ cairia em "ISO 9001", que é a norma
// errada para quem lê sobre acreditação de laboratório.
//
// Ao adicionar página nova: confirme que o artigo realmente fala da norma do rótulo.
// Headline prometendo consultoria de norma que o artigo não trata queima confiança.
export const LEAD_FORM_PAGES = {
  // --- pilares de norma (maior volume de impressão) ---
  "iso-9001": "ISO 9001",
  "iso-14001-2": "ISO 14001",
  "iso-45001": "ISO 45001",
  "iso-27001": "ISO 27001",
  "iso-22000": "ISO 22000",
  "iso-17025": "ISO 17025",
  "pbqp-h": "PBQP-H",
  "o-que-e-sassmaq": "SASSMAQ",
  "o-que-e-a-iso-37001": "ISO 37001",

  // --- alta intenção comercial (quem já está decidindo) ---
  "quanto-custa-iso-9001": "ISO 9001",
  "passo-a-passo-certificacao-iso-9001": "ISO 9001",
  "iso-9001-requisitos-tudo-que-voce-precisa-saber": "ISO 9001",
  // GERIC é a fila técnica da Caixa para financiar obra: quem lê é construtora,
  // e o que destrava o processo é a qualificação PBQP-H.
  "principais-duvidas-sobre-o-geric": "PBQP-H",

  // --- teste: maior página do blog por impressão (372k/6 meses), intenção de processo.
  // Público é de qualidade/processos, mas não está pesquisando norma. Se o form não
  // converter aqui em ~60 dias, tire desta lista antes de tirar das outras.
  "o-que-e-fluxograma-de-processos": "ISO 9001",
};

export function normaDoForm(slug) {
  return LEAD_FORM_PAGES[slug] || null;
}
