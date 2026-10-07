/**
 * Lista posts publicados candidatos a GEO (SST/NR-1/45001) e falta de post-portas.
 * node supabase/scripts/_audit-geo-candidates.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
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

const API = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const VERTICAL_NR1 = [
  "nr-1-riscos-psicossociais",
  "o-que-sao-riscos-psicossociais-no-trabalho",
  "nr-1-se-aplica-a-minha-empresa",
  "nr-1-prazos-fiscalizacao",
  "nr-1-mitos",
  "riscos-psicossociais-no-pgr",
  "como-medir-riscos-psicossociais",
  "pesquisa-de-clima-nao-e-avaliacao-de-risco-psicossocial",
  "plano-de-acao-riscos-psicossociais",
  "treinamento-lideranca-nr-1",
  "nr-1-documentacao-evidencias",
  "fap-riscos-psicossociais",
  "absenteismo-presenteismo-indicadores",
  "custo-de-nao-cumprir-nr-1",
  "roi-saude-no-trabalho",
  "nr-1-e-iso-45001",
  "nr-1-e-programa-de-compliance",
  "nr-1",
  "nr-1-mei-microempresa-epp",
];

const CLUSTER_45001 = [
  "iso-45001",
  "consultoria-iso-45001",
  "passo-a-passo-certificacao-iso-45001",
  "iso-45003-vs-iso-45001",
  "consultoria-iso-sistema-integrado-9001-14001-45001",
  "iso-45001-perigos",
  "quanto-custa-iso-45001",
  "iso-45001-requisitos-tudo-que-voce-precisa-saber",
  "nr-1-e-iso-45001",
  "nr-1-riscos-psicossociais",
  "iso-45001-cliente-edital-exige-certificado",
  "ohsas-18001-e-iso-45001",
];

async function fetchAll() {
  const rows = [];
  let offset = 0;
  const limit = 500;
  for (;;) {
    const q = `${API}/rest/v1/blog_templum_posts?status=eq.published&select=slug,title,tags,category_name,content&order=slug.asc&limit=${limit}&offset=${offset}`;
    const batch = await (await fetch(q, { headers: H })).json();
    if (!Array.isArray(batch) || !batch.length) break;
    rows.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }
  return rows;
}

const rows = await fetchAll();
const interest = (r) => {
  const slug = r.slug || "";
  const c = (r.content || "").toLowerCase();
  const tags = (r.tags || []).join(" ").toLowerCase();
  if (VERTICAL_NR1.includes(slug) || CLUSTER_45001.includes(slug)) return true;
  if (/45001|45003|ohsas|sgsso|nr-1|pgr|psicossocial|segurança e seguranca/.test(slug + tags + c.slice(0, 8000)))
    return true;
  return (r.category_name || "").toLowerCase().includes("segurança") || (r.category_name || "").toLowerCase().includes("seguranca");
};

const picked = rows.filter(interest);
const withGeo = [];
const withoutGeo = [];
for (const r of picked) {
  const hasPortas = (r.content || "").includes("post-portas");
  const hasRespostas = (r.content || "").includes("respostas-diretas");
  const item = {
    slug: r.slug,
    title: r.title,
    category: r.category_name,
    geo: hasPortas && hasRespostas,
    portas: hasPortas,
    respostas: hasRespostas,
    words: (r.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
  };
  if (item.geo) withGeo.push(item);
  else withoutGeo.push(item);
}

withoutGeo.sort((a, b) => b.words - a.words);
withGeo.sort((a, b) => a.slug.localeCompare(b.slug));

const out = {
  generated: new Date().toISOString(),
  totalPublished: rows.length,
  sstRelated: picked.length,
  withGeo: withGeo.length,
  withoutGeo: withoutGeo.length,
  cluster45001Done: CLUSTER_45001.filter((s) => withGeo.some((x) => x.slug === s)),
  cluster45001Pending: CLUSTER_45001.filter((s) => !withGeo.some((x) => x.slug === s)),
  priorityWithoutGeo: withoutGeo.slice(0, 40),
  allWithoutGeoSlugs: withoutGeo.map((x) => x.slug),
};

const outPath = path.join(ROOT, "scripts", "geo-audit-sst-nr1-45001.json");
writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, ...out, priorityWithoutGeo: out.priorityWithoutGeo.map((x) => x.slug) }, null, 2));
