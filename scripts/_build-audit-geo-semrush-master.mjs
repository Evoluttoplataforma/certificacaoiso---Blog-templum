/**
 * Gera scripts/audit-geo-semrush-master.csv a partir dos exports Semrush (Desktop).
 * Uso: node scripts/_build-audit-geo-semrush-master.mjs
 * Opcional: SEMRUSH_DIR="C:\...\SemRush"
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, "..");
const POSTS = path.join(REPO, "supabase", "posts");
const OUT = path.join(__dirname, "audit-geo-semrush-master.csv");
const DEFAULT_SEMRUSH =
  "C:\\Users\\Raquel\\Desktop\\Marketing Templum\\SemRush";
const SEMRUSH_DIR = process.env.SEMRUSH_DIR || DEFAULT_SEMRUSH;

/** slug -> tem post-portas no repo */
const geoSlugs = new Set();
for (const f of fs.readdirSync(POSTS)) {
  if (!f.endsWith(".html") || f.startsWith("_")) continue;
  const html = fs.readFileSync(path.join(POSTS, f), "utf8");
  if (html.includes('class="post-portas"') || html.includes("post-portas")) {
    geoSlugs.add(f.replace(/\.html$/, ""));
  }
}

/** vertical lógica -> slug canônico preferido */
const VERTICAL_CANONICAL = {
  iso_9001: "iso-9001",
  iso_14001: "iso-14001-2",
  iso_45001: "iso-45001",
  iso_27001: "iso-27001",
  iso_27701: "iso-27701-2025-o-que-muda-independencia-da-iso-27001",
  iso_27001_cert: "certificacao-iso-27001-etapas-prazo-custo",
  iso_27701_cert: "certificacao-iso-27701-etapas-e-requisitos",
  iso_14001_cert: "iso-14001-2",
  iso_45001_cert: "passo-a-passo-certificacao-iso-45001",
  custo_27701: "quanto-custa-iso-27701",
  custo_27001: "certificacao-iso-27001-etapas-prazo-custo",
  lgpd_27701: "iso-27701-lgpd-gdpr-conformidade",
  lgpd_27001: "relacao-do-lgpd-com-a-iso-27001",
  sgsi: "iso-27001",
  fssc: "fssc-22000-versao-7",
  sassmaq: "sassmaq-4-edicao-2026-mudancas-prazo-transicao",
  mapeamento: "mapeamento-de-processos-e-a-iso-9001",
  ferramentas: "as-sete-ferramentas-da-qualidade",
  documentos: "controle-de-documentos",
  pop: "instrucao-de-trabalho-it",
  auditoria_9001: "checklist-preparacao-auditoria-interna-iso",
  gestao_processos: "mapeamento-de-processos-e-a-iso-9001",
  causa_raiz: "analise-de-causa-raiz",
  cinco_s: "5s",
  fluxograma: "o-que-e-fluxograma-de-processos",
  nc: "o-que-e-nao-conformidade",
  consultoria_14001: "consultoria-iso-14001",
  consultoria_27701: "consultoria-iso-27701",
  aspectos_ambientais: "como-identificar-aspecto-impacto-ambiental",
  sst: "iso-45001",
  semana_qualidade: "semana-mundial-da-qualidade-2026",
};

const GAP_TOPIC_SLUG = {
  "Gestão de Documentos": "controle-de-documentos",
  "Procedimentos Operacionais Padrão (POP)": "instrucao-de-trabalho-it",
  "Pop-ups e Procedimentos Operacionais": "instrucao-de-trabalho-it",
  "5W2H: Plano de ação": "5w2h-usando-para-transformar-os-riscos-em-oportunidades",
  "5 Porquês – Técnica de Investigação de Causas": "analise-de-causa-raiz",
  "Análise de Causa Raiz": "analise-de-causa-raiz",
  "Gestão de Processos": "mapeamento-de-processos-e-a-iso-9001",
  "Gráficos de Controle de Qualidade": "as-sete-ferramentas-da-qualidade",
  "Controle estatístico de processos e cartas de controle":
    "as-sete-ferramentas-da-qualidade",
  "Seven Quality Tools": "as-sete-ferramentas-da-qualidade",
  "Programa 8S": "5s",
  "5S metodología de organización": "5s",
  "Qualidade: conceito e sinônimos": "iso-9001",
  "Controle de Qualidade na Produção": "programa-5s-e-a-iso-9001",
  "GRC & Compliance": "iso-27001",
  "Análise de Riscos e Segurança no Trabalho": "iso-45001",
  "Corrective Action Requests (CAR)": "o-que-e-nao-conformidade",
  "Curso de Mapeamento de Processos": "mapeamento-de-processos-e-a-iso-9001",
  "Mapa de procesos empresariales": "mapeamento-de-processos-e-a-iso-9001",
  "Internal Audit": "checklist-preparacao-auditoria-interna-iso",
  "Auditoria ISO 9001": "checklist-preparacao-auditoria-interna-iso",
};

const ISO_GAP_KEYWORDS =
  /iso|qualidade|processo|documento|pop|procediment|5w|5s|auditoria|conform|grc|causa|fluxogram|mapeamento|ferrament|n[aã]o.?conform|sgq|sgsi|ambiental|sassmaq|fssc|pbqp|certific|gest[aã]o da qualidade|controle estat|gr[aá]fico de controle|it\b|instru[cç][aã]o de trabalho/i;

const SKIP_PROMPT =
  /qualiex\s*(login|entrar|v1|senha)|ninite|marcas com letras|esqueci minha senha do qualiex/i;

function parseCsv(text) {
  const rows = [];
  let i = 0;
  const len = text.length;
  while (i < len) {
    const row = [];
    while (i < len) {
      let cell = "";
      if (text[i] === '"') {
        i++;
        while (i < len) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              cell += '"';
              i += 2;
            } else {
              i++;
              break;
            }
          } else {
            cell += text[i++];
          }
        }
      } else {
        while (i < len && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") {
          cell += text[i++];
        }
      }
      row.push(cell);
      if (text[i] === ",") {
        i++;
        continue;
      }
      if (text[i] === "\r") i++;
      if (text[i] === "\n") i++;
      break;
    }
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) rows.push(row);
  }
  return rows;
}

function csvEscape(s) {
  const t = String(s ?? "");
  if (/[",\n\r]/.test(t)) return `"${t.replace(/"/g, '""')}"`;
  return t;
}

function verticalFromPromptsFilename(name) {
  const m = name.match(/prompts_by_topic_fts_(.+)_br\.csv$/i);
  if (!m) return "outros";
  const raw = m[1];
  const map = {
    iso_27001_certifica__o: "iso_27001_cert",
    certifica__o_iso_27001: "iso_27001_cert",
    certifica__o_iso_27701: "iso_27701_cert",
    certifica__o_iso_14001: "iso_14001_cert",
    certifica__o_iso_45001: "iso_45001_cert",
    iso_27701: "iso_27701",
    iso_45001: "iso_45001",
    iso_27001_e_iso_27701: "iso_27701",
    "27701_vs_lgpd": "lgpd_27701",
    quanto_custa_iso_27701: "custo_27701",
    mapeamento_de_processos: "mapeamento",
    fssc_22000_vers_o_7: "fssc",
    sassmaq_sistema_de_avalia__o_de_seguran_a_3ca250ee: "sassmaq",
    seguran_a_da_informa__o_sgsi: "sgsi",
    sistema_de_gest_o_ambiental: "iso_14001",
    sistema_de_gest_o_de_sa_de_e_seguran_a_ocupacional: "sst",
    consultoria_iso_14001: "consultoria_14001",
    consultoria_iso_27701: "consultoria_27701",
    levantamento_de_aspectos_e_impactos_ambie_19ab4fcf: "aspectos_ambientais",
    semana_da_qualidade_2026: "semana_qualidade",
  };
  if (raw.startsWith("consultoria_iso_27701")) return "consultoria_27701";
  if (raw.startsWith("consultoria_iso_14001")) return "consultoria_14001";
  if (raw.startsWith("certifica__o_iso_27701")) return "iso_27701_cert";
  if (raw.startsWith("certifica__o_iso_27001")) return "iso_27001_cert";
  if (raw.startsWith("certifica__o_iso_14001")) return "iso_14001_cert";
  if (raw.startsWith("certifica__o_iso_45001")) return "iso_45001_cert";
  if (raw === "iso_27701" || raw.startsWith("iso_27701_")) return "iso_27701";
  for (const [k, v] of Object.entries(map)) {
    if (raw.includes(k) || raw === k) return v;
  }
  if (raw.includes("27001")) return "iso_27001";
  if (raw.includes("27701")) return "iso_27701";
  return raw.replace(/_/g, " ");
}

function canonicalForVertical(vertical) {
  return VERTICAL_CANONICAL[vertical] || null;
}

function slugExists(slug) {
  if (!slug) return false;
  return fs.existsSync(path.join(POSTS, `${slug}.html`));
}

function geoStatus(slug) {
  if (!slug) return "sem_url";
  if (geoSlugs.has(slug)) return "sim";
  if (slugExists(slug)) return "nao";
  return "criar_pagina";
}

function acaoFor(row) {
  const geo = row.geo ?? row.geo_repo;
  const { vertical, prompt, gapQualiex, relevance } = row;
  if (SKIP_PROMPT.test(prompt)) return "ignorar_ruido";
  if (vertical === "custo_27001" && /quanto custa|pre[cç]o|valor/i.test(prompt)) {
    return geo === "sim" ? "refinar_geo" : "nova_pagina_quanto-custa-27001";
  }
  if (gapQualiex === "sim" && geo !== "sim") return "geo_ferramentas_processos";
  if (geo === "sim") return "monitorar_citacao";
  if (geo === "nao") return "upgrade_geo";
  if (geo === "criar_pagina") return relevance >= 85 ? "novo_conteudo" : "backlog_conteudo";
  return "revisar_url";
}

function prioridadeFor(row) {
  const relevance = row.relevance ?? row.relevance_score ?? 0;
  const { gapQualiex, vertical, prompt } = row;
  if (SKIP_PROMPT.test(prompt)) return "P4";
  if (/quanto custa iso 27001/i.test(prompt)) return "P0";
  if (gapQualiex === "sim" && relevance >= 80) return "P1";
  if (vertical === "mapeamento" || vertical === "ferramentas") return "P1";
  if (["iso_27001", "iso_27701", "iso_27001_cert", "custo_27701"].includes(vertical))
    return relevance >= 90 ? "P0" : "P1";
  if (relevance >= 93) return "P1";
  if (relevance >= 85) return "P2";
  return "P3";
}

const rowsOut = [];
const seen = new Map();

function addRow(r) {
  const key = `${r.fonte}|${r.vertical}|${r.prompt}`.toLowerCase();
  const prev = seen.get(key);
  if (prev != null) {
    if ((r.relevance_score || 0) <= (rowsOut[prev].relevance_score || 0)) return;
    rowsOut[prev] = r;
    return;
  }
  seen.set(key, rowsOut.length);
  rowsOut.push(r);
}

/** prompts_by_topic_fts_*.csv */
const promptFiles = fs
  .readdirSync(SEMRUSH_DIR)
  .filter((f) => f.startsWith("prompts_by_topic_fts_") && f.endsWith("_br.csv"));

for (const file of promptFiles) {
  let vertical = verticalFromPromptsFilename(file);
  let slug = canonicalForVertical(vertical);
  const text = fs.readFileSync(path.join(SEMRUSH_DIR, file), "utf8");
  const parsed = parseCsv(text);
  const header = parsed[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  for (let r = 1; r < parsed.length; r++) {
    const line = parsed[r];
    const prompt = line[idx.prompt] ?? line[0];
    if (!prompt || SKIP_PROMPT.test(prompt)) continue;
    const relevance = Number(line[idx.relevance_score] ?? 0) || 0;
    if (relevance < 70) continue;
    const llm = line[idx.llm] ?? "";
    if (/quanto custa|pre[cç]o|valor.*(27001|iso 27001)/i.test(prompt)) {
      vertical = vertical.includes("27001") ? vertical : "custo_27001";
      slug = slugExists("quanto-custa-iso-27001")
        ? "quanto-custa-iso-27001"
        : "certificacao-iso-27001-etapas-prazo-custo";
    }
    const geo = geoStatus(slug);
    const base = {
      fonte: "prompts_by_topic",
      arquivo: file,
      vertical,
      topic_semrush: vertical,
      prompt,
      llm,
      relevance_score: relevance,
      slug_canonical: slug || "",
      url_canonica: slug
        ? `https://certificacaoiso.com.br/${slug}/`
        : "",
      geo_repo: geo,
      qualiex_gap: "nao",
      competitor_note: "",
      topic_volume: "",
    };
    const enriched = { ...base, gapQualiex: "nao", geo: geo };
    addRow({
      ...enriched,
      acao: acaoFor(enriched),
      prioridade: prioridadeFor(enriched),
      prazo_semana: "",
    });
  }
}

/** gap_topics_qualiex - BR + ISO-adjacent */
const gapPath = path.join(SEMRUSH_DIR, "gap_topics_qualiex_com_worldwide.csv");
if (fs.existsSync(gapPath)) {
  const parsed = parseCsv(fs.readFileSync(gapPath, "utf8"));
  const header = parsed[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  for (let r = 1; r < parsed.length; r++) {
    const line = parsed[r];
    const country = line[idx.country];
    if (country !== "br") continue;
    const name = line[idx.name];
    if (!ISO_GAP_KEYWORDS.test(name)) continue;
    if (/vagas|jovem aprendiz|almoxarif|tradução|justiça e processos|pop-ups e procedimentos operacionais/i.test(name))
      continue;
    if (/^pop-ups/i.test(name)) continue;
    let slug = GAP_TOPIC_SLUG[name];
    if (!slug && /mapeamento|processo/i.test(name))
      slug = "mapeamento-de-processos-e-a-iso-9001";
    if (!slug && /document/i.test(name)) slug = "controle-de-documentos";
    if (!slug && /auditoria/i.test(name))
      slug = "auditoria-interna-iso-melhores-praticas";
    const volume = line[idx.volume] ?? "";
    const difficulty = line[idx.difficulty] ?? "";
    const gapM = line[idx.gap_mentions] ?? "";
    const geo = geoStatus(slug);
    const base = {
      fonte: "gap_topics_qualiex",
      arquivo: "gap_topics_qualiex_com_worldwide.csv",
      vertical: "ferramentas_processos",
      topic_semrush: name,
      prompt: `[tópico gap] ${name}`,
      llm: "multi",
      relevance_score: 80,
      slug_canonical: slug || "",
      url_canonica: slug ? `https://certificacaoiso.com.br/${slug}/` : "",
      geo_repo: geo,
      qualiex_gap: "sim",
      competitor_note: gapM.slice(0, 200),
      topic_volume: volume,
      topic_difficulty: difficulty,
    };
    const enriched = {
      ...base,
      gapQualiex: "sim",
      relevance: 80,
      geo,
      vertical: "ferramentas",
    };
    addRow({
      ...enriched,
      acao: acaoFor(enriched),
      prioridade: prioridadeFor(enriched),
      prazo_semana: "",
    });
  }
}

/** prompts_qualiex_com_br.csv - só ISO/SGQ útil */
const qualiPrompts = path.join(SEMRUSH_DIR, "prompts_qualiex_com_br.csv");
if (fs.existsSync(qualiPrompts)) {
  const parsed = parseCsv(fs.readFileSync(qualiPrompts, "utf8"));
  const header = parsed[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  for (let r = 1; r < parsed.length; r++) {
    const line = parsed[r];
    const prompt = line[idx.prompt];
    const topic = line[idx.topic_name] ?? "";
    if (!prompt || SKIP_PROMPT.test(prompt)) continue;
    if (/Qualiex Acesso|qualiex login|qualiex entrar/i.test(topic + prompt))
      continue;
    if (!ISO_GAP_KEYWORDS.test(topic + " " + prompt) && !/iso 9001|auditoria|documento|processo|sgq/i.test(prompt))
      continue;
    let slug =
      GAP_TOPIC_SLUG[topic] ||
      (topic.includes("Auditoria ISO") ? "auditoria-interna-iso-melhores-praticas" : null) ||
      (topic.includes("Gestão da Qualidade") ? "iso-9001" : null) ||
      (topic.includes("Gestão de Documentos") ? "controle-de-documentos" : null) ||
      (topic.includes("ISO 9001") ? "iso-9001" : null);
    const vis = line[idx.topic_visibility] ?? "0";
    const geo = geoStatus(slug);
    const base = {
      fonte: "prompts_qualiex_br",
      arquivo: "prompts_qualiex_com_br.csv",
      vertical: "concorrente_qualiex",
      topic_semrush: topic,
      prompt,
      llm: line[idx.llm] ?? "",
      relevance_score: 75,
      slug_canonical: slug || "",
      url_canonica: slug ? `https://certificacaoiso.com.br/${slug}/` : "",
      geo_repo: geo,
      qualiex_gap: Number(vis) > 0 ? "qualiex_cita" : "sim",
      competitor_note: `topic_visibility=${vis}`,
      topic_volume: line[idx.topic_volume] ?? "",
    };
    const enriched = {
      ...base,
      gapQualiex: "sim",
      relevance: 75,
      geo,
    };
    addRow({
      ...enriched,
      acao:
        Number(vis) > 0 && geo !== "sim"
          ? "geo_vs_qualiex"
          : acaoFor(enriched),
      prioridade: Number(vis) >= 8 ? "P1" : "P2",
      prazo_semana: "",
    });
  }
}

/** gap_prompts - amostra filtrada (arquivo enorme com ruído) */
const gapPromptsPath = path.join(SEMRUSH_DIR, "gap_prompts_qualiex_com_br.csv");
if (fs.existsSync(gapPromptsPath)) {
  const text = fs.readFileSync(gapPromptsPath, "utf8");
  const parsed = parseCsv(text);
  const header = parsed[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  let added = 0;
  for (let r = 1; r < parsed.length && added < 150; r++) {
    const line = parsed[r];
    const prompt = line[idx.prompt] ?? line[0];
    if (!prompt || SKIP_PROMPT.test(prompt)) continue;
    if (!/iso|qualidade|auditoria|processo|documento|pop|5s|5w|mapeamento|sgq|certifica/i.test(prompt))
      continue;
    let slug = "iso-9001";
    if (/27001|sgsi|seguran/i.test(prompt)) slug = "iso-27001";
    if (/27701|lgpd|privacidade/i.test(prompt)) slug = "iso-27701-lgpd-gdpr-conformidade";
    if (/45001|nr-?1|sst/i.test(prompt)) slug = "iso-45001";
    if (/14001|ambient/i.test(prompt)) slug = "iso-14001-2";
    if (/mapeamento|fluxogram|processo/i.test(prompt))
      slug = "mapeamento-de-processos-e-a-iso-9001";
    if (/documento|pop|procediment/i.test(prompt)) slug = "controle-de-documentos";
    const geo = geoStatus(slug);
    const base = {
      fonte: "gap_prompts_qualiex",
      arquivo: "gap_prompts_qualiex_com_br.csv",
      vertical: "ferramentas_processos",
      topic_semrush: line[idx.topic_name] ?? "",
      prompt,
      llm: line[idx.llm] ?? "",
      relevance_score: 72,
      slug_canonical: slug,
      url_canonica: `https://certificacaoiso.com.br/${slug}/`,
      geo_repo: geo,
      qualiex_gap: "sim",
      competitor_note: "gap_prompt",
      topic_volume: "",
    };
    const enriched = { ...base, gapQualiex: "sim", relevance: 72, geo };
    addRow({
      ...enriched,
      acao: acaoFor(enriched),
      prioridade: "P2",
      prazo_semana: "",
    });
    added++;
  }
}

rowsOut.sort((a, b) => {
  const p = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4 };
  return (p[a.prioridade] ?? 9) - (p[b.prioridade] ?? 9);
});

const cols = [
  "prioridade",
  "acao",
  "fonte",
  "vertical",
  "topic_semrush",
  "prompt",
  "llm",
  "relevance_score",
  "topic_volume",
  "url_canonica",
  "slug_canonical",
  "geo_repo",
  "qualiex_gap",
  "competitor_note",
  "arquivo",
  "prazo_semana",
];

const lines = [
  cols.join(","),
  ...rowsOut.map((row) => cols.map((c) => csvEscape(row[c])).join(",")),
];
fs.writeFileSync(OUT, lines.join("\n"), "utf8");

const OUT_WORK = path.join(__dirname, "audit-geo-semrush-trabalho.csv");
const acaoPendente = new Set([
  "upgrade_geo",
  "geo_ferramentas_processos",
  "nova_pagina_quanto-custa-27001",
  "geo_vs_qualiex",
  "novo_conteudo",
  "refinar_geo",
]);

const trabalho = rowsOut.filter((r) => {
  if (r.fonte === "gap_prompts_qualiex") return false;
  if (r.acao === "ignorar_ruido" || r.acao === "monitorar_citacao") return false;
  if (acaoPendente.has(r.acao)) return true;
  if (r.fonte === "gap_topics_qualiex" && acaoPendente.has(r.acao)) return true;
  if (
    r.fonte === "prompts_qualiex_br" &&
    r.prioridade === "P1" &&
    r.acao === "geo_vs_qualiex"
  )
    return true;
  if (r.prioridade === "P0" && r.acao === "nova_pagina_quanto-custa-27001") return true;
  return false;
});

/** amostra curta: top prompts mapeamento + custo 27001 */
const OUT_AMOSTRA = path.join(__dirname, "audit-geo-semrush-amostra-semana1.csv");
const amostra = [];
const seenPrompt = new Set();
for (const r of rowsOut) {
  if (r.vertical === "mapeamento" && (r.relevance_score || 0) >= 95) {
    const k = r.prompt.toLowerCase();
    if (seenPrompt.has(k)) continue;
    seenPrompt.add(k);
    amostra.push(r);
    if (amostra.length >= 40) break;
  }
}
for (const r of rowsOut) {
  if (/quanto custa|pre[cç]o.*27001/i.test(r.prompt)) {
    amostra.push(r);
  }
}
const amostraDedup = [];
const seenA = new Set();
for (const r of amostra) {
  const k = r.prompt.toLowerCase();
  if (seenA.has(k)) continue;
  seenA.add(k);
  amostraDedup.push(r);
}
const trabalhoBySlug = new Map();
for (const r of trabalho) {
  if (!["upgrade_geo", "geo_ferramentas_processos", "novo_conteudo"].includes(r.acao)) {
    trabalhoBySlug.set(`${r.acao}|${r.prompt}`, r);
    continue;
  }
  const sk = r.slug_canonical || r.prompt;
  const prev = trabalhoBySlug.get(`slug|${sk}`);
  if (!prev || (r.topic_volume || 0) > (prev.topic_volume || 0)) {
    trabalhoBySlug.set(`slug|${sk}`, { ...r, prompt: `[slug] ${sk} · ${r.topic_semrush || r.vertical}` });
  }
}
const trabalhoFinal = [...trabalhoBySlug.values()];

const linesWork = [
  cols.join(","),
  ...trabalhoFinal.map((row) => cols.map((c) => csvEscape(row[c])).join(",")),
];
fs.writeFileSync(OUT_WORK, linesWork.join("\n"), "utf8");

const OUT_GAP = path.join(__dirname, "audit-geo-qualiex-gaps-br.csv");
const gapRows = rowsOut.filter((r) => r.fonte === "gap_topics_qualiex");
const linesGap = [
  cols.join(","),
  ...gapRows.map((row) => cols.map((c) => csvEscape(row[c])).join(",")),
];
fs.writeFileSync(OUT_GAP, linesGap.join("\n"), "utf8");

const linesAmostra = [
  cols.join(","),
  ...amostraDedup.map((row) => cols.map((c) => csvEscape(row[c])).join(",")),
];
fs.writeFileSync(OUT_AMOSTRA, linesAmostra.join("\n"), "utf8");

console.log(`OK ${rowsOut.length} linhas -> ${OUT}`);
console.log(`OK ${trabalhoFinal.length} linhas acao -> ${OUT_WORK}`);
console.log(`OK ${gapRows.length} gaps BR -> ${OUT_GAP}`);
console.log(`OK ${amostraDedup.length} amostra semana1 -> ${OUT_AMOSTRA}`);
console.log(`GEO no repo: ${geoSlugs.size} slugs com post-portas`);
