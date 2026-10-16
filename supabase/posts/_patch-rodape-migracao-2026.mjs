#!/usr/bin/env node
/**
 * Insere rodapé padronizado (pilar migração + prazos + diagnóstico) nos posts da trilha 2026.
 * Uso: node supabase/posts/_patch-rodape-migracao-2026.mjs [--dry]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(AQUI, "..", "..");
const dry = process.argv.includes("--dry");
const MARKER = "rodape-migracao-2026";

const RODAPE = `<p class="post-aprofunde" id="${MARKER}"><strong>Migração ISO 9001:2015 para 2026:</strong> <a href="/passo-a-passo-migracao-iso-9001-2015-para-2026/">passo a passo em 8 etapas</a> · <a href="/transicao-iso-9001-2026-prazos-cronograma-global-aci/">prazos Global ACI</a> · <a href="https://templum.com.br/ferramentas/diagnostico-iso-9001/?utm_source=blog&amp;utm_medium=organico&amp;utm_campaign=trilha-live-iso-9001-2026&amp;utm_term=rodape">diagnóstico gratuito</a></p>
`;

const SLUGS = [
  "nao-conformidade-acao-corretiva-iso-9001-2026-requisito-10-2",
  "treinamento-competencia-iso-9001-2026-requisito-7-2",
  "gestao-indicadores-iso-9001-2026-requisitos-6-2-e-9-1",
  "gestao-processos-iso-9001-2026-requisito-4-4",
  "controle-documentos-iso-9001-2026-requisito-7-5",
  "foco-no-cliente-iso-9001-2026-requisito-5-1",
  "politica-e-objetivos-iso-9001-2026-requisitos-5-2-e-6-2",
  "riscos-e-oportunidades-iso-9001-2026-separacao-clausula-6-1",
  "gestao-de-mudancas-iso-9001-2026-requisito-6-3",
  "analise-critica-pela-direcao-requisito-9-3-iso-9001-2026",
  "qualificacao-de-fornecedores-iso-9001-2026-requisito-8-4",
  "cultura-da-qualidade-na-iso-9001-2026-a-mudanca-mais-importante-da-nova-revisao",
  "iso-9001-2026-as-6-principais-mudancas-da-fdis",
  "transicao-iso-9001-2026-prazos-cronograma-global-aci",
];

{
  const envPath = path.join(ROOT, ".env");
  if (existsSync(envPath)) {
    for (const linha of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const t = linha.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!KEY && !dry) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

function inject(html) {
  if (html.includes(MARKER)) return null;
  for (const needle of ['<h2 id="curso">', '<h2 id="aprofunde">']) {
    const i = html.indexOf(needle);
    if (i >= 0) return html.slice(0, i) + RODAPE + "\n" + html.slice(i);
  }
  return html.trimEnd() + "\n\n" + RODAPE;
}

for (const slug of SLUGS) {
  const localPath = path.join(AQUI, `${slug}.html`);
  let html;
  let from = "db";

  if (existsSync(localPath)) {
    html = readFileSync(localPath, "utf8");
    from = "file";
  } else {
    const r = await fetch(
      `${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=content`,
      { headers: H },
    );
    const rows = await r.json();
    if (!Array.isArray(rows) || !rows.length) {
      console.warn(slug, "nao encontrado");
      continue;
    }
    html = rows[0].content || "";
  }

  const next = inject(html);
  if (!next) {
    console.log(slug, "ja tem rodape");
    continue;
  }

  if (dry) {
    console.log(slug, "patch ok (dry)", from);
    continue;
  }

  writeFileSync(localPath, next, "utf8");
  if (from === "file") console.log(slug, "html local atualizado");
  else console.log(slug, "html exportado do banco");

  const patch = await fetch(`${SB_URL}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify({ content: next, revised_at: new Date().toISOString() }),
  });
  console.log(slug, "supabase", patch.status);
  if (!patch.ok) process.exit(1);
}

console.log("Rodape migracao: fim.");
