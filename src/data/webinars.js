// Webinars gratuitos da Templum — toda QUARTA às 16h (horário de Brasília).
//
// Fonte de verdade única do card de webinar (WebinarCard.astro), que aparece na sidebar
// no desktop e no fim do artigo no mobile, nos 1.015 posts. Editar aqui é o único passo
// pra virar o mês: a troca semanal acontece sozinha, sem deploy (o card escolhe no
// navegador do leitor — ver o comentário no componente).
//
// Regras de quem escreve aqui:
//   · `inicio` é o começo (16h de Brasília) e `fim`, o instante em que o webinar deixa de
//     ser anunciado, ambos em UTC. `inicio` existe para o dock do mobile dizer "hoje às
//     16h" / "amanhã" em vez de só a data. 16h de Brasília
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
    inicio: "2026-08-19T19:00:00Z",
    fim: "2026-08-19T20:30:00Z",
    data: "19/08",
    titulo: "Análise Crítica pela Direção",
    requisito: "Requisito 9.3",
    url: "https://templum.com.br/webinar-analise-critica-iso9001/",
  },
  {
    slug: "gestao-mudancas",
    inicio: "2026-08-26T19:00:00Z",
    fim: "2026-08-26T20:30:00Z",
    data: "26/08",
    titulo: "Gestão de Mudanças",
    requisito: "Requisitos 6.3 e 8.5.6",
    url: "https://templum.com.br/webinar-gestao-mudancas-iso9001/",
  },
  {
    slug: "nao-conformidades",
    inicio: "2026-09-02T19:00:00Z",
    fim: "2026-09-02T20:30:00Z",
    data: "02/09",
    titulo: "Não Conformidade e Ação Corretiva",
    requisito: "Requisito 10.2",
    url: "https://templum.com.br/webinar-nao-conformidades-iso9001/",
  },
  {
    slug: "gestao-treinamentos",
    inicio: "2026-09-09T19:00:00Z",
    fim: "2026-09-09T20:30:00Z",
    data: "09/09",
    titulo: "Gestão de Treinamentos e Competência",
    requisito: "Requisitos 7.2 e 7.3",
    url: "https://templum.com.br/webinar-gestao-treinamentos-iso9001/",
  },
  {
    slug: "gestao-indicadores",
    inicio: "2026-09-16T19:00:00Z",
    fim: "2026-09-16T20:30:00Z",
    data: "16/09",
    titulo: "Gestão de Indicadores",
    requisito: "Requisitos 6.2 e 9.1",
    url: "https://templum.com.br/webinar-gestao-indicadores-iso9001/",
  },
  {
    slug: "gestao-processos",
    inicio: "2026-09-23T19:00:00Z",
    fim: "2026-09-23T20:30:00Z",
    data: "23/09",
    titulo: "Gestão de Processos",
    requisito: "Requisito 4.4",
    url: "https://templum.com.br/webinar-gestao-processos-iso9001/",
  },
  {
    slug: "controle-documentos",
    inicio: "2026-09-30T19:00:00Z",
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
export const WEBINARS_CLIENTE = WEBINARS.map(({ slug, inicio, fim, data, titulo, url }) => ({
  slug, inicio, fim, data, titulo, url,
}));

// Rótulo de urgência do dock: "HOJE ÀS 16H" vale mais que "19/08" para quem decide
// participar. Compara DIA no fuso de Brasília — comparar instantes UTC erraria por 3h
// e chamaria de "hoje" um webinar que no Brasil já é amanhã.
// ATENÇÃO: esta lógica está espelhada no script inline do WebinarDock.astro, porque
// script inline não importa módulo. Mudou aqui, muda lá.
export function urgenciaDoWebinar(w, agora = Date.now()) {
  const emBrasilia = (t) => new Date(t).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const hora = new Date(w.inicio).toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit" });
  const alvo = emBrasilia(w.inicio);
  if (alvo === emBrasilia(agora)) return `Hoje às ${hora}h`;
  if (alvo === emBrasilia(agora + 86400000)) return `Amanhã às ${hora}h`;
  return `Quarta, ${alvo.slice(0, 5)} às ${hora}h`;
}
