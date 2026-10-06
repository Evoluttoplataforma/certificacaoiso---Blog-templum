#!/usr/bin/env node
/** Batch GEO tráfego ISO 9001 — fluxograma, 7 ferramentas, NC, qualificação fornecedor */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const SLUGS = [
  "o-que-e-fluxograma-de-processos",
  "mapeamento-de-processos-e-a-iso-9001",
  "as-sete-ferramentas-da-qualidade",
  "o-que-e-nao-conformidade",
  "a-qualificacao-de-fornecedores-segundo-a-iso-90012015",
];

for (const slug of SLUGS) {
  const r = spawnSync("node", ["supabase/aplicar-conteudo.mjs", slug], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log("Batch ISO 9001 tráfego concluído.");
