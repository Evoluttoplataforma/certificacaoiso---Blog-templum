#!/usr/bin/env node
/**
 * Substitui links orbitgestao.com.br → cadastro Templum OS (app.templum.com.br/register).
 * Preserva utm_campaign quando existir; adiciona rel/target se faltar.
 *
 *   node supabase/posts/_patch-orbit-to-templum-os.mjs           # todos publicados
 *   node supabase/posts/_patch-orbit-to-templum-os.mjs --pbqp    # só slug %pbqp%
 *   node supabase/posts/_patch-orbit-to-templum-os.mjs --dry
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
const dry = process.argv.includes("--dry");
const pbqpOnly = process.argv.includes("--pbqp");
if (!KEY && !dry) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const ORBIT_RE =
  /https:\/\/orbitgestao\.com\.br\/?(?:\?[^"'>\s]*)?/gi;

function templumOsUrl(fromHref, slug) {
  let campaign = slug;
  try {
    const u = new URL(fromHref.startsWith("http") ? fromHref : `https://${fromHref}`);
    campaign = u.searchParams.get("utm_campaign") || slug;
  } catch {
    /* keep slug */
  }
  const q = new URLSearchParams({
    utm_source: "blog",
    utm_medium: "link-contextual",
    utm_campaign: campaign,
  });
  return `https://app.templum.com.br/register?${q.toString()}`;
}

function replaceOrbitInHtml(html, slug) {
  if (!ORBIT_RE.test(html)) return html;
  ORBIT_RE.lastIndex = 0;
  return html.replace(
    /<a\s+([^>]*?)href="(https:\/\/orbitgestao\.com\.br[^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi,
    (_m, pre, href, post, inner) => {
      const dest = templumOsUrl(href, slug);
      let attrs = `${pre}href="${dest}"${post}`;
      if (!/rel=/i.test(attrs)) attrs = attrs.replace(/href="/, 'rel="noopener noreferrer" target="_blank" href="');
      else if (!/target=/i.test(attrs)) attrs = attrs.replace(/rel="/, 'target="_blank" rel="');
      return `<a ${attrs.trim()}>${inner}</a>`;
    },
  );
}

async function fetchSlugs() {
  const slugs = [];
  let offset = 0;
  const page = 200;
  for (;;) {
    const url = `${SB}/rest/v1/blog_templum_posts?status=eq.published&content=ilike.*orbitgestao*&select=slug,content&order=slug&offset=${offset}&limit=${page}`;
    const res = await fetch(url, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    if (!rows.length) break;
    for (const row of rows) {
      if (pbqpOnly && !/pbqp|pbqph/i.test(row.slug)) continue;
      slugs.push(row);
    }
    if (rows.length < page) break;
    offset += page;
  }
  return slugs;
}

async function patch(slug, content) {
  const res = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      content,
      revised_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`${slug}: ${res.status} ${await res.text()}`);
}

const rows = dry ? [] : await fetchSlugs();
console.log(pbqpOnly ? "PBQP com Orbit:" : "Posts com Orbit:", dry ? "(dry)" : rows.length);

let n = 0;
for (const row of rows) {
  const next = replaceOrbitInHtml(row.content, row.slug);
  if (next === row.content) continue;
  n++;
  if (dry) {
    console.log("would patch", row.slug);
    continue;
  }
  const bkDir = path.join(ROOT, "supabase/backup");
  writeFileSync(
    path.join(bkDir, `${row.slug}-antes-orbit-os-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify({ slug: row.slug, content: row.content }, null, 0),
  );
  await patch(row.slug, next);
  console.log("ok", row.slug);
}

console.log("patched", n);
