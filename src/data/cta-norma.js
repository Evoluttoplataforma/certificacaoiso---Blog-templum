// CTA da Olívia contextualizado por norma.
//
// Por que: "Receba um diagnóstico gratuito da sua empresa" é a mesma frase para
// quem lê sobre backup de ISO 27001 e para quem lê sobre PBQP-H em canteiro. O
// leitor chega ao card com uma dor específica na cabeça; falar a língua dela
// converte mais do que uma promessa genérica.
//
// Detecção: a tag vem antes da categoria. Em lib/posts.js, `categories` é
// [category_name, ...tags] — a tag costuma nomear a norma ("ISO 27001"), enquanto
// a categoria é larga ("Segurança e Compliance" abriga 27001, LGPD e 37001).
//
// `slug` alimenta utm_term, para dar pra medir conversão POR NORMA no diagnóstico
// em vez de olhar um número só do blog inteiro.

const CTAS = {
  "iso-9001": {
    titulo: "Sua ISO 9001 está de pé?",
    texto: "Receba um diagnóstico gratuito do seu sistema de gestão da qualidade e veja o que o auditor encontraria hoje.",
  },
  "iso-27001": {
    titulo: "Sua segurança da informação passa em auditoria?",
    texto: "Diagnóstico gratuito do seu SGSI: onde estão as lacunas de controle, antes de o auditor apontar.",
  },
  "iso-14001": {
    titulo: "Seu sistema ambiental está completo?",
    texto: "Diagnóstico gratuito do seu SGA: aspecto significativo sem controle, requisito legal e o que falta para certificar.",
  },
  "iso-45001": {
    titulo: "Sua gestão de SST protege de verdade?",
    texto: "Diagnóstico gratuito: perigos sem controle, integração com as NRs e o que a auditoria vai cobrar.",
  },
  // NR-1 tem CTA próprio, e não o de SST genérico, porque quem chega aqui não está
  // pesquisando sistema de gestão: está com um prazo vencido na cabeça (a fiscalização
  // punitiva começou em 26/05/2026) e uma pergunta só — "meu PGR está irregular?".
  "nr-1": {
    titulo: "Seu PGR já contempla os riscos psicossociais?",
    texto: "Diagnóstico gratuito: o que o auditor-fiscal vai pedir, o que falta no seu inventário de riscos e como sair da irregularidade.",
  },
  "iso-22000": {
    titulo: "Sua operação está segura para a auditoria?",
    texto: "Diagnóstico gratuito de segurança dos alimentos: pré-requisitos, HACCP e o que os clientes exigem.",
  },
  "pbqp-h": {
    titulo: "Sua construtora está pronta para o PBQP-H?",
    texto: "Diagnóstico gratuito: nível de qualificação, evidência de canteiro e o que falta para a auditoria do SiAC.",
  },
  sassmaq: {
    titulo: "Sua operação atende ao SASSMAQ?",
    texto: "Diagnóstico gratuito para transportadoras: requisitos de segurança e qualidade que os embarcadores cobram.",
  },
  compliance: {
    titulo: "Seu programa de compliance se sustenta?",
    texto: "Diagnóstico gratuito: governança, controles antissuborno e as evidências que a auditoria pede.",
  },
  esg: {
    titulo: "Sua agenda ESG tem indicador?",
    texto: "Diagnóstico gratuito: o que já dá para provar com dado e o que ainda é discurso.",
  },
  auditoria: {
    titulo: "Vai passar por auditoria?",
    texto: "Diagnóstico gratuito: veja as não conformidades que o auditor encontraria — antes de ele chegar.",
  },
  // sem norma detectada (Gestão e Marketing, IA e afins): mantém a copy original
  default: {
    titulo: "Fale com a Olívia",
    texto: "Receba um diagnóstico gratuito da sua empresa e descubra como a Templum pode te ajudar.",
  },
};

// Regras aplicadas às TAGS. Ordem importa: o mais específico primeiro.
// "27701" e "LGPD" caem no guarda-chuva da 27001 porque o diagnóstico de segurança
// da informação atende os três.
// Cuidado que já custou caro: NÃO usar /complian/ aqui. A categoria chama-se
// "Segurança e Compliance", então essa regra capturava todo post de ISO 27001 e
// LGPD para o CTA de antissuborno. Compliance só entra por 37001/37301/suborno.
const REGRAS = [
  // NR-1 e psicossocial ANTES da regra de 45001: aquela captura /nr-?\d/, então sem esta
  // linha toda a vertical de NR-1 receberia o CTA genérico de SST.
  [/\bnr\s*-?\s*0?1\b|psicossoc|sa[úu]de mental|burnout|ass[ée]dio/i, "nr-1"],
  [/\b27701\b|\b27001\b|\blgpd\b|criptograf|mascaramento|prote[çc][ãa]o de dados|seguran[çc]a da informa[çc][ãa]o/i, "iso-27001"],
  [/\b37001\b|\b37301\b|antissuborno|suborno|integridade corporativa/i, "compliance"],
  [/\b45001\b|\bsst\b|\bsso\b|\bnr-?\d|seguran[çc]a do trabalho|ocupacional|\bepi\b/i, "iso-45001"],
  [/\b14001\b|ambient|res[íi]duo|efluente/i, "iso-14001"],
  [/\b22000\b|haccp|alimen|food/i, "iso-22000"],
  [/pbqp|siac|constru[çc][ãa]o civil|canteiro|\bobra\b/i, "pbqp-h"],
  [/sassmaq|transporte|log[íi]stic/i, "sassmaq"],
  [/\besg\b|sustentabil/i, "esg"],
  [/auditoria|n[ãa]o conformidade|causa raiz/i, "auditoria"],
  [/\b9001\b|qualidade/i, "iso-9001"],
];

// Fallback por CATEGORIA — mapa explícito em vez de regex, porque o conjunto é
// fechado (data/categorias.js) e assim o resultado é previsível. As categorias
// ausentes (Gestão e Marketing, IA) caem no CTA genérico de propósito: não há
// norma a oferecer e prometer diagnóstico de norma ali seria promessa torta.
const POR_CATEGORIA = {
  "Qualidade e Inovação": "iso-9001",
  "Construção Civil": "pbqp-h",
  "Segurança dos Alimentos": "iso-22000",
  "Meio Ambiente": "iso-14001",
  "Saúde e Segurança do Trabalho": "iso-45001",
  Auditoria: "auditoria",
  "Segurança e Compliance": "iso-27001",
  "Transportes e Logística": "sassmaq",
  ESG: "esg",
};

// Slug do CTA → rótulo da norma, para a chamada do card da sidebar ("Precisa da X?").
//
// Existe porque os dois sinais têm alcances diferentes: normaDaPagina() (data/normas.js)
// só acerta quando a norma está escrita no título, no slug ou nas tags, e 63% dos posts
// não a escrevem; a CATEGORIA sabe (POR_CATEGORIA acima). É a mesma divisão de trabalho
// que a tarja do topo já usa em [slug].astro: a headline pode falar pelo sinal largo da
// categoria, enquanto o `norma=` da URL — que alimenta o cf_produto do CRM — continua
// vindo só do sinal preciso. Errar a headline custa um clique; errar o cf_produto cega
// o lead inteiro (ver o comentário em data/lead-form-pages.js).
//
// "auditoria" e "geral" ficam FORA de propósito: não há norma a nomear ali, e a chamada
// cai no "Precisa certificar sua empresa?" — prometer norma que o artigo não trata é o
// erro que a própria copy deste arquivo existe para evitar.
export const ROTULO_DO_CTA = {
  "iso-9001": "ISO 9001",
  "iso-27001": "ISO 27001",
  "iso-14001": "ISO 14001",
  "iso-45001": "ISO 45001",
  "iso-22000": "ISO 22000",
  "nr-1": "NR-1",
  "pbqp-h": "PBQP-H",
  sassmaq: "SASSMAQ",
  // O CTA de compliance é o de antissuborno (só 37001/37301 caem nele — ver REGRAS).
  compliance: "ISO 37001",
  esg: "ESG",
};

export function ctaParaNorma(categories = []) {
  const cat = categories[0] || "";
  const tags = categories.slice(1);
  // 1) tags — sinal mais preciso, costumam nomear a norma
  for (const tag of tags) {
    for (const [re, chave] of REGRAS) {
      if (re.test(tag)) return { slug: chave, ...CTAS[chave] };
    }
  }
  // 2) categoria — mapa explícito
  const porCat = POR_CATEGORIA[cat];
  if (porCat) return { slug: porCat, ...CTAS[porCat] };
  // 3) último recurso: tentar as regras no nome da categoria (categoria nova/não curada)
  for (const [re, chave] of REGRAS) {
    if (re.test(cat)) return { slug: chave, ...CTAS[chave] };
  }
  return { slug: "geral", ...CTAS.default };
}
