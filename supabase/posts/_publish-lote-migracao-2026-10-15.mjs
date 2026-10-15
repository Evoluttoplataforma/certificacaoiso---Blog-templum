#!/usr/bin/env node
/** Publica pilar migração + interlinks (hub, transição, passo certificação). */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const r0 = spawnSync("node", ["supabase/posts/_publish-migracao-iso-9001-2026.mjs"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: true,
});
if (r0.status !== 0) process.exit(r0.status ?? 1);

const SLUGS = [
  "iso-9001",
  "transicao-iso-9001-2026-prazos-cronograma-global-aci",
  "passo-a-passo-certificacao-iso-9001",
];

for (const slug of SLUGS) {
  const r = spawnSync("node", ["supabase/aplicar-conteudo.mjs", slug], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log("Lote migração ISO 9001:2026 publicado.");
