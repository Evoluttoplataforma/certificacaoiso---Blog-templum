#!/usr/bin/env node
/** Publica pilar Global ACI + patches de interlink (out/2026). */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const r0 = spawnSync("node", ["supabase/posts/_publish-transicao-iso-9001-2026-global-aci.mjs"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: true,
});
if (r0.status !== 0) process.exit(r0.status ?? 1);

const SLUGS = [
  "iso-9001",
  "guia-definitivo-das-mudancas-iso-2026",
  "passo-a-passo-certificacao-iso-9001",
  "auditoria-interna-iso-9001-ferramentas",
  "checklist-preparacao-auditoria-interna-iso",
];

for (const slug of SLUGS) {
  const r = spawnSync("node", ["supabase/aplicar-conteudo.mjs", slug], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log("Lote transição ISO 9001:2026 publicado.");
