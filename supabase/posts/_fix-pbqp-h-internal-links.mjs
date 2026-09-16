#!/usr/bin/env node
/**
 * Reaponta links editoriais que apontavam para URLs PBQP/SiAC
 * consolidadas (agora draft + 301 no _redirects).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
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
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const SB = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

/** Ordem importa: slugs mais longos antes dos prefixos curtos. */
const MAP = [
  ["/atualizacao-pbqp-h-siac-2021/", "/pbqp-h-siac-2021/"],
  ["/atualizacao-pbqp-h-siac-2021", "/pbqp-h-siac-2021/"],
  ["/o-que-mudou-na-versao-2021-pbqp-h/", "/pbqp-h-siac-2021/"],
  ["/o-que-mudou-na-versao-2021-pbqp-h", "/pbqp-h-siac-2021/"],
  ["/siac-2021-o-que-mudou-2/", "/pbqp-h-siac-2021/"],
  ["/siac-2021-o-que-mudou-2", "/pbqp-h-siac-2021/"],
  ["/siac-2021-o-que-mudou/", "/pbqp-h-siac-2021/"],
  ["/siac-2021-o-que-mudou", "/pbqp-h-siac-2021/"],
  ["/o-que-e-o-pbqp-h/", "/pbqp-h/"],
  ["/o-que-e-o-pbqp-h", "/pbqp-h/"],
  ["/o-que-e-pbqp-h/", "/pbqp-h/"],
  ["/o-que-e-pbqp-h", "/pbqp-h/"],
  ["/conheca-o-pbqp-h/", "/pbqp-h/"],
  ["/conheca-o-pbqp-h", "/pbqp-h/"],
  ["/pbqp-h-2-2/", "/pbqp-h/"],
  ["/pbqp-h-2-2", "/pbqp-h/"],
];

const LIKE =
  "%/o-que-e-pbqp-h/%,%/o-que-e-o-pbqp-h/%,%/conheca-o-pbqp-h/%,%/pbqp-h-2-2/%,%/atualizacao-pbqp-h-siac-2021/%,%/siac-2021-o-que-mudou%,%/o-que-mudou-na-versao-2021-pbqp-h/%";

function rewrite(content) {
  let out = content;
  let hits = 0;
  for (const [from, to] of MAP) {
    if (!out.includes(from)) continue;
    const before = out;
    // Não quebrar URLs absolutas do próprio domínio de forma diferente:
    // substituímos path relativo e também https://certificacaoiso.com.br + path
    const abs = `https://certificacaoiso.com.br${from}`;
    const absTo = `https://certificacaoiso.com.br${to}`;
    while (out.includes(abs)) {
      out = out.replace(abs, absTo);
      hits++;
    }
    while (out.includes(from)) {
      out = out.replace(from, to);
      hits++;
    }
    if (out === before && hits === 0) {
      /* no-op */
    }
  }
  return { out, hits };
}

async function main() {
  const filter =
    "status=eq.published&or=(content.ilike.*%2Fo-que-e-pbqp-h%2F*,content.ilike.*%2Fo-que-e-o-pbqp-h%2F*,content.ilike.*%2Fconheca-o-pbqp-h%2F*,content.ilike.*%2Fpbqp-h-2-2%2F*,content.ilike.*%2Fatualizacao-pbqp-h-siac-2021%2F*,content.ilike.*%2Fsiac-2021-o-que-mudou*,content.ilike.*%2Fo-que-mudou-na-versao-2021-pbqp-h%2F*)&select=id,slug,content";
  const res = await fetch(`${SB}/rest/v1/blog_templum_posts?${filter}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`GET: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  console.log("posts a revisar:", rows.length);

  for (const row of rows) {
    const { out, hits } = rewrite(row.content || "");
    if (!hits || out === row.content) {
      console.log("skip", row.slug);
      continue;
    }
    const patch = await fetch(`${SB}/rest/v1/blog_templum_posts?id=eq.${row.id}`, {
      method: "PATCH",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ content: out, updated_at: new Date().toISOString() }),
    });
    if (!patch.ok) throw new Error(`PATCH ${row.slug}: ${patch.status} ${await patch.text()}`);
    console.log("ok", row.slug, "trocas~", hits);
  }
  console.log("Concluído.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
