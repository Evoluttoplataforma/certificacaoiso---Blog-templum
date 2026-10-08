#!/usr/bin/env node
/**
 * Vertical ISO 42001 (08/10/2026): reescreve o hub /iso-42001/ e cria os 7 posts da vertical
 * a partir de supabase/posts/<slug>.html + .meta.json.
 *
 *   node supabase/posts/_publish-vertical-42001.mjs            # cria os novos como DRAFT
 *   node supabase/posts/_publish-vertical-42001.mjs --publish  # cria/promove para published
 *   node supabase/posts/_publish-vertical-42001.mjs --dry
 *
 * Idempotente: post que já existe é atualizado (PATCH), não duplicado. Antes de mexer em
 * qualquer post existente, grava supabase/backup/<slug>-antes-<data>.json.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const SB = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY || "";
const dry = process.argv.includes("--dry");
const publicar = process.argv.includes("--publish");
if (!KEY && !dry) { console.error("Falta SUPABASE_SERVICE_KEY"); process.exit(1); }

const CAT_IA = "3746146b-b1a5-4300-95ca-f24501355415";
const HUB = "iso-42001";
const NOVOS = [
  "requisitos-iso-42001",
  "anexo-a-iso-42001",
  "certificacao-iso-42001",
  "iso-42001-e-iso-27001",
  "governanca-de-ia",
  "pl-2338-ai-act",
  "avaliacao-de-impacto-ia",
];

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
const dia = new Date().toISOString().slice(0, 10);

function carregar(slug) {
  const content = readFileSync(path.join(AQUI, `${slug}.html`), "utf8");
  const meta = JSON.parse(readFileSync(path.join(AQUI, `${slug}.meta.json`), "utf8"));
  const palavras = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return {
    content,
    title: meta.title,
    seo_title: meta.seo_title,
    seo_description: meta.seo_description,
    excerpt: meta.excerpt,
    tldr: meta.tldr,
    faq: meta.faq,
    tags: meta.tags,
    seo_keywords: meta.seo_keywords,
    reading_time_min: Math.max(1, Math.round(palavras / 230)),
    canonical_url: `https://certificacaoiso.com.br/${slug}/`,
  };
}

async function existente(slug) {
  const r = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${slug}&select=*`, { headers: H });
  const rows = await r.json();
  return rows[0] || null;
}

async function patch(slug, campos) {
  const r = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${slug}`, {
    method: "PATCH", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(campos),
  });
  if (!r.ok) throw new Error(`PATCH ${slug}: ${r.status} ${await r.text()}`);
}

// Os 14 posts antigos da categoria IA estavam SEM TAG (mesmo achado da 27001 e da FSSC):
// com isso o anel de relacionados empatava tudo em 1 ponto. Espinha comum
// "inteligência artificial" (que os 8 da vertical também têm) + específicas.
const TAGS_ANTIGOS = {
  "inteligencia-artificial": ["inteligência artificial", "IA na gestão", "governança de IA"],
  "conversao-de-vendas-com-inteligencia-artificial-como-unir-processo-estrategia-e-ia-para-vender-mais": ["inteligência artificial", "vendas", "processos"],
  "consultoria-iso-com-inteligencia-artificial-como-a-templum-esta-simplificando-a-certificacao-e-a-gestao-empresarial": ["inteligência artificial", "consultoria ISO", "certificação ISO"],
  "nao-conformidade-como-transformar-erros-em-melhoria-continua-com-apoio-da-inteligencia-artificial": ["inteligência artificial", "não conformidade", "melhoria contínua"],
  "planejamento-estrategico-2026-como-transformar-intencao-em-execucao-com-apoio-da-inteligencia-artificial": ["inteligência artificial", "planejamento estratégico", "IA na gestão"],
  "a-revolucao-da-gestao-com-inteligencia-artificial-como-empresas-pequenas-podem-operar-com-performance-de-grandes-organizacoes": ["inteligência artificial", "IA na gestão", "pequenas empresas"],
  "a-jornada-de-transformacao-da-gestao-com-o-sistema-orbit-e-a-inteligencia-artificial": ["inteligência artificial", "Orbit", "IA na gestão"],
  "como-a-inteligencia-artificial-acelera-a-conversao-e-a-produtividade-da-sua-equipe": ["inteligência artificial", "vendas", "produtividade"],
  "como-a-inteligencia-artificial-esta-reinventando-a-gestao-empresarial": ["inteligência artificial", "IA na gestão"],
  "crm-inteligente-como-a-inteligencia-artificial-esta-transformando-a-gestao-de-clientes-processos-e-vendas": ["inteligência artificial", "CRM", "vendas"],
  "gestao-com-inteligencia-artificial-como-repensar-sua-empresa-para-crescer-com-mais-eficiencia": ["inteligência artificial", "IA na gestão", "produtividade"],
  "gestao-da-qualidade-com-inteligencia-artificial-como-pensar-diferente-e-transformar-sua-empresa": ["inteligência artificial", "gestão da qualidade", "ISO 9001"],
  "inteligencia-artificial-na-gestao-como-empresas-podem-automatizar-processos-ganhar-produtividade-e-escalar-com-mais-inteligencia": ["inteligência artificial", "IA na gestão", "processos"],
  "redefinindo-a-consultoria-de-gestao-e-o-futuro-com-ia": ["inteligência artificial", "consultoria ISO", "IA na gestão"],
};

const agora = new Date().toISOString();

if (publicar && !dry) {
  const bk = {};
  for (const [slug, tags] of Object.entries(TAGS_ANTIGOS)) {
    const atual = await existente(slug);
    if (!atual) { console.log("tags: não achei", slug); continue; }
    bk[slug] = atual.tags;
    // Só tags: etiquetar não é revisão editorial, então revised_at fica como está.
    await patch(slug, { tags });
  }
  writeFileSync(path.join(AQUI, "..", "backup", `tags-categoria-ia-antes-${dia}.json`), JSON.stringify(bk, null, 1));
  console.log(`tags: ${Object.keys(bk).length} posts antigos da categoria IA etiquetados`);
}

// O hub já está publicado: reescrevê-lo no modo draft o poria no ar no próximo rebuild
// disparado por qualquer publicação do CMS. Então ele só entra com --publish.
for (const slug of publicar || dry ? [HUB, ...NOVOS] : NOVOS) {
  const campos = carregar(slug);
  console.log(`${slug}: ${campos.content.length} car. · ${campos.reading_time_min} min · ${campos.faq.length} FAQ · ${campos.tags.length} tags`);
  if (dry) continue;

  const atual = await existente(slug);
  if (atual) {
    writeFileSync(path.join(AQUI, "..", "backup", `${slug}-antes-${dia}.json`), JSON.stringify(atual, null, 1));
    const extra = { revised_at: agora };
    if (publicar && atual.status !== "published") Object.assign(extra, { status: "published", published_at: agora });
    await patch(slug, { ...campos, ...extra });
    console.log("  atualizado", atual.status, "→", extra.status || atual.status);
  } else {
    const row = {
      ...campos,
      slug,
      author_name: "Equipe Templum",
      category_id: CAT_IA,
      category_name: "IA",
      status: publicar ? "published" : "draft",
      published_at: agora,
      revised_at: agora,
    };
    const r = await fetch(`${SB}/rest/v1/blog_templum_posts`, {
      method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(row),
    });
    if (!r.ok) throw new Error(`INSERT ${slug}: ${r.status} ${await r.text()}`);
    console.log("  criado como", row.status);
  }
}
