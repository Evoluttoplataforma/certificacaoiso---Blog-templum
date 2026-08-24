// Gera src/data/populares.json — ranking de posts por CLIQUES orgânicos, usado
// pela home pra listar "mais acessados" em vez de "mais recentes".
//
// Fonte: export do Search Console (pasta "…-Performance-on-Search-<data>/", arquivo
// "Páginas.csv"). O CSV NÃO entra no repo (fica fora, é export bruto); o que entra é
// este JSON derivado, pequeno e legível no diff.
//
// Uso:
//   node scripts/populares.mjs "../certificacaoiso.com.br-Performance-on-Search-2026-08-07"
//
// Pra atualizar o ranking: baixe um export novo do Search Console (Desempenho →
// Exportar → CSV), rode o comando acima apontando pra pasta nova e commite o JSON.
// Prefira a janela de 6 meses: 16 meses deixa o ranking preso no tráfego antigo.

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SITE = "https://certificacaoiso.com.br/";
// Prefixos que não são post (iscas, listagens, busca, arquivos, CMS).
const NAO_POST = new Set(["presentes", "categoria", "buscar", "wp-content", "acesso", "assets", "fonts"]);

// --- Redirects: o cliente do Search Console não sabe que a URL mudou -------------
// O export traz a URL que o Google indexou, que pode ser um slug antigo. Sem resolver,
// os cliques ficam arquivados num slug que não é página, e o post real desaba no
// ranking — que é justamente o que ordena "Mais acessados" na home.
//
// Caso concreto que motivou isto: /pbqp-h-2/ tinha 237 cliques e /pbqp-h/ tinha 51.
// O primeiro é 301 pro segundo desde a migração. Resultado: a página real aparecia em
// #58 quando o tráfego dela é de #13 — e a norma que mais vende para construtora ficava
// enterrada na home. São 22 slugs nessa situação, 456 cliques.
function mapaDeRedirects() {
  const bruto = new Map();
  let txt = "";
  try { txt = readFileSync(resolve("public/_redirects"), "utf8"); }
  catch { console.warn("[populares] sem public/_redirects — ranking sem resolver slug antigo"); return bruto; }
  for (const linha of txt.split("\n")) {
    // só redirect de slug pra slug: "/de/ /para/ 301". Ignora o que vai pra /form/?…
    // (isca descontinuada, não é post) e o que tem querystring ou subpasta.
    const m = linha.trim().match(/^\/([^\s/?]+)\/?\s+\/([^\s/?]+)\/?\s+30[12]$/);
    if (m && m[1] !== m[2]) bruto.set(m[1], m[2]);
  }
  // Resolve cadeia (a→b→c vira a→c). Corta em 10 saltos: _redirects é escrito à mão e
  // um ciclo acidental (a→b→a) travaria o build num while infinito.
  const final = new Map();
  for (const de of bruto.keys()) {
    let para = de;
    for (let i = 0; i < 10 && bruto.has(para); i++) para = bruto.get(para);
    if (para !== de) final.set(de, para);
  }
  return final;
}

// CSV do Search Console: campos podem vir entre aspas (título com vírgula).
function parseCSV(txt) {
  const linhas = [];
  let campo = "";
  let linha = [];
  let dentroDeAspas = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (dentroDeAspas) {
      if (c === '"') {
        if (txt[i + 1] === '"') { campo += '"'; i++; } else dentroDeAspas = false;
      } else campo += c;
    } else if (c === '"') dentroDeAspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

const pasta = process.argv[2];
if (!pasta) {
  console.error('uso: node scripts/populares.mjs "<pasta do export do Search Console>"');
  process.exit(1);
}

const dir = resolve(pasta);
const paginas = parseCSV(readFileSync(join(dir, "Páginas.csv"), "utf8").replace(/^﻿/, ""));
paginas.shift(); // cabeçalho

// Período do export (pra registrar no JSON de onde o ranking veio).
let periodo = "desconhecido";
try {
  const filtros = parseCSV(readFileSync(join(dir, "Filtros.csv"), "utf8").replace(/^﻿/, ""));
  periodo = (filtros.find((l) => l[0] === "Data") || [])[1] || periodo;
} catch { /* export sem Filtros.csv — segue sem o período */ }

const redirects = mapaDeRedirects();
const porSlug = new Map();
const fundidos = [];
for (const linha of paginas) {
  const [url, cliquesTxt] = linha;
  if (!url || !url.startsWith(SITE)) continue;
  const cliques = Number(cliquesTxt);
  if (!Number.isFinite(cliques) || cliques <= 0) continue;

  const caminho = url.slice(SITE.length).replace(/\/$/, "");
  if (!caminho || caminho.includes("/")) continue;      // home e URLs com subpasta
  if (NAO_POST.has(caminho) || caminho.includes(".")) continue; // listagens e arquivos

  // Slug antigo soma no destino, em vez de virar uma linha própria no ranking.
  const slug = redirects.get(caminho) || caminho;
  if (slug !== caminho) fundidos.push({ de: caminho, para: slug, cliques });
  porSlug.set(slug, (porSlug.get(slug) || 0) + cliques);
}
const ranking = [...porSlug].map(([slug, cliques]) => ({ slug, cliques }));
ranking.sort((a, b) => b.cliques - a.cliques);

const saida = {
  _comentario: "Gerado por scripts/populares.mjs a partir do export do Search Console. Não editar à mão.",
  geradoEm: new Date().toISOString().slice(0, 10),
  periodo,
  metrica: "cliques organicos (Search Console)",
  ranking,
};

const destino = resolve("src/data/populares.json");
writeFileSync(destino, JSON.stringify(saida, null, 2) + "\n");
console.log(`populares.json: ${ranking.length} posts · período "${periodo}" · topo: ${ranking.slice(0, 3).map((r) => r.slug).join(", ")}`);

// Relatório dos slugs fundidos. Sai na tela de propósito: é a única pista de que um post
// subiu no ranking sem ganhar um clique novo, e quem for comparar dois JSON no diff
// precisa saber por quê.
if (fundidos.length) {
  console.log(`\n${fundidos.length} slug(s) antigo(s) somado(s) no destino (301 em public/_redirects):`);
  for (const f of fundidos.sort((a, b) => b.cliques - a.cliques)) {
    const pos = ranking.findIndex((r) => r.slug === f.para) + 1;
    console.log(`  ${String(f.cliques).padStart(4)} cliques · ${f.de} → ${f.para} (agora #${pos})`);
  }
}
