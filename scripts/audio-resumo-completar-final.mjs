#!/usr/bin/env node
/**
 * Completa o final de um MP3 já gerado (ElevenLabs cortou sílaba) sem regravar o roteiro inteiro.
 *
 *   ELEVENLABS_API_KEY=... SUPABASE_SERVICE_KEY=... node scripts/audio-resumo-completar-final.mjs \
 *     --slug=sassmaq-4-edicao-2026-mudancas-prazo-transicao \
 *     --cortar-em=121.35 \
 *     --texto="Guia completo: o que é SASSMAQ, no blog Certificação ISO."
 *
 * Opcional: --mp3=caminho (senão baixa do Storage ou usa .audio-cache/<slug>.*.mp3 mais recente)
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(AQUI, "..");
const DIR_CACHE = path.join(ROOT, ".audio-cache");

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
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const SB_URL = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const SB_SERVICE = process.env.SUPABASE_SERVICE_KEY || "";
const XI_KEY = process.env.ELEVENLABS_API_KEY || "";
const BUCKET = "blog-audio";
const MODELO = "eleven_multilingual_v2";
const VOZ = "9ot6RbCReBjaKntxe93J";

const argv = process.argv.slice(2);
const flag = (nome) => {
  const hit = argv.find((a) => a.startsWith(`--${nome}=`));
  return hit ? hit.slice(nome.length + 3) : null;
};

const SLUG = flag("slug");
const CORTAR = parseFloat(flag("cortar-em") || "0");
const TEXTO = flag("texto");
const MP3_ARG = flag("mp3");

if (!SLUG || !CORTAR || !TEXTO) {
  console.error("Uso: --slug=... --cortar-em=121.35 --texto=\"...\"");
  process.exit(1);
}
if (!SB_SERVICE || !XI_KEY) {
  console.error("Faltam SUPABASE_SERVICE_KEY e ELEVENLABS_API_KEY.");
  process.exit(1);
}

function duracaoSegundos(buf) {
  let inicio = 0;
  if (buf.length > 10 && buf.toString("latin1", 0, 3) === "ID3") {
    const tam = (buf[6] << 21) | (buf[7] << 14) | (buf[8] << 7) | buf[9];
    inicio = 10 + tam;
  }
  return Math.round((buf.length - inicio) / 16000);
}

async function sb(caminho, opcoes = {}) {
  const r = await fetch(`${SB_URL}${caminho}`, {
    ...opcoes,
    headers: {
      apikey: SB_SERVICE,
      Authorization: `Bearer ${SB_SERVICE}`,
      ...(opcoes.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`Supabase ${caminho} → HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
}

async function narrar(texto) {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOZ}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": XI_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: texto,
        model_id: MODELO,
        voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.05, use_speaker_boost: true },
      }),
    },
  );
  if (!r.ok) throw new Error(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return Buffer.from(await r.arrayBuffer());
}

function ffmpeg(args) {
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`ffmpeg falhou: ${r.stderr?.slice(-800)}`);
}

async function resolverMp3Entrada() {
  if (MP3_ARG) return MP3_ARG;
  const files = (await readdir(DIR_CACHE)).filter((f) => f.startsWith(`${SLUG}.`) && f.endsWith(".mp3"));
  if (files.length) {
    files.sort();
    return path.join(DIR_CACHE, files[files.length - 1]);
  }
  const url = `${SB_URL}/storage/v1/object/public/${BUCKET}/${SLUG}.mp3`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const tmp = path.join(DIR_CACHE, `${SLUG}._download.mp3`);
  await writeFile(tmp, buf);
  return tmp;
}

const entrada = await resolverMp3Entrada();
const headWav = path.join(DIR_CACHE, `${SLUG}._head.wav`);
const tailMp3 = path.join(DIR_CACHE, `${SLUG}._tail.mp3`);
const saida = path.join(DIR_CACHE, `${SLUG}._patched.mp3`);

console.log(`Entrada: ${entrada}`);
console.log(`Corte em ${CORTAR}s · tail: ${TEXTO.length} chars (~${TEXTO.length} créditos)`);

ffmpeg(["-y", "-i", entrada, "-t", String(CORTAR), "-ar", "44100", "-ac", "1", headWav]);

const tailBuf = await narrar(TEXTO);
await writeFile(tailMp3, tailBuf);

ffmpeg([
  "-y",
  "-i",
  headWav,
  "-i",
  tailMp3,
  "-filter_complex",
  "[0:a][1:a]concat=n=2:v=0:a=1[out]",
  "-map",
  "[out]",
  "-c:a",
  "libmp3lame",
  "-b:a",
  "128k",
  "-ar",
  "44100",
  saida,
]);

const mp3 = await readFile(saida);
const dur = duracaoSegundos(mp3);
const vTag = createHash("sha256").update(mp3).digest("hex").slice(0, 8);

await sb(`/storage/v1/object/${BUCKET}/${SLUG}.mp3`, {
  method: "POST",
  headers: { "Content-Type": "audio/mpeg", "x-upsert": "true", "cache-control": "max-age=31536000" },
  body: mp3,
});

const url = `${SB_URL}/storage/v1/object/public/${BUCKET}/${SLUG}.mp3?v=${vTag}`;

await sb(`/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(SLUG)}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify({
    audio_url: url,
    audio_duration_s: dur,
    audio_generated_at: new Date().toISOString(),
  }),
});

// Mantém MP3 final no cache com hash do roteiro anterior + sufixo patch
const cacheFinal = path.join(DIR_CACHE, `${SLUG}.${vTag}.mp3`);
await writeFile(cacheFinal, mp3);

for (const f of [headWav, tailMp3]) {
  try {
    await unlink(f);
  } catch {
    /* ok */
  }
}

console.log(`✓ ${SLUG} — ${dur}s · ${(mp3.length / 1024 / 1024).toFixed(2)} MB · ${url}`);
console.log("Rebuild do blog para o player pegar audio_duration_s atualizado.");
