# Criativos feed (1080×1080) — webinars ISO 9001:2026

Layout alinhado ao criativo de setembro/2026 (badge laranja, tipografia Montserrat, Dani + globo).

## Gerar outubro/2026

```bash
node scripts/criativos-webinars/render-feed-1080.mjs
node scripts/webinars-webp.mjs scripts/criativos-webinars/out-2026-10
```

PNG ficam em `out-2026-10/` (não versionar PNGs pesados se preferir; manter webp em `public/assets/webinars/`).

Foto da palestrante: `assets/dani.jpg` (cópia de `site-templum/site/public/assets/img/socios/dani.jpg`).

Referência visual: `referencia-set-2026.png`.

## Nomenclatura (designer / script webp)

`01a_DD-MM_{slug}_feed-1080x1080.png` → slug deve bater com `src/data/webinars.js`.
