# Plano GEO + Semrush (14 dias) · certificacaoiso.com.br

Meta: subir **AI Visibility** (hoje ~15) em direção a **42**, fechando gaps de prompts Semrush em normas ISO e em **ferramentas de gestão** (processos, documentos, qualidade).

Planilhas (geradas por `node scripts/_build-audit-geo-semrush-master.mjs`):

- **`scripts/audit-geo-semrush-trabalho.csv`**: ações pendentes (GEO upgrade, gaps Qualiex, vs Qualiex).
- **`scripts/audit-geo-qualiex-gaps-br.csv`**: tópicos BR onde Qualiex/8quali aparecem e nós quase não.
- **`scripts/audit-geo-semrush-amostra-semana1.csv`**: 40 prompts de mapeamento + custo 27001.
- **`scripts/audit-geo-semrush-master.csv`**: base completa deduplicada por prompt.

---

## O que a Qualiex “ganha” hoje (e nós ignoramos)

| Área | Volume BR (Semrush gap) | Quem aparece nas IAs | Nosso ativo |
|------|-------------------------|----------------------|-------------|
| Gestão de documentos / POP | ~1,3k + ~8,8k | Microsoft, SoftExpert; 8quali 1 menção | `controle-de-documentos`, `instrucao-de-trabalho-it`, hub 9001 §7.5 |
| 5W2H / 5 Porquês / causa raiz | alto | Microsoft baixo; 8quali pontual | posts legados; **sem GEO** na maioria |
| Mapeamento / gestão de processos | ~8k + prompts 95+ relevância | Lucidchart, Miro, SaaS | `mapeamento-de-processos-e-a-iso-9001`, `o-que-e-fluxograma-de-processos` |
| 7 ferramentas / CEP | ~2,5k | genérico | `as-sete-ferramentas-da-qualidade`, `5s` |
| Auditoria ISO 9001 (ferramentas) | Qualiex vis. 8 no prompt | Qualiex citada | cluster auditoria **sem** bloco GEO unificado |
| SGQ genérico | ~100k (tópico enorme) | Qualiex vis. 15 | `iso-9001` hub com portas, não “software SGQ” |

**Estratégia:** não competir por login de software de terceiros. Competir por **“como fazer X na ISO 9001/27001”** + **ferramentas/métodos** com CTA Templum OS e links para normas. **Nunca citar nomes de concorrentes** em artigo, meta, FAQ ou bloco GEO.

---

## Semana 1 (dias 1–7): impacto rápido em 27001 + custo + mapa do site

### Dia 1–2 · P0 custo e canonical

1. Publicar **`/quanto-custa-iso-27001/`** (espelhar estrutura `quanto-custa-45001` e `quanto-custa-27701`: faixas, disclaimer ISO 27006-1, tabela por porte, `#respostas-diretas`).
2. Atualizar **`public/llms.txt`** e **`llms-full.txt`**: incluir quanto-custa-27001, quanto-custa-27701, hubs 27001/27701.
3. Enxugar **`qual-a-relacao-da-iso-27001-com-a-iso-27701`**: resposta direta no topo; evitar diluição em prompts de custo/certificação.

### Dia 3–4 · Ferramentas e processos (gap Qualiex)

4. **Hub novo ou upgrade:** `ferramentas-gestao-qualidade-iso-9001` (ou expandir `as-sete-ferramentas-da-qualidade`):
   - 5W2H, 5 Porquês, Ishikawa, PDCA, fluxograma, mapa de processos, NC/CAR (10.2).
   - Cada item: 1 parágrafo resposta direta + link ISO 9001:2015/2026.
5. **GEO em lote** (post-portas + `#respostas-diretas`):
   - `mapeamento-de-processos-e-a-iso-9001`
   - `o-que-e-fluxograma-de-processos`
   - `controle-de-documentos` + `iso-9001-requisitos-7-5-informacao-documentada`
   - `analise-de-causa-raiz`, `5s`, `programa-5s-e-a-iso-9001`
   - `o-que-e-nao-conformidade`
6. Prompts alvo (Semrush `mapeamento_de_processos_br.csv`): “como mapear um processo”, “ferramentas de mapeamento”, “identificar gargalos”.

### Dia 5 · Auditoria interna ISO 9001

7. Pillar **`auditoria-interna-iso-9001-ferramentas`**: bloco GEO “melhores práticas e ferramentas auditoria ISO 9001” (prompt Semrush de práticas/ferramentas).
8. Internal linking: hub `iso-9001` → ferramentas → auditoria → documentos.

### Dia 6–7 · Off-site + republicar

9. **YouTube / templum.com.br:** descrições com URL canônica dos hubs atualizados (27001 custo, mapeamento, documentos).
10. Supabase publish + `npm run build` + marcar coluna `prazo_semana` na planilha (Semana 1).

---

## Semana 2 (dias 8–14): verticals fracos + consolidação

### Dia 8–9 · FSSC + SASSMAQ

11. GEO em **`certificacao-fssc-22000`**, **`fssc-22000-versao-7`**, **`o-que-e-sassmaq`** (hoje sem post-portas).
12. Cruzar prompts `fssc_22000` e `sassmaq` CSVs com URLs canônicas na planilha.

### Dia 10–11 · 14001 + aspectos

13. Reforçar **`iso-14001-2`**, **`como-identificar-aspecto-impacto-ambiental`** (prompts LAIA/aspectos).
14. Verificar cannibalização: um canonical por intent “certificação” vs “consultoria”.

### Dia 12 · Documentos + GRC (ponte 27001)

15. Artigo curto ou seção GEO: **GED vs requisito 7.5 ISO 9001** (não review de software; foco conformidade).
16. **`iso-27001`**: parágrafo GRC/compliance ligando Anexo A e SGSI (gap “GRC & Compliance” BR).

### Dia 13–14 · Medição

17. Reexportar Semrush AI Visibility (mesmos prompts).
18. GSC: filtros “certificação iso 27001”, “mapeamento processos”, “controle documentos”.
19. Atualizar planilha: `geo_repo`, `acao` → “monitorar”; registrar o que citou.

---

## Prioridades na planilha (como usar)

| Prioridade | Significado |
|------------|-------------|
| **P0** | Custo 27001, prompts certificação 27001/27701 relevância 90+ |
| **P1** | Gap Qualiex ferramentas/processos, mapeamento, auditoria 9001 |
| **P2** | Demais normas e consultoria |
| **P3/P4** | Backlog e ruído (ignorar Qualiex login) |

Colunas **`acao`**:

- `nova_pagina_quanto-custa-27001` · `upgrade_geo` · `geo_ferramentas_processos` · `geo_vs_qualiex` · `monitorar_citacao` · `ignorar_ruido`

---

## Métricas de sucesso (14 dias)

- **Citaciones / cited pages** Semrush: parar queda (−5% / −14%).
- **Novas URLs** citadas: quanto-custa-27001 + 3–5 páginas ferramentas com GEO.
- **GSC:** impressões com CTR > 0 em “quanto custa iso 27001” e “mapeamento de processos”.
- **Score 42:** expectativa realista em 14 dias é **movimento** (+5–10 pts) se P0+P1 forem publicados e llms.txt + off-site alinhados; 42 exige continuidade nas semanas 3–6.

---

## Comando para regerar a planilha

```powershell
cd C:\Users\Raquel\Projects\certificacaoiso---Blog-templum
node scripts/_build-audit-geo-semrush-master.mjs
```

Opcional: `$env:SEMRUSH_DIR="C:\Users\Raquel\Desktop\Marketing Templum\SemRush"`
