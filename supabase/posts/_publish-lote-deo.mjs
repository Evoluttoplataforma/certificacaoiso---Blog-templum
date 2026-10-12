#!/usr/bin/env node
/** Publica lote DEO 2026-10-12 (content + meta local → Supabase). */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(AQUI, "..", "..");
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

const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const SLUGS = [
  "passo-a-passo-certificacao-iso-9001",
  "quanto-custa-iso-9001",
  "certificacao-iso-27001-etapas-prazo-custo",
  "quanto-custa-iso-27001",
  "passo-a-passo-certificacao-iso-45001",
  "iso-14001",
  "mapeamento-de-processos-e-a-iso-9001",
  "exemplos-mapeamento-de-processos-iso-9001",
  "controle-de-documentos",
  "iso-9001-requisitos-7-5-informacao-documentada",
  "gestao-processos-iso-9001-2026-requisito-4-4",
  "5w2h-plano-de-acao-iso-9001",
  "cinco-porques-analise-de-causa-raiz",
  "analise-de-causa-raiz-o-que-e-e-como-fazer",
  "as-sete-ferramentas-da-qualidade",
  "auditoria-interna-iso-9001-ferramentas",
  "instrucao-de-trabalho-it",
  "programa-5s-e-a-iso-9001",
  "como-identificar-aspecto-impacto-ambiental",
];

async function publishSlug(slug) {
  const htmlPath = path.join(AQUI, `${slug}.html`);
  if (!existsSync(htmlPath)) {
    console.warn("skip", slug, "sem html local");
    return;
  }
  const html = readFileSync(htmlPath, "utf8");
  const mp = path.join(AQUI, `${slug}.meta.json`);
  const meta = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
  const q = `${API}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id`;
  const rows = await fetch(q, { headers: H }).then((r) => r.json());
  const campos = { content: html, revised_at: new Date().toISOString() };
  for (const k of ["title", "tldr", "seo_title", "seo_description", "faq", "published_at"]) {
    if (meta[k] !== undefined) campos[k] = meta[k];
  }
  if (!rows.length) {
    console.warn(slug, "nao existe no Supabase");
    return;
  }
  const r = await fetch(q, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(campos),
  });
  console.log(slug, "patch", r.status);
}

for (const slug of SLUGS) await publishSlug(slug);
console.log("Lote DEO publicado");
