// Posts que rodam o layout LONGFORM (experimento aberto em 21/08/2026).
//
// De onde vem: o antihype.com.br/long/* usa um conjunto de decisões editoriais que
// nenhum blog de norma usa, e três delas custam só CSS aqui — coluna de leitura curta
// com serifada maior, seção numerada (01., 02., …) e um trilho de índice fixo na
// margem direita, no lugar que a sidebar de CTAs desocupou.
//
// Por que ligado por slug e não em todo post: são 1.020 artigos escritos por gente
// diferente ao longo de 15 anos. Serifada em texto de 400 palavras com três subtítulos
// não vira "longform", vira post estranho — e o trilho só faz sentido com 5+ seções.
// Então entra um post por vez, medido, em vez de virar a chave nos mil.
//
// Critério para entrar: 1.200+ palavras E 5+ h2. Fora disso o layout não tem o que
// mostrar.
export const LONGFORM = new Set([
  "analise-critica-pela-direcao-requisito-9-3-iso-9001-2026",
]);

export function ehLongform(slug) {
  return LONGFORM.has(slug);
}
