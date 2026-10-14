# Planilha de monitoramento GEO/SERP · certificacaoiso.com.br

## Como criar o Google Sheet (5 abas)

1. Abra [Google Sheets](https://sheets.google.com) → **Planilha em branco**.
2. Nome sugerido: `Monitor GEO SERP certificacaoiso · out-nov 2026`.
3. Para cada arquivo CSV desta pasta:
   - **Arquivo → Importar → Upload** do CSV **ou** copie/cole na aba.
   - Renomeie a aba conforme o nome abaixo.
4. Ordem das abas:
   - `1-resumo-checkpoints.csv` → aba **Resumo**
   - `2-urls-p0.csv` → aba **URLs P0**
   - `3-queries-p0.csv` → aba **Queries P0**
   - `4-prompts-ia-lista.csv` → aba **Prompts IA (lista)**
   - `5-log-ia-por-foto.csv` → aba **Log IA**

## Rotina em cada foto (0, 3, 5, 7, 10, 15, 20)

**Search Console** (mesma propriedade, filtro Brasil se usarem):

- Período A: últimos **7 dias** (comparar com período B: **7 dias anteriores**).
- Anotar cliques, impressões, CTR, posição média no **Resumo**.
- Em **URLs P0** e **Queries P0**: preencher colunas da data da foto (cliques 7d, impressões 7d, posição média 7d).

**IA (30 prompts):**

- Rodar cada prompt da aba **Prompts IA** em Google AI Overview, ChatGPT e/ou Perplexity (registrar qual LLM).
- Preencher **Log IA**: data_foto, prompt, llm, mencao_certificacaoiso (sim/não), url_citada, concorrente_citado, notas.

**Deploy / conteúdo:**

- Na coluna `acao_publicada_desde_foto_anterior` do **Resumo**, anotar o que entrou (ex.: patch hub 9001, DEO fluxograma).

## Datas do plano

| Dia | Data |
|-----|------|
| 0 | 2026-10-13 |
| 3 | 2026-10-16 |
| 5 | 2026-10-18 |
| 7 | 2026-10-20 |
| 10 | 2026-10-23 |
| 15 | 2026-10-28 |
| 20 | 2026-11-02 |

Baseline GSC: export **12/jul–11/out/2026** (arquivo Performance-on-Search 13/out).
