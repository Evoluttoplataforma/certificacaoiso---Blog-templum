#!/usr/bin/env node
/**
 * Auditoria de links internos nos posts ISO 27001 / SGSI publicados.
 * Espelho de _audit-pbqp-h-broken-links.mjs
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
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const STATIC_OK = new Set([
  "/form/",
  "/buscar/",
  "/presentes/",
  "/rss.xml",
  "/sitemap.xml",
  "/politica-de-privacidade/",
  "/llms.txt",
  "/llms-full.txt",
]);

function loadRedirects() {
  const map = new Map();
  const raw = readFileSync(path.join(ROOT, "public/_redirects"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const parts = t.split(/\s+/);
    if (parts.length < 3) continue;
    let [from, to] = parts;
    if (!from.startsWith("/")) continue;
    if (!from.endsWith("/") && !from.includes(".")) from += "/";
    if (to.startsWith("/") && !to.endsWith("/") && !to.includes("?") && !to.includes(".")) to += "/";
    map.set(from, to);
  }
  return map;
}

function normalizePath(href) {
  try {
    if (href.startsWith("https://certificacaoiso.com.br")) {
      const u = new URL(href);
      href = u.pathname + (u.search || "");
    }
  } catch {
    return null;
  }
  if (!href.startsWith("/")) return null;
  if (href.startsWith("//")) return null;
  if (href.startsWith("/wp-content/")) return { kind: "asset", path: href.split("?")[0] };
  if (href.startsWith("/#") || href === "/") return { kind: "ok", path: href };
  const pathOnly = href.split("#")[0].split("?")[0];
  if (!pathOnly || pathOnly === "/") return { kind: "ok", path: pathOnly || "/" };
  let p = pathOnly;
  if (!p.endsWith("/") && !p.includes(".")) p += "/";
  return { kind: "page", path: p };
}

function resolveRedirect(pathName, redirects, depth = 0) {
  if (depth > 5) return pathName;
  const hit = redirects.get(pathName) || redirects.get(pathName.replace(/\/$/, "")) || redirects.get(pathName + "/");
  if (!hit) return pathName;
  if (!hit.startsWith("/")) return hit;
  const next = hit.split("?")[0];
  let n = next;
  if (!n.endsWith("/") && !n.includes(".")) n += "/";
  return resolveRedirect(n, redirects, depth + 1);
}

async function fetchAll(url) {
  const rows = [];
  let from = 0;
  const page = 1000;
  for (;;) {
    const res = await fetch(url, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Range: `${from}-${from + page - 1}`,
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const chunk = await res.json();
    rows.push(...chunk);
    if (chunk.length < page) break;
    from += page;
  }
  return rows;
}

async function main() {
  const redirects = loadRedirects();
  const allPosts = await fetchAll(`${SB}/rest/v1/blog_templum_posts?select=slug,status&order=slug`);
  const published = new Set(allPosts.filter((p) => p.status === "published").map((p) => `/${p.slug}/`));

  const cluster = await fetchAll(
    `${SB}/rest/v1/blog_templum_posts?select=slug,content&status=eq.published&or=(slug.ilike.*27001*,slug.ilike.*27002*,slug.eq.sgsi,title.ilike.*27001*,title.ilike.*SGSI*)&order=slug`,
  );

  const broken = [];
  const redirectHops = [];
  let linkCount = 0;

  for (const post of cluster) {
    const hrefs = [...(post.content || "").matchAll(/href=(["'])(.*?)\1/gi)].map((m) => m[2]);
    for (const href of hrefs) {
      const norm = normalizePath(href);
      if (!norm || norm.kind === "ok" || norm.kind === "asset") continue;
      linkCount++;
      const resolved = resolveRedirect(norm.path, redirects);
      if (STATIC_OK.has(resolved) || STATIC_OK.has(norm.path)) continue;
      if (resolved.startsWith("http")) continue;
      if (published.has(resolved)) {
        if (resolved !== norm.path) {
          redirectHops.push({ from: post.slug, href: norm.path, to: resolved });
        }
        continue;
      }
      broken.push({ from: post.slug, href: norm.path, resolved });
    }
  }

  const out = {
    posts_scanned: cluster.length,
    links_checked: linkCount,
    broken_count: broken.length,
    hop_count: redirectHops.length,
    broken,
    redirect_hops: redirectHops.slice(0, 200),
  };
  const outPath = path.join(ROOT, "supabase/posts/_audit-iso-27001-broken-links.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ posts_scanned: out.posts_scanned, links_checked: linkCount, broken: broken.length, hops: redirectHops.length }, null, 2));
  if (broken.length) console.log("broken sample", broken.slice(0, 15));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
