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

const ranking = [];
for (const linha of paginas) {
  const [url, cliquesTxt] = linha;
  if (!url || !url.startsWith(SITE)) continue;
  const cliques = Number(cliquesTxt);
  if (!Number.isFinite(cliques) || cliques <= 0) continue;

  const caminho = url.slice(SITE.length).replace(/\/$/, "");
  if (!caminho || caminho.includes("/")) continue;      // home e URLs com subpasta
  if (NAO_POST.has(caminho) || caminho.includes(".")) continue; // listagens e arquivos

  ranking.push({ slug: caminho, cliques });
}
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
