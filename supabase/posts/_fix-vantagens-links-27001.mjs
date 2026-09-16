#!/usr/bin/env node
/**
 * Reaponta hrefs /vantagens-da-iso-27001/ → /7-beneficios-da-iso-27001-para-o-seu-negocio/
 * em posts publicados do cluster (exceto o próprio draft).
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

const FROM = 'href="/vantagens-da-iso-27001/"';
const TO = 'href="/7-beneficios-da-iso-27001-para-o-seu-negocio/"';

async function main() {
  const url = `${SB}/rest/v1/blog_templum_posts?select=id,slug,content&status=eq.published&content=ilike.*vantagens-da-iso-27001*`;
  const res = await fetch(url, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(await res.text());
  const rows = await res.json();
  console.log("posts com link antigo:", rows.length);
  for (const row of rows) {
    if (row.slug === "consultoria-iso-27001") {
      console.log("skip consultoria (pedido explícito)", row.slug);
      continue;
    }
    if (!row.content?.includes(FROM) && !row.content?.includes("vantagens-da-iso-27001")) {
      continue;
    }
    let next = row.content.split(FROM).join(TO);
    next = next.split('href="/vantagens-da-iso-27001"').join('href="/7-beneficios-da-iso-27001-para-o-seu-negocio/"');
    if (next === row.content) {
      console.log("sem mudança", row.slug);
      continue;
    }
    const p = await fetch(`${SB}/rest/v1/blog_templum_posts?id=eq.${row.id}`, {
      method: "PATCH",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ content: next, updated_at: new Date().toISOString() }),
    });
    if (!p.ok) throw new Error(`PATCH ${row.slug}: ${p.status} ${await p.text()}`);
    console.log("ok", row.slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
