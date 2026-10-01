/**
 * Gera PNG no padrão oficial (1080×1350) a partir do master de set/2026.
 * Tipografia condensada (Bebas Neue + Oswald), alinhada ao JFIF de referência.
 * Uso: node scripts/criativos-webinars/render-feed-1080.mjs
 */
import { mkdirSync, existsSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(AQUI, "out-2026-10");
const MASTER = path.join(AQUI, "masters", "feed-referencia-completa.jpg");
const ASSETS = path.join(AQUI, "assets");
const LAYER_RIGHT = path.join(ASSETS, "layer-right.jpg");
const LAYER_CTA = path.join(ASSETS, "layer-cta.jpg");

const W = 1080;
const H = 1350;
const CTA_H = 130;
/** Recorte só Dani + globo + Mão na massa (sem textos do master no centro). */
const RIGHT_SLICE = 640;

const CRIATIVOS = [
  {
    arquivo: "01a_07-10_foco-cliente-politica_feed-1080x1080.png",
    requisito: "REQUISITOS 5.1, 5.2 E 6.2",
    titulo: "FOCO NO CLIENTE,<br>POLÍTICA E OBJETIVOS",
    tagline: 'DA POLÍTICA AO OBJETIVO<br><span class="acc">QUE O CLIENTE SENTE.</span>',
    data: "07/10",
  },
  {
    arquivo: "02a_14-10_requisitos-produtos-servicos_feed-1080x1080.png",
    requisito: "REQUISITO 8.2",
    titulo: "REQUISITOS PARA<br>PRODUTOS E SERVIÇOS",
    tagline: 'DO PEDIDO AO CRITÉRIO<br><span class="acc">ANTES DE PRODUZIR.</span>',
    data: "14/10",
  },
  {
    arquivo: "03a_21-10_compras_feed-1080x1080.png",
    requisito: "REQUISITO 8.4",
    titulo: "COMPRAS",
    tituloSize: 88,
    tagline: 'FORNECEDOR AVALIADO,<br><span class="acc">RISCO SOB CONTROLE.</span>',
    data: "21/10",
  },
  {
    arquivo: "04a_28-10_controle-qualidade_feed-1080x1080.png",
    requisito: "REQUISITOS 8.1, 8.5.1, 8.5.5, 8.6, 8.7, 7.1.5 E 9.1",
    requisitoSize: 19,
    titulo: "CONTROLE DE<br>QUALIDADE",
    tagline: 'DO PLANEJAMENTO À LIBERAÇÃO<br><span class="acc">COM EVIDÊNCIA.</span>',
    data: "28/10",
  },
];

async function ensureLayers() {
  if (!existsSync(MASTER)) {
    throw new Error(
      `Master não encontrado: ${MASTER}\nCopie o JFIF oficial para masters/feed-referencia-completa.jpg`,
    );
  }
  mkdirSync(ASSETS, { recursive: true });
  const mainH = H - CTA_H;
  for (const f of [LAYER_CTA, LAYER_RIGHT]) {
    if (existsSync(f)) unlinkSync(f);
  }
  await sharp(MASTER).extract({ left: 0, top: H - CTA_H, width: W, height: CTA_H }).jpeg({ quality: 95 }).toFile(LAYER_CTA);
  await sharp(MASTER)
    .extract({ left: RIGHT_SLICE, top: 0, width: W - RIGHT_SLICE, height: mainH })
    .jpeg({ quality: 95 })
    .toFile(LAYER_RIGHT);
}

function b64(file) {
  const buf = readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function htmlDo(c, layerRight, layerCta) {
  const reqSize = c.requisitoSize ?? 24;
  const tituloSize = c.tituloSize ?? 62;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden;
    background: #050505;
  }
  .canvas { position: relative; width: ${W}px; height: ${H}px; background: #050505; }
  .left-bg {
    position: absolute; left: 0; top: 0; z-index: 1;
    width: ${RIGHT_SLICE}px; height: ${H - CTA_H}px; background: #050505;
  }
  .layer-right {
    position: absolute; right: 0; top: 0; z-index: 0;
    width: ${W - RIGHT_SLICE}px; height: ${H - CTA_H}px;
    object-fit: cover; object-position: top center;
  }
  .layer-cta {
    position: absolute; left: 0; bottom: 0; z-index: 3; width: ${W}px; height: ${CTA_H}px;
  }
  .left {
    position: absolute; left: 0; top: 0; z-index: 2;
    width: ${RIGHT_SLICE}px; height: ${H - CTA_H}px; padding: 48px 28px 40px 52px; color: #fff;
  }
  .badge {
    display: inline-flex; align-items: center; gap: 12px;
    background: #ff5925; color: #050505; font-family: Montserrat, sans-serif;
    font-weight: 800; font-size: 21px; letter-spacing: 0.02em;
    padding: 14px 24px 14px 20px; border-radius: 999px; text-transform: uppercase;
  }
  .badge svg { width: 30px; height: 30px; flex-shrink: 0; }
  .req {
    margin-top: 32px; font-family: Oswald, sans-serif; font-size: ${reqSize}px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase; color: #fff; line-height: 1.3;
    max-width: 560px;
  }
  .titulo {
    margin-top: 16px; font-family: "Bebas Neue", sans-serif; font-size: ${tituloSize}px;
    line-height: 0.92; letter-spacing: 0.015em; text-transform: uppercase;
    max-width: 560px;
  }
  .iso {
    margin-top: 20px; font-family: "Bebas Neue", sans-serif; color: #ff5925;
    line-height: 0.86; text-transform: uppercase;
  }
  .iso .pre { display: block; font-size: 74px; letter-spacing: 0.02em; }
  .iso .main { display: block; font-size: 118px; letter-spacing: 0.01em; margin-top: -4px; }
  .tagline {
    margin-top: 18px; font-family: Oswald, sans-serif; font-size: 28px; font-weight: 700;
    line-height: 1.08; letter-spacing: 0.03em; text-transform: uppercase; max-width: 540px;
  }
  .tagline .acc { color: #ff5925; }
  .speaker { margin-top: 32px; display: flex; align-items: center; gap: 14px; }
  .speaker .ico {
    width: 36px; height: 36px; border-radius: 50%; border: 2px solid #ff5925;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .speaker .nome {
    font-family: Oswald, sans-serif; font-size: 26px; font-weight: 700;
    letter-spacing: 0.04em; text-transform: uppercase; line-height: 1.1; color: #ff5925;
  }
  .speaker .nome em { font-style: normal; }
  .speaker .cargo {
    margin-top: 6px; font-family: Oswald, sans-serif; font-size: 15px; font-weight: 500;
    letter-spacing: 0.05em; text-transform: uppercase; color: #ececec;
  }
  .when {
    position: absolute; left: 52px; bottom: 32px;
    display: flex; align-items: stretch;
    border: 2px solid #ff5925; border-radius: 12px;
    background: #050505; overflow: hidden;
  }
  .when .col {
    display: flex; align-items: center; gap: 12px; padding: 18px 24px;
  }
  .when .col svg { width: 38px; height: 38px; color: #ff5925; flex-shrink: 0; }
  .when .val {
    font-family: "Bebas Neue", sans-serif; font-size: 52px; line-height: 0.95;
    letter-spacing: 0.02em;
  }
  .when .val.time { font-size: 44px; }
  .when .val small { display: block; font-size: 26px; margin-top: 2px; letter-spacing: 0.04em; }
  .when .sep { width: 2px; background: #ff5925; margin: 10px 0; }
</style>
</head>
<body>
<div class="canvas">
  <img class="layer-right" src="${layerRight}" alt="" />
  <div class="left-bg"></div>
  <div class="left">
    <div class="badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 20h8M12 17v3"/><polygon points="9,9 9,13 13,11" fill="currentColor" stroke="none"/></svg>
      Webinar gratuito
    </div>
    <p class="req">${c.requisito}</p>
    <h1 class="titulo">${c.titulo}</h1>
    <p class="iso"><span class="pre">ISO</span><span class="main">9001:2026</span></p>
    <p class="tagline">${c.tagline}</p>
    <div class="speaker">
      <div class="ico" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5925" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 14.5-4 16 0"/></svg>
      </div>
      <div>
        <div class="nome"><em>Com Dani Albuquerque</em></div>
        <div class="cargo">Especialista em gestão e qualidade</div>
      </div>
    </div>
    <div class="when">
      <div class="col">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
        <div class="val">${c.data}</div>
      </div>
      <div class="sep"></div>
      <div class="col">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>
        <div class="val time">ÀS<small>16H</small></div>
      </div>
    </div>
  </div>
  <img class="layer-cta" src="${layerCta}" alt="" />
</div>
</body>
</html>`;
}

async function main() {
  await ensureLayers();
  mkdirSync(OUT, { recursive: true });
  const layerRight = b64(LAYER_RIGHT);
  const layerCta = b64(LAYER_CTA);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
  });

  for (const c of CRIATIVOS) {
    const dest = path.join(OUT, c.arquivo);
    await page.setContent(htmlDo(c, layerRight, layerCta), { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      const fams = ["Bebas Neue", "Oswald", "Montserrat"];
      await Promise.all(
        fams.map((f) => document.fonts.load(`16px "${f}"`).catch(() => {})),
      );
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: dest, type: "png" });
    console.log("OK", c.arquivo);
  }

  await browser.close();
  console.log(`\n${CRIATIVOS.length} criativos (${W}×${H}) em ${OUT}`);
  console.log("Próximo: node scripts/webinars-webp.mjs scripts/criativos-webinars/out-2026-10");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
