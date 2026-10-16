#!/usr/bin/env node
/** Fase 2 vertical migração: rodapé trilha, satélite 7.1.6, guia e pilar. */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function run(args) {
  const r = spawnSync("node", args, { cwd: ROOT, stdio: "inherit", shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run(["supabase/posts/_patch-rodape-migracao-2026.mjs"]);
run(["supabase/posts/_publish-conhecimento-7-1-6.mjs"]);

for (const slug of [
  "guia-definitivo-das-mudancas-iso-2026",
  "passo-a-passo-migracao-iso-9001-2015-para-2026",
  "conhecimento-organizacional-iso-9001-2026-requisito-7-1-6",
  "gestao-processos-iso-9001-2026-requisito-4-4",
  "gestao-indicadores-iso-9001-2026-requisitos-6-2-e-9-1",
  "nao-conformidade-acao-corretiva-iso-9001-2026-requisito-10-2",
]) {
  run(["supabase/aplicar-conteudo.mjs", slug]);
}

console.log("Lote migração fase 2 OK.");
