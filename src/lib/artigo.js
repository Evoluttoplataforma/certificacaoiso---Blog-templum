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
