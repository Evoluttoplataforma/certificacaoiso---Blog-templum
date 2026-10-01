# Criativos webinar no blog

O card no **fim de todos os artigos** (`WebinarCard`) já troca sozinho por data (`src/data/webinars.js` + script inline no componente). Você só precisa alimentar **datas**, **URLs** e **imagens**.

## A cada mês / série

1. **Datas e copy** — editar `src/data/webinars.js` (`inicio`/`fim` em UTC, `slug`, `url`, `titulo`).
2. **Artes** — colocar os `.webp` (ou PNG `_feed-1080x1080`) nesta pasta, ex.: `out-2026-10/`.
3. **Manifesto** — `manifest.json` na mesma pasta mapeia `slug` → nome do arquivo:

```json
{
  "arquivos": {
    "foco-cliente-politica": "Live-ISO-9001-foco no cliente.webp"
  }
}
```

4. **Publicar assets** (na raiz do repo blog):

```bash
node scripts/webinars-publish-assets.mjs scripts/criativos-webinars/out-2026-10
```

5. **`npm run build`** e deploy (`git push origin main`).

## Alternativa: PNG do feed 1080

Se vier só PNG no padrão `01a_07-10_foco-cliente-politica_feed-1080x1080.png`:

```bash
npm i -D sharp
node scripts/webinars-webp.mjs scripts/criativos-webinars/out-2026-10
```

(O script infere o slug pelo nome do arquivo.)

## Slug = nome do arquivo no site

Imagem servida em: `/assets/webinars/{slug}.webp` — tem que bater com `slug` em `webinars.js`.
