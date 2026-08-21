// Transformações no HTML do artigo, feitas NO BUILD.
//
// Por que aqui e não no CMS/Supabase: o corpo do post é um blob de HTML herdado da
// migração do WordPress — 1.002 posts, escritos por gente diferente ao longo de anos.
// Consertar âncora e enfiar CTA post a post no banco seria irreversível e desigual;
// feito no build, vale para todos, sai igual e reverte apagando o import.
//
// As duas funções operam por REGEX e não por parser de DOM de propósito: o único
// recorte que interessa é `<h2>`, que não aninha e sempre vem no nível de topo do
// corpo. Trazer um parser (rehype/cheerio) para isso custaria dependência nova e
// tempo de build vezes mil posts, sem ganhar precisão onde importa.

// Acentos fora, minúsculas, resto vira hífen. NFD separa a letra do acento; o range
// ̀-ͯ é o bloco dos diacríticos combinantes, que então se joga fora.
// Escapado em \u de propósito: escrito como caractere literal, o range some em
// qualquer editor ou pipeline que normalize o arquivo — e a função passa a devolver
// slug com acento, calada.
function slugificar(txt) {
  return txt
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Texto visível de dentro de um cabeçalho: tira tags (h2 costuma abrir com <strong> ou
// <span> nos posts antigos), resolve as entidades que de fato aparecem e junta espaços.
function textoDe(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;|&#34;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Cabeçalhos que são NAVEGAÇÃO, não seção do artigo — "Leia mais" e parentes aparecem
// no fim de 21 posts, apontando para outros textos. Num sumário eles prometem conteúdo
// que não existe naquela página. O id continua sendo injetado (pode haver link antigo
// apontando para lá); só não entram na lista.
// Casamento ancorado e curto de propósito: "leia mais sobre a cláusula 5.3" É seção de
// verdade, e um /leia mais/ solto a comeria.
const SO_NAVEGACAO = /^(leia|veja|saiba)\s+(mais|tamb[ée]m)$/i;

/**
 * Garante `id` em todo <h2> do corpo e devolve as seções para montar o sumário.
 *
 * Dos 3.475 h2 do blog, 2.135 (61%) já tinham id vindo do WordPress — e há link
 * interno apontando para eles (o FAQ do template usa #duvidas justamente assim).
 * Por isso o id existente é SEMPRE preservado; só quem não tem ganha um, prefixado
 * com `sec-` para nunca colidir com os ids do próprio template (#consultoria,
 * #leadForm, #cmt-list e os lf-*).
 *
 * @returns {{ html: string, secoes: Array<{id: string, titulo: string}> }}
 */
export function ancorarSecoes(html) {
  if (!html) return { html: "", secoes: [] };

  // Semeia os usados com TODO id já presente no corpo — inclusive de outras tags —
  // senão um `sec-requisitos` gerado poderia bater com um id de <div> logo abaixo e
  // o navegador rolaria para o elemento errado.
  const usados = new Set();
  for (const m of html.matchAll(/\bid=["']([^"']+)["']/gi)) usados.add(m[1]);

  const secoes = [];
  // Rótulo repetido não pode virar dois itens: 3 posts trazem o mesmo h2 duas vezes (uma
  // delas repete a lista inteira), e um sumário com duas linhas idênticas é defeito — o
  // leitor não tem como escolher entre elas. Fica a primeira, que é a que ele encontra
  // primeiro rolando.
  const rotulos = new Set();
  const out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (inteiro, attrs, dentro) => {
    const titulo = textoDe(dentro);
    // h2 vazio (só imagem, ou resquício de formatação) não vira item de sumário nem
    // ganha âncora: link para lugar sem rótulo é link que ninguém clica.
    if (!titulo) return inteiro;

    const chave = titulo.toLowerCase();
    const naLista = !SO_NAVEGACAO.test(titulo) && !rotulos.has(chave);
    if (naLista) rotulos.add(chave);

    const jaTem = attrs.match(/\bid=["']([^"']+)["']/i);
    if (jaTem) {
      if (naLista) secoes.push({ id: jaTem[1], titulo });
      return inteiro;
    }

    let base = "sec-" + (slugificar(titulo) || "secao");
    let id = base, n = 2;
    while (usados.has(id)) id = `${base}-${n++}`;
    usados.add(id);
    if (naLista) secoes.push({ id, titulo });
    return `<h2${attrs} id="${id}">${dentro}</h2>`;
  });

  return { html: out, secoes };
}

// Sumário ESCRITO À MÃO no corpo do post: um rótulo ("Neste artigo:", "Sumário",
// "Índice") seguido imediatamente de uma lista. Herança do WordPress — 281 dos 1.020
// posts trazem um, sempre no mesmo formato:
//
//   <p><strong>Neste artigo:</strong></p>
//   <ul><li><a href="#o-que-e-o-geric">O que é o GERIC…</a></li> … </ul>
//
// Desde que o template ganhou o <details> "Neste artigo", esses 281 mostravam DOIS
// índices na mesma página: o do template, fechado, e este, aberto, comendo até 400px da
// dobra num post de 15 seções.
//
// O rótulo precisa fechar imediatamente depois do texto (`</strong></p>`) — é isso que
// separa o índice de uma FRASE que começa igual. "Neste artigo, vamos explicar o que são
// o PBQP-H e o Geric…" abre parágrafo do mesmo jeito e não pode ser tocada.
const BLOCO_SUMARIO =
  /<(p|h[2-6])\b[^>]*>\s*(?:<(?:strong|b|em)\b[^>]*>\s*)?(?:(?:neste|nesse)\s+artigo|sum[áa]rio|[íi]ndice)\s*:?\s*(?:<\/(?:strong|b|em)>\s*)?<\/\1>\s*(<(ul|ol)\b[^>]*>[\s\S]*?<\/\3>)/gi;

// Contador do build, só para a linha de relatório no fim (ver o process.on abaixo). Se um
// dia esse número cair para perto de zero sem ninguém ter mexido no conteúdo, o formato
// do sumário no CMS mudou e a limpeza parou de casar — melhor descobrir no build do que
// pelo print de um leitor.
let _removidos = 0;
let _relatorioLigado = false;

/**
 * Remove o sumário escrito à mão do corpo, quando ele é só espelho das seções.
 *
 * A trava que importa: só remove se TODOS os links da lista forem âncora interna
 * (`href="#…"`). Lista com link para outro post não é índice, é "leia também" — e
 * apagá-la seria apagar conteúdo e link interno. Nos 281 posts de hoje são 100%
 * âncoras (medido em 21/08/2026), mas quem escrever diferente amanhã fica protegido.
 *
 * Não escreve nada no Supabase de propósito: o texto original continua no CMS, isto é
 * só o que o build renderiza. Reverter é apagar a chamada em [slug].astro.
 *
 * @returns {{ html: string, removidos: number }}
 */
export function removerSumarioEscrito(html) {
  if (!html) return { html: "", removidos: 0 };
  let removidos = 0;
  const out = html.replace(BLOCO_SUMARIO, (inteiro, _tag, lista) => {
    const hrefs = [...lista.matchAll(/href=["']([^"']*)["']/gi)].map((m) => m[1]);
    if (!hrefs.length || !hrefs.every((h) => h.startsWith("#"))) return inteiro;
    removidos++;
    return "";
  });
  _removidos += removidos;
  if (!_relatorioLigado && typeof process !== "undefined" && process.on) {
    _relatorioLigado = true;
    process.on("exit", () => {
      if (_removidos) console.log("sumário escrito à mão:", _removidos, "removidos do corpo no build");
    });
  }
  return { html: out, removidos };
}

/**
 * O post tem sumário escrito à mão no corpo?
 *
 * Usado por [slug].astro para não empilhar o <details> do template em cima de um sumário
 * que sobreviveu (acontece quando o post tem menos de 3 seções e a limpeza é barrada —
 * ali aquele sumário é o ÚNICO índice da página).
 *
 * Substitui um teste que era `/sum[áa]rio/i` no conteúdo inteiro: a PALAVRA, em qualquer
 * lugar. Três posts perdiam o índice do template por escreverem "Sumário dos achados",
 * "Crie um sumário" e "Sumário Executivo" dentro de uma tabela. Aqui a exigência é a
 * mesma estrutura que a remoção procura: rótulo fechado + lista logo depois.
 */
export function temSumarioEscrito(html) {
  if (!html) return false;
  // lastIndex fica sujo entre chamadas num regex /g compartilhado — daí o reset.
  BLOCO_SUMARIO.lastIndex = 0;
  return BLOCO_SUMARIO.test(html);
}

/**
 * Enfia um bloco de CTA no meio do corpo, na fronteira de um <h2>.
 *
 * Por que na fronteira de h2 e não a cada N parágrafos: cortar por parágrafo cai
 * dentro de lista, tabela e citação — o CTA nasceria dentro de um <ul> desses posts.
 * Antes de um h2 o corte é sempre no nível de topo.
 *
 * Escolhe o h2 mais perto da METADE do texto, dentro da janela 30%–70%. Fora dela o
 * bloco viraria quase-topo (competindo com a tarja da primeira dobra) ou quase-fim
 * (competindo com o CTA/formulário do rodapé) — e dois CTAs pedindo a mesma coisa
 * colados um no outro disputam o mesmo clique e derrubam os dois.
 *
 * Não faz nada se o post já traz um `.cta-olivia` escrito no corpo (21 posts, herança
 * das iscas descontinuadas em 19/08/2026): eles já têm o CTA do meio, à mão.
 */
export function injetarCtaMeio(html, bloco) {
  if (!html || !bloco) return html;
  if (html.includes("cta-olivia")) return html;

  const marcos = [...html.matchAll(/<h2[\s>]/gi)].map((m) => m.index);
  // Menos de 3 seções não tem "meio": o único candidato seria a primeira ou a última
  // fronteira, os dois lugares que a janela 30–70% existe para evitar.
  if (marcos.length < 3) return html;

  const totalTexto = textoDe(html).length;
  if (!totalTexto) return html;

  let melhor = -1, menorDist = Infinity;
  for (const i of marcos) {
    const razao = textoDe(html.slice(0, i)).length / totalTexto;
    if (razao < 0.3 || razao > 0.7) continue;
    const dist = Math.abs(razao - 0.5);
    if (dist < menorDist) { menorDist = dist; melhor = i; }
  }
  if (melhor < 0) return html;

  return html.slice(0, melhor) + bloco + html.slice(melhor);
}
