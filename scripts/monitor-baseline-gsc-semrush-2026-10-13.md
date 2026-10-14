# Baseline + monitoramento (20 dias) · certificacaoiso.com.br

**Foto “antes” (GSC export 13/out/2026):** período **12/jul–11/out/2026** (91 dias).  
**Semrush IA:** prompts por tópico (PDCA, Pareto, fluxograma, fornecedores, política da qualidade, lista mestra) + sources/gap **Blog da Qualidade** (benchmark, não é gap do nosso domínio).

---

## Baseline GSC (site todo)

| Métrica | Valor |
|---------|--------|
| Cliques totais | 11.773 |
| Impressões totais | 1.378.621 |
| Posição média (série diária) | ~7–8 |
| Últimos 14d vs 14d anteriores | 2.371 vs 2.466 cliques (−4%); impressões ↑ |
| Desktop / mobile | 7.946 / 3.721 cliques |

**Nota:** semana 12/jul mostra só 40 cliques (provável início parcial do export). Comparar sempre **mesma janela de datas** nos checkpoints.

---

## Baseline · 15 URLs P0 (cliques 90d · impressões · pos.)

| URL | Cliques | Impressões | Pos. |
|-----|---------|------------|------|
| /iso-9001/ | 1.610 | 141.730 | 4,9 |
| /iso-14001-2/ | 992 | 77.023 | 4,67 |
| /iso-45001/ | 905 | 50.644 | 3,57 |
| /passo-a-passo-certificacao-iso-9001/ | 208 | 13.745 | 11,44 |
| /quanto-custa-iso-9001/ | 151 | 9.603 | 7,34 |
| /o-que-e-fluxograma-de-processos/ | 225 | 44.411 | 7,69 |
| /5s/ | 252 | 86.258 | 7,92 |
| /o-que-e-nao-conformidade/ | 150 | 41.056 | 5,16 |
| /as-sete-ferramentas-da-qualidade/ | 132 | 24.121 | 6,68 |
| /mapeamento-de-processos-e-a-iso-9001/ | 6 | 681 | 7,84 |
| /qualificacao-de-fornecedores-iso-9001-2026-requisito-8-4/ | 75 | 4.153 | 7,28 |
| /o-que-e-o-ciclo-pdca/ | 5 | 2.257 | 12,13 |
| /transicao-iso-9001-2026-prazos-cronograma-global-aci/ | **0** (fora top 1000) | — | — |

---

## Baseline · consultas P0 (90d)

| Consulta | Cliques | Impressões | Pos. |
|----------|---------|------------|------|
| certificação iso 9001 | 19 | 2.188 | 10,62 |
| certificação iso 9001 quanto custa | 9 | 558 | 7,57 |
| certificação iso | 6 | 1.227 | 12,66 |
| fluxograma de processo | 8 | 3.742 | 8,57 |
| fluxograma | 13 | 3.275 | 11,22 |
| 5s | 102 | 43.369 | 8,40 |
| 5w2h | 5 | 9.632 | 10,39 |
| qualificação de fornecedores | 3 | 206 | 14,29 |
| pdca (query exata) | 0 | 181 | 44,39 |

---

## Baseline · IA (Semrush prompts, amostra)

**Benchmark BDQ (sources):** fluxograma 43 prompts, PDCA 31, Ishikawa 34, 7 ferramentas 19, Pareto 12.  
**Nosso GSC:** fluxograma já traciona; PDCA quase invisível (pos. 44).

**Tópicos Semrush anexados:** relevance ~92–95. Respostas IA citam **ferramentas** (Miro, Draw.io) ou genéricos, não certificacaoiso.com.br.  
**Ação GEO:** páginas operacionais com Answer First + passo a passo + ligação ISO 9001 (não competir com “melhor software de fluxograma”).

---

## Checkpoints (mesma planilha Google Sheets)

Colunas fixas por data: `data_foto | cliques_7d | impressoes_7d | pos_media_7d | [cada URL P0 cliques_7d] | [cada query P0 cliques_7d pos] | ia_mencao_sim/30 | ia_citacao_url_sim/30`

| Dia | Data alvo | Foco da leitura |
|-----|-----------|-----------------|
| **0** | 13/out | Baseline (este arquivo + export GSC completo) |
| **3** | 16/out | Indexação pilar transição 2026; deploy/build ok |
| **5** | 18/out | Cannibalização 9001 (hub vs passo a passo) início |
| **7** | 20/out | CTR 5s / fluxograma / 7 ferramentas (title + snippet) |
| **10** | 23/out | Queries “certificação iso *”; posição passo a passo + custo |
| **15** | 28/out | Cluster operacional DEO (mapeamento, fornecedor, PDCA) |
| **20** | 02/nov | Decisão: escalar lote 2 ou corrigir rota |

**GSC:** usar comparação **últimos 7 dias** vs **7 dias anteriores** (lag ~2–3 dias).  
**IA:** rerodar **30 prompts** fixos (10 certificação, 10 ferramentas, 10 fornecedor/processos).

---

## Plano de conteúdo · ajustes pós-dados

1. **P0 inalterado:** desarmar hub `/iso-9001/` na intent certificação; empurrar `/passo-a-passo/` e `/quanto-custa/`.
2. **Subir prioridade CTR:** `/5s/`, `/o-que-e-fluxograma-de-processos/`, `/as-sete-ferramentas-da-qualidade/` (impressão alta, CTR &lt; 1%).
3. **GEO operacional:** consolidar PDCA (hoje `/o-que-e-o-ciclo-pdca/` pos. 44) vs cluster 7 ferramentas; não criar 5 URLs PDCA.
4. **Fornecedores:** DEO em qualificação + `/controle-de-fornecedores...8-4/` (Semrush fornecedores relevance 94).
5. **Política da qualidade / lista mestra:** GSC mostra volume modesto; patch DEO em URLs existentes (`iso-9001-requisitos-5-2-politica`, controle documentos), não pillar novo na semana 1.
6. **Monitorar redirect:** `/iso-14001-2/` ainda #2 em cliques no export; confirmar 301 para `/iso-14001/` nos checkpoints.
7. **Transição 2026:** URL nova; meta dia 10: entrar no GSC com impressões; meta dia 20: citacao em ≥1 prompt “prazo transição ISO 9001 2026”.

---

## 30 prompts IA fixos (copiar para planilha)

**Certificação (10):** certificação iso 9001 prazo; quanto custa certificação iso 9001; passos certificação iso 9001; transição iso 9001 2026 prazos; certificação iso 27001 etapas; certificação iso 45001; o que é certificação iso; gap analysis iso 9001; auditoria interna iso 9001; organismo certificador iso 9001 brasil.

**Ferramentas (10):** ciclo pdca o que é; diagrama de pareto; diagrama ishikawa; sete ferramentas da qualidade; fluxograma de processo; 5 porquês causa raiz; 5w2h; 5s na empresa; FMEA o que é; melhoria contínua pdca.

**Operação ISO (10):** gestão de fornecedores iso 9001; qualificação de fornecedores; política da qualidade exemplo; lista mestra de documentos iso 9001; mapeamento de processos iso 9001; não conformidade iso 9001; controle de documentos iso 9001; requisito 8.4 iso 9001; revisão pela direção iso 9001; matriz de riscos e oportunidades iso 9001.

Registrar: LLM | menção Templum/certificacaoiso | URL citada | concorrente citado.
