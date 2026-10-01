# Criativos feed — webinars ISO 9001:2026

Padrão oficial **1080×1350** (master em `masters/feed-referencia-completa.jpg`, export do arquivo de set/2026).

Camadas fixas extraídas do master: Dani + globo + “Mão na massa” (`assets/layer-right.jpg`) e faixa **INSCREVA-SE E PARTICIPE** (`assets/layer-cta.jpg`). Texto da esquerda é gerado no HTML.

## Gerar outubro/2026

Coloque o JFIF oficial em `masters/feed-referencia-completa.jpg` (se ainda não estiver).

```bash
node scripts/criativos-webinars/render-feed-1080.mjs
node scripts/webinars-webp.mjs scripts/criativos-webinars/out-2026-10
```

PNG em `out-2026-10/`; webp do card do blog em `public/assets/webinars/`.

## Nomenclatura (designer / script webp)

`01a_DD-MM_{slug}_feed-1080x1080.png` → slug deve bater com `src/data/webinars.js`.
