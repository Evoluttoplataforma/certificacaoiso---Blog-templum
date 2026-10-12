# Plano GEO + SERP (14 dias) · certificacaoiso.com.br

Duas metas em paralelo:

1. **SERP Google (orgânico):** entrar no **top 10** nas head terms `certificação iso 9001 / 27001 / 14001 / 45001` (Semrush BR, 11/out/2026).
2. **AI Visibility (GEO):** subir score (~15 → movimento +5–10 pts em 14 dias; 42 exige semanas 3–6).

**Diagnóstico Semrush (Positions + Keyword Overview + SERP URLs, Desktop 12/out/2026):**

| Keyword (BR) | Vol. | KD | Pos. hoje | URL que o Google usa hoje | Problema |
|--------------|------|-----|-----------|---------------------------|----------|
| certificação iso 9001 | ~880–1k | 28 | **26** | `/iso-9001/` (hub) | Cannibalização: pillar certificação existe (`/passo-a-passo-certificacao-iso-9001/`, pos. 24–35 em variantes) mas o hub “rouba” a head term |
| quanto custa certificação iso 9001 | ~90–170 | **6** | **26** | `/iso-9001/` | Página certa (`/quanto-custa-iso-9001/`) rankeia outras queries, não esta (KD baixíssimo = quick win) |
| certificação iso 27001 | **390** | **23** | **não rankeia** | — | Hub `/iso-27001/` rankeia só “27001” genérico (pos. ~25); pillar longo não recebe intent “certificação” |
| certificação iso 14001 | ~260–320 | 23 | **22** | `/iso-14001-2/` | Quase página 1, mas **slug fraco** e título não lidera com “Certificação ISO 14001” |
| certificação iso 45001 | ~140 | **20** | **não rankeia** | — | Pillar `/passo-a-passo-certificacao-iso-45001/` existe; hub compete e não ancora a head term |

**SERP genérico “certificação iso” (export URLs):** top 10 mistura certificadoras (Vanzolini, Bureau Veritas), gov/Inmetro, blogs (Gupy, Qualyteam, QMS Brasil). **certificacaoiso.com.br não aparece no top 10** desse SERP amplo. Para normas específicas, o padrão é URL com **`certificacao-iso-XXXX`** ou título explícito “Certificação ISO …”.

**Regra de ouro (14 dias):** **1 URL canônica por intent “certificação + norma”**. Hub = o que é / requisitos; pillar = como certificar, prazo, custo, organismo. **Nunca citar concorrentes** em copy pública.

Planilhas:

- **`scripts/audit-serp-head-terms-br-2026-10-12.csv`**: head terms, posição, URL atual vs canônica alvo.
- **`scripts/audit-geo-semrush-trabalho.csv`**: GEO / prompts IA (gerar com `_build-audit-geo-semrush-master.mjs`).
- **`scripts/plano-geo-14-dias-2026-10.md`**: este arquivo.

---

## Trilha A · P0 SERP (dias 1–5) — aparecer nas principais buscas

### A1 · Consolidar canonicals (dia 1)

| Norma | URL canônica “certificação” | Hub (suporte) |
|-------|-----------------------------|---------------|
| 9001 | `/passo-a-passo-certificacao-iso-9001/` | `/iso-9001/` |
| 9001 custo | `/quanto-custa-iso-9001/` | link do hub, não competir |
| 27001 | `/certificacao-iso-27001-etapas-prazo-custo/` (+ alias curto abaixo) | `/iso-27001/` |
| 27001 custo | `/quanto-custa-iso-27001/` | idem |
| 14001 | **`/iso-14001/`** (migrar de `/iso-14001-2/`) | consultoria separada |
| 45001 | `/passo-a-passo-certificacao-iso-45001/` | `/iso-45001/` |

**Entregas técnicas:**

1. **Redirect 301** `iso-14001-2` → `iso-14001` (Worker ou Astro redirect; manter conteúdo no slug limpo).
2. **Alias 301** `/certificacao-iso-27001/` → pillar etapas/prazo/custo (URL curta igual aos concorrentes no SERP).
3. Opcional 9001/45001: alias `/certificacao-iso-9001/` e `/certificacao-iso-45001/` → passo a passo respectivo.

### A2 · On-page por pillar (dias 2–3)

Para **cada** URL canônica acima:

- **`seo_title`** começa com **“Certificação ISO XXXX”** (ou “Quanto custa a certificação ISO XXXX”).
- **Primeiro `<p>` + `#respostas-diretas`**: resposta em 2–3 frases (o que é certificação, quem emite, prazo típico, link custo).
- **FAQ** espelhando People Also Ask do Semrush (9001: o que é / quanto custa; 14001: como conseguir / como certificar; 27001: benefícios / etapas).
- **H2** “Como obter a certificação ISO XXXX” com lista numerada (estágios 1 e 2 quando aplicável).
- **Bloco “Consultoria x organismo certificador”** (E-E-A-T; alinha com gov e certificadoras sem citá-las).

**Hubs (`iso-9001`, `iso-27001`, `iso-45001`, `iso-14001`):**

- Acima da dobra: parágrafo curto + **link único** “Guia completo da certificação ISO XXXX” → pillar (anchor exata).
- Reduzir repetição de “certificação” no hub para não cannibalizar (foco “o que é / requisitos / 2026”).

### A3 · Internal linking (dia 3)

- **`public/llms.txt` / `llms-full.txt`:** primeira menção de cada norma aponta para **pillar certificação**, não só hub.
- **Posts satélite** (consultoria, NR-1, 27701, SGI): 1 link contextual por artigo para o pillar da norma com anchor “certificação ISO XXXX”.
- **Interlink pillars:** passo a passo ↔ quanto custa ↔ hub (triângulo).

### A4 · SERP features (dias 4–5)

- **9001 / 27001:** AI Overview + vídeo no SERP → garantir **FAQ schema** via meta FAQ; considerar **Short/YouTube** com descrição linkando URL canônica (off-site).
- **14001:** pos. 22 → prioridade **máxima**: slug + title + 300–500 palavras novas só na seção certificação (como conseguir, LAIA, organismo).

**Meta 14 dias (SERP):** pos. **≤15** em 9001 e 14001; **entrar top 30** em certificação 27001/45001; **pos. ≤10** em “quanto custa certificação iso 9001”.

---

## Trilha B · GEO / AI (dias 1–14) — continuidade do lote publicado

*(Operacional + 27001 custo já publicados em 12/out; marcar `geo_repo=sim` na planilha.)*

### Semana 1 (dias 1–7)

- **P0 IA:** `quanto-custa-iso-27001`, pillar certificação 27001, hub 27001 (GRC/compliance).
- **P1 ferramentas:** mapeamento, fluxograma, documentos, 7.5, 5W2H, 5 Porquês, auditoria interna 9001 (GEO + llms).
- **Off-site:** YouTube / templum.com.br → URLs canônicas da Trilha A.

### Semana 2 (dias 8–14)

- FSSC, SASSMAQ, aspectos 14001, GED vs 7.5.
- Reexport Semrush AI Visibility + GSC (filtros head terms da tabela).
- Atualizar `audit-serp-head-terms-br-*.csv` com novo export Positions.

---

## Prioridades unificadas

| Prioridade | SERP (Google) | GEO (IA) |
|------------|---------------|----------|
| **P0** | Canonical + on-page certificação 9001/27001/14001/45001; quanto custa 9001 | Custo 27001, prompts certificação 27001/27701 90+ |
| **P1** | Internal link + redirects; 14001 subir para top 15 | Ferramentas, mapeamento, auditoria 9001 |
| **P2** | Vídeo + off-site templum.com.br | FSSC, SASSMAQ, 14001 aspectos |
| **P3** | Backlinks (parceiros, guest posts) | Backlog planilha |

Colunas **`acao`** (planilha GEO): `upgrade_geo` · `refinar_geo` · `nova_pagina` · `monitorar_citacao` · `ignorar_ruido`

Colunas **`acao`** (planilha SERP): `consolidar_canonical` · `on_page_pillar` · `redirect_301` · `internal_links` · `monitorar_posicao`

---

## Métricas de sucesso

**SERP (Position Tracking Semrush ou Positions export):**

- certificação iso 9001: 26 → **≤12**
- quanto custa certificação iso 9001: 26 → **≤8**
- certificação iso 14001: 22 → **≤10**
- certificação iso 27001: ausente → **≤25** (depois ≤15)
- certificação iso 45001: ausente → **≤25**

**GEO:** citações em prompts Semrush; cited pages estáveis; GSC impressões nas head terms.

**Build:** `npm run build` antes de cada push (`git push origin main` = produção).

---

## Comandos

```powershell
cd C:\Users\Raquel\Projects\certificacaoiso---Blog-templum
node scripts/_build-audit-geo-semrush-master.mjs
python scripts/_tmp-analyze-semrush-head-terms.py
```

Opcional: `$env:SEMRUSH_DIR="C:\Users\Raquel\Desktop\Marketing Templum\SemRush"`

Após novo export Positions na Desktop, regerar `audit-serp-head-terms-br-*.csv` (script Python ou próxima versão do builder).
