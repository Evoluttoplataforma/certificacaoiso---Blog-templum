#!/usr/bin/env node
/**
 * Resumo em áudio dos artigos — roteiro → ElevenLabs → Supabase Storage → banco.
 *
 * Roda FORA do build, sob demanda. O build não fala com o ElevenLabs: quando o Astro
 * monta a página, o áudio já é uma URL numa coluna do post (`select=*` em posts.js).
 * Isso é de propósito — TTS na hora do build significaria pagar o ElevenLabs de novo a
 * cada deploy (e são vários por dia, cada publicação do CMS dispara um) para produzir
 * exatamente o mesmo MP3.
 *
 * Uso:
 *   ELEVENLABS_API_KEY=... SUPABASE_SERVICE_KEY=... node scripts/audio-resumo.mjs [flags]
 *
 *   --slug=<slug>     só este post (repetível: --slug=a --slug=b)
 *   --seco            não chama o ElevenLabs nem grava nada: só diz o que faria e
 *                     quanto custaria em créditos. Rode isto ANTES de qualquer leva.
 *   --forcar          regrava mesmo que o roteiro não tenha mudado
 *   --modelo=<id>     eleven_multilingual_v2 (padrão) | eleven_v3 | eleven_flash_v2_5
 *   --voz=<voice_id>  padrão: Olívia (9ot6RbCReBjaKntxe93J)
 *
 * Os roteiros ficam em supabase/roteiros-audio/<slug>.txt — versionados no git, porque
 * o roteiro é conteúdo editorial (o que a voz da marca diz), não um artefato de build.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR_ROTEIROS = path.join(AQUI, "..", "supabase", "roteiros-audio");
// Cache local dos MP3 já pagos, nomeado por hash. O TTS é a parte CARA do pipeline; o
// upload e o PATCH são a parte que falha (rede, chave expirada, bucket cheio). Sem
// cache, um erro depois do TTS bem-sucedido joga fora áudio pago e a retentativa
// cobra de novo. Fora do git — ver .gitignore.
const DIR_CACHE = path.join(AQUI, "..", ".audio-cache");

// Carrega `.env` local (gitignored) sem dependência extra. Env já setada no shell ganha.
{
  const envPath = path.join(AQUI, "..", ".env");
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

const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const SB_SERVICE = process.env.SUPABASE_SERVICE_KEY || "";
// A anon key (pública, mesma de src/lib/posts.js) basta para LER post publicado. Ela
// existe aqui para o `--seco` funcionar sem a service_role: estimar quanto uma leva vai
// custar é justamente o que se quer fazer ANTES de ir buscar a chave que escreve.
const SB_ANON = process.env.SUPABASE_ANON_KEY || "sb_publishable_Yfg9Ts5WRqD4Gc3jeWAS2A_-YWZrtiQ";
const XI_KEY = process.env.ELEVENLABS_API_KEY || "";
const BUCKET = "blog-audio";

// --- argumentos -----------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (nome, padrao = null) => {
  const hit = argv.find((a) => a.startsWith(`--${nome}=`));
  return hit ? hit.slice(nome.length + 3) : padrao;
};
const tem = (nome) => argv.includes(`--${nome}`);

const SECO = tem("seco");
const FORCAR = tem("forcar");
const MODELO = flag("modelo", "eleven_multilingual_v2");
const VOZ = flag("voz", "9ot6RbCReBjaKntxe93J"); // Olívia, pt-BR
const SLUGS_PEDIDOS = argv.filter((a) => a.startsWith("--slug=")).map((a) => a.slice(7));

// Fator de custo por caractere, do GET /v1/models. Os modelos "0,5" cobram metade —
// é a diferença entre caber e não caber no plano, então o relatório de custo precisa
// saber disso em vez de assumir 1 crédito por caractere.
const FATOR_CREDITO = {
  eleven_multilingual_v2: 1,
  eleven_v3: 1,
  eleven_v3_conversational: 0.5,
  eleven_flash_v2_5: 0.5,
  eleven_turbo_v2_5: 0.5,
};

// --- helpers --------------------------------------------------------------------
const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");

/**
 * Duração do MP3 sem ffprobe (que não existe nesta máquina).
 * output_format=mp3_44100_128 é CBR 128kbps → 16.000 bytes por segundo de áudio.
 * Desconta a tag ID3v2 do começo, senão todo arquivo sai ~0,03s mais longo do que é.
 * Erro esperado: décimos de segundo — e o número só serve para escrever "1 min 32" na
 * tela, não para sincronizar nada.
 */
function duracaoSegundos(buf) {
  let inicio = 0;
  if (buf.length > 10 && buf.toString("latin1", 0, 3) === "ID3") {
    // synchsafe: 7 bits úteis por byte
    const tam = (buf[6] << 21) | (buf[7] << 14) | (buf[8] << 7) | buf[9];
    inicio = 10 + tam;
  }
  return Math.round((buf.length - inicio) / 16000);
}

/** Limpa o roteiro: tira linhas de comentário (#) e normaliza espaço em branco. */
function limparRoteiro(txt) {
  return txt
    .split("\n")
    .filter((l) => !l.trimStart().startsWith("#"))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const fmtDur = (s) => (s >= 60 ? `${Math.floor(s / 60)}min${String(s % 60).padStart(2, "0")}` : `${s}s`);

async function sb(caminho, opcoes = {}) {
  // `escrita: false` usa a anon key quando não há service_role — só para leitura.
  const { escrita = true, ...resto } = opcoes;
  const chave = escrita || SB_SERVICE ? SB_SERVICE : SB_ANON;
  const r = await fetch(`${SB_URL}${caminho}`, {
    ...resto,
    headers: {
      apikey: chave,
      Authorization: `Bearer ${chave}`,
      ...(resto.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`Supabase ${caminho} → HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
}

// --- ElevenLabs -----------------------------------------------------------------
async function narrar(texto) {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOZ}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": XI_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: texto,
        model_id: MODELO,
        // stability alta e style baixo de propósito: isto é narração informativa de
        // norma técnica, não locução de anúncio. Com style alto a voz "atua" — sobe o
        // tom em número e sigla, e "ISO 9001" sai com entonação de oferta.
        voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.05, use_speaker_boost: true },
      }),
    },
  );
  if (!r.ok) throw new Error(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return Buffer.from(await r.arrayBuffer());
}

// --- programa -------------------------------------------------------------------
async function main() {
  // Roteiros no disco
  let arquivos = [];
  try {
    arquivos = (await readdir(DIR_ROTEIROS)).filter((f) => f.endsWith(".txt"));
  } catch {
    console.error(`Sem roteiros: a pasta ${DIR_ROTEIROS} não existe.`);
    process.exit(1);
  }
  let roteiros = [];
  for (const f of arquivos) {
    const slug = f.replace(/\.txt$/, "");
    if (SLUGS_PEDIDOS.length && !SLUGS_PEDIDOS.includes(slug)) continue;
    const texto = limparRoteiro(await readFile(path.join(DIR_ROTEIROS, f), "utf8"));
    if (!texto) { console.warn(`· ${slug}: roteiro vazio, pulando`); continue; }
    roteiros.push({ slug, texto, hash: sha256(`${MODELO}|${VOZ}|${texto}`) });
  }
  if (!roteiros.length) { console.error("Nenhum roteiro para processar."); process.exit(1); }
  roteiros.sort((a, b) => a.slug.localeCompare(b.slug));

  // A service_role só é exigida na hora de escrever (mais abaixo). Cobrar ela aqui
  // tornaria o --seco inútil, que é o modo que existe pra rodar antes de ter a chave.
  if (!SECO && !SB_SERVICE) { console.error("Falta SUPABASE_SERVICE_KEY no ambiente (ou rode com --seco)."); process.exit(1); }

  // Estado atual no banco — para saber o que já está gravado e não pagar duas vezes.
  // Leitura: `escrita: false` permite cair na anon key no modo seco.
  const lista = roteiros.map((r) => `"${r.slug}"`).join(",");
  const atuais = await (await sb(
    `/rest/v1/blog_templum_posts?slug=in.(${lista})&select=slug,status,audio_url,audio_script_hash`,
    { escrita: false },
  )).json();
  const porSlug = new Map(atuais.map((p) => [p.slug, p]));

  const fator = FATOR_CREDITO[MODELO] ?? 1;
  const fila = [];
  let creditos = 0;

  console.log(`\nmodelo ${MODELO} (${fator} créd./caractere) · voz ${VOZ}\n`);
  for (const r of roteiros) {
    const atual = porSlug.get(r.slug);
    if (!atual) { console.log(`✗ ${r.slug} — não existe no banco (slug errado?)`); continue; }
    if (atual.status !== "published") { console.log(`✗ ${r.slug} — post está "${atual.status}", não vai pro ar`); continue; }
    if (atual.audio_script_hash === r.hash && atual.audio_url && !FORCAR) {
      console.log(`= ${r.slug} — inalterado, pulando (--forcar regrava)`);
      continue;
    }
    const custo = Math.round(r.texto.length * fator);
    creditos += custo;
    fila.push(r);
    const marca = atual.audio_url ? "↻" : "+";
    console.log(`${marca} ${r.slug} — ${r.texto.length} caracteres, ~${custo} créditos`);
  }

  console.log(`\n${fila.length} áudio(s) a gerar · ~${creditos.toLocaleString("pt-BR")} créditos do ElevenLabs`);
  if (SECO) { console.log("\n--seco: nada foi gerado nem gravado."); return; }
  if (!fila.length) return;
  if (!XI_KEY) { console.error("Falta ELEVENLABS_API_KEY no ambiente."); process.exit(1); }

  console.log("");
  await mkdir(DIR_CACHE, { recursive: true });
  let ok = 0;
  for (const r of fila) {
    try {
      // Reaproveita o MP3 se este roteiro+voz+modelo já foi narrado antes.
      const cache = path.join(DIR_CACHE, `${r.slug}.${r.hash.slice(0, 12)}.mp3`);
      let mp3;
      try {
        mp3 = await readFile(cache);
        console.log(`· ${r.slug} — MP3 já em cache, sem novo custo de TTS`);
      } catch {
        mp3 = await narrar(r.texto);
        await writeFile(cache, mp3);
      }
      const dur = duracaoSegundos(mp3);

      // upsert no bucket: mesmo caminho por slug, então regravar substitui em vez de
      // acumular arquivo órfão que ninguém sabe se ainda é referenciado.
      // "max-age=N" — a forma que o cliente oficial do Storage usa. Um ano é seguro
      // porque a URL leva ?v=<hash>: roteiro novo, URL nova.
      //
      // NÃO se assuste ao conferir com curl: a resposta pública vem com
      // `cache-control: no-cache`, mesmo com este valor gravado na metadata do objeto
      // (confirmável em storage.objects.metadata). É o CDN do Supabase, não falha do
      // upload. O efeito prático foi medido: no segundo play o navegador manda uma
      // requisição condicional e recebe 304 com ZERO byte — ninguém rebaixa 1,9MB duas
      // vezes. Perdi dois TTS pagos "consertando" isso; não repita.
      await sb(`/storage/v1/object/${BUCKET}/${r.slug}.mp3`, {
        method: "POST",
        headers: { "Content-Type": "audio/mpeg", "x-upsert": "true", "cache-control": "max-age=31536000" },
        body: mp3,
      });

      // ?v=<hash> porque o caminho no bucket é estável: sem o parâmetro, quem já ouviu
      // a versão antiga continuaria ouvindo ela pelo cache do navegador/CDN depois de
      // uma correção de roteiro — e "corrigi e não mudou" é o pior bug possível aqui.
      const url = `${SB_URL}/storage/v1/object/public/${BUCKET}/${r.slug}.mp3?v=${r.hash.slice(0, 8)}`;

      await sb(`/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(r.slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          audio_script: r.texto,
          audio_url: url,
          audio_duration_s: dur,
          audio_voice: VOZ,
          audio_model: MODELO,
          audio_script_hash: r.hash,
          audio_generated_at: new Date().toISOString(),
        }),
      });

      ok++;
      console.log(`✓ ${r.slug} — ${fmtDur(dur)} · ${(mp3.length / 1024 / 1024).toFixed(2)} MB`);
    } catch (e) {
      console.error(`✗ ${r.slug} — ${e.message}`);
    }
  }
  console.log(`\n${ok}/${fila.length} gerados. Publicar: rebuild do blog (Edge Function blog-templum-rebuild ou push).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
