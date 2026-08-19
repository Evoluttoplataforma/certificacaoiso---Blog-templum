// Webinars gratuitos da Templum — toda QUARTA às 16h (horário de Brasília).
//
// Fonte de verdade única do card de webinar (WebinarCard.astro), que aparece na sidebar
// no desktop e no fim do artigo no mobile, nos 1.015 posts. Editar aqui é o único passo
// pra virar o mês: a troca semanal acontece sozinha, sem deploy (o card escolhe no
// navegador do leitor — ver o comentário no componente).
//
// Regras de quem escreve aqui:
//   · `fim` é o instante em que o webinar deixa de ser anunciado, em UTC. 16h de Brasília
//     é 19h UTC e a sessão dura 1h30 → 20:30Z. UTC explícito de propósito: com data local
//     ("2026-08-19 16:00") o build no Cloudflare (UTC) e o navegador do leitor (BRT)
//     divergiriam em 3 horas, e o card viraria de webinar no meio da tarde de quarta.
//   · `titulo` sai do <title> da própria LP. Se divergir, o leitor clica esperando uma
//     coisa e recebe outra — e o criativo já mostra o assunto.
//   · `img` é gerado por scripts/webinars-webp.mjs a partir do criativo _feed do designer,
//     e o nome do arquivo é o slug daqui.
//
// Depois do último da lista o card SAI DO AR sozinho (fail-safe: melhor não anunciar nada
// do que anunciar um webinar que já aconteceu). Quando chegarem os criativos de outubro,
// é adicionar as linhas e rodar o script de conversão.
export const WEBINARS = [
  {
    slug: "analise-critica",
    fim: "2026-08-19T20:30:00Z",
    data: "19/08",
    titulo: "Análise Crítica pela Direção",
    requisito: "Requisito 9.3",
    url: "https://templum.com.br/webinar-analise-critica-iso9001/",
  },
  {
    slug: "gestao-mudancas",
    fim: "2026-08-26T20:30:00Z",
    data: "26/08",
    titulo: "Gestão de Mudanças",
    requisito: "Requisitos 6.3 e 8.5.6",
    url: "https://templum.com.br/webinar-gestao-mudancas-iso9001/",
  },
  {
    slug: "nao-conformidades",
    fim: "2026-09-02T20:30:00Z",
    data: "02/09",
    titulo: "Não Conformidade e Ação Corretiva",
    requisito: "Requisito 10.2",
    url: "https://templum.com.br/webinar-nao-conformidades-iso9001/",
  },
  {
    slug: "gestao-treinamentos",
    fim: "2026-09-09T20:30:00Z",
    data: "09/09",
    titulo: "Gestão de Treinamentos e Competência",
    requisito: "Requisitos 7.2 e 7.3",
    url: "https://templum.com.br/webinar-gestao-treinamentos-iso9001/",
  },
  {
    slug: "gestao-indicadores",
    fim: "2026-09-16T20:30:00Z",
    data: "16/09",
    titulo: "Gestão de Indicadores",
    requisito: "Requisitos 6.2 e 9.1",
    url: "https://templum.com.br/webinar-gestao-indicadores-iso9001/",
  },
  {
    slug: "gestao-processos",
    fim: "2026-09-23T20:30:00Z",
    data: "23/09",
    titulo: "Gestão de Processos",
    requisito: "Requisito 4.4",
    url: "https://templum.com.br/webinar-gestao-processos-iso9001/",
  },
  {
    slug: "controle-documentos",
    fim: "2026-09-30T20:30:00Z",
    data: "30/09",
    titulo: "Controle de Documentos",
    requisito: "Requisito 7.5",
    url: "https://templum.com.br/webinar-controle-documentos-iso9001/",
  },
];

// Primeiro webinar que ainda não terminou. `agora` entra por parâmetro pra a mesma função
// servir ao build (Node) e ao navegador (script inline), sem duas verdades sobre a regra.
export function webinarAtual(agora = Date.now()) {
  return WEBINARS.find((w) => +new Date(w.fim) > agora) || null;
}

// O que o script inline precisa saber, e nada além disso — o HTML de 1.015 páginas carrega
// isto embutido, então vai só o essencial (sem `requisito`, que não muda no swap).
export const WEBINARS_CLIENTE = WEBINARS.map(({ slug, fim, data, titulo, url }) => ({
  slug, fim, data, titulo, url,
}));
