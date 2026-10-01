/**
 * Gera PNG 1080x1080 (_feed) dos webinars a partir do layout de set/2026.
 * Uso: node scripts/criativos-webinars/render-feed-1080.mjs
 * Requer: npx playwright install chromium (uma vez)
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(AQUI, "out-2026-10");
const REF = path.join(AQUI, "referencia-set-2026.png");
const DANI = path.join(AQUI, "assets", "dani.jpg");
const PANEL = path.join(AQUI, "assets", "painel-direito.png");

const CRIATIVOS = [
  {
    arquivo: "01a_07-10_foco-cliente-politica_feed-1080x1080.png",
    requisito: "REQUISITOS 5.1, 5.2 E 6.2",
    titulo: "FOCO NO CLIENTE,<br>POLÍTICA E OBJETIVOS",
    tituloSize: 52,
    data: "07/10",
  },
  {
    arquivo: "02a_14-10_requisitos-produtos-servicos_feed-1080x1080.png",
    requisito: "REQUISITO 8.2",
    titulo: "REQUISITOS PARA<br>PRODUTOS E SERVIÇOS",
    tituloSize: 50,
    data: "14/10",
  },
  {
    arquivo: "03a_21-10_compras_feed-1080x1080.png",
    requisito: "REQUISITO 8.4",
    titulo: "COMPRAS",
    tituloSize: 72,
    data: "21/10",
  },
  {
    arquivo: "04a_28-10_controle-qualidade_feed-1080x1080.png",
    requisito: "REQ. 8.1 · 8.5.1 · 8.5.5 · 8.6 · 8.7 · 7.1.5 · 9.1",
    requisitoSize: 20,
    titulo: "CONTROLE DE<br>QUALIDADE",
    tituloSize: 58,
    data: "28/10",
  },
];

async function painelDireitoDataUrl() {
  mkdirSync(path.dirname(PANEL), { recursive: true });
  if (!existsSync(PANEL) && existsSync(REF)) {
    const scaled = await sharp(REF).resize({ height: 1080 }).toBuffer();
    const { width } = await sharp(scaled).metadata();
    const w = Math.min(520, width);
    const left = Math.max(0, width - w);
    await sharp(scaled).extract({ left, top: 0, width: w, height: 1080 }).png().toFile(PANEL);
  }
  if (existsSync(PANEL)) {
    const buf = await sharp(PANEL).png().toBuffer();
    return `data:image/png;base64,${buf.toString("base64")}`;
  }
  if (!existsSync(DANI)) throw new Error(`Falta ${PANEL} ou ${DANI}`);
  const buf = await sharp(DANI).jpeg().toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

function htmlDo(c, panelDataUrl) {
  const reqSize = c.requisitoSize ?? 24;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 1080px; height: 1080px; overflow: hidden; background: #050505; font-family: Montserrat, sans-serif; }
  .canvas { position: relative; width: 1080px; height: 1080px; background: #050505; }
  .left { position: relative; z-index: 2; width: 620px; height: 100%; padding: 56px 48px 48px 56px; color: #fff; }
  .badge {
    display: inline-flex; align-items: center; gap: 12px;
    background: #ff5925; color: #050505; font-weight: 900; font-size: 22px;
    letter-spacing: 0.06em; padding: 14px 22px; border-radius: 999px;
    text-transform: uppercase;
  }
  .badge svg { width: 28px; height: 28px; flex-shrink: 0; }
  .req {
    margin-top: 36px; font-size: ${reqSize}px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: #f2f2f2;
    line-height: 1.35; max-width: 560px;
  }
  .titulo {
    margin-top: 18px; font-size: ${c.tituloSize}px; font-weight: 900;
    line-height: 1.08; letter-spacing: -0.02em; text-transform: uppercase;
    max-width: 560px;
  }
  .iso {
    margin-top: 22px; font-size: 58px; font-weight: 900; color: #ff5925;
    letter-spacing: -0.02em; line-height: 1;
  }
  .rule {
    margin-top: 28px; width: 100%; max-width: 520px; height: 3px;
    background: linear-gradient(90deg, rgba(255,89,37,0.15), #ff5925 45%, rgba(255,89,37,0.15));
    box-shadow: 0 0 18px rgba(255,89,37,0.55);
  }
  .speaker { margin-top: 28px; display: flex; align-items: center; gap: 14px; }
  .speaker icon {
    width: 34px; height: 34px; border-radius: 50%; border: 2px solid #ff5925;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .speaker .nome { font-size: 26px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
  .speaker .nome em { font-style: normal; color: #ff5925; }
  .speaker .cargo { margin-top: 6px; font-size: 15px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #d8d8d8; }
  .when {
    position: absolute; left: 56px; bottom: 52px;
    display: flex; align-items: center; gap: 28px;
    border: 2px solid #ff5925; border-radius: 16px; padding: 22px 32px;
    background: rgba(5,5,5,0.72);
  }
  .when .item { display: flex; align-items: center; gap: 14px; }
  .when svg { width: 36px; height: 36px; color: #ff5925; flex-shrink: 0; }
  .when .val { font-size: 44px; font-weight: 900; letter-spacing: 0.02em; }
  .when .val small { display: block; font-size: 22px; font-weight: 700; letter-spacing: 0.14em; margin-top: 2px; }
  .right {
    position: absolute; right: 0; top: 0; width: 520px; height: 1080px;
    pointer-events: none; overflow: hidden;
  }
  .panel {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center top;
  }
</style>
</head>
<body>
<div class="canvas">
  <div class="left">
    <div class="badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/><polygon points="10,10 10,14 14,12" fill="currentColor" stroke="none"/></svg>
      Webinar gratuito
    </div>
    <p class="req">${c.requisito}</p>
    <h1 class="titulo">${c.titulo}</h1>
    <p class="iso">ISO 9001:2026</p>
    <div class="rule"></div>
    <div class="speaker">
      <icon aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5925" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 14.5-4 16 0"/></svg>
      </icon>
      <div>
        <div class="nome">Com <em>Dani Albuquerque</em></div>
        <div class="cargo">Especialista em gestão e qualidade</div>
      </div>
    </div>
    <div class="when">
      <div class="item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
        <div class="val">${c.data}</div>
      </div>
      <div class="item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>
        <div class="val">ÀS<small>16H</small></div>
      </div>
    </div>
  </div>
  <div class="right"><img class="panel" src="${panelDataUrl}" alt="" /></div>
</div>
</body>
</html>`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const panelDataUrl = await painelDireitoDataUrl();

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });

  for (const c of CRIATIVOS) {
    const dest = path.join(OUT, c.arquivo);
    await page.setContent(htmlDo(c, panelDataUrl), { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: dest, type: "png" });
    console.log("OK", c.arquivo);
  }

  await browser.close();
  console.log(`\n${CRIATIVOS.length} criativos em ${OUT}`);
  console.log("Próximo: node scripts/webinars-webp.mjs scripts/criativos-webinars/out-2026-10");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
