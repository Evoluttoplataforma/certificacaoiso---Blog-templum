# CTR: linha de base antes de mexer nos títulos (21/08/2026)

Fonte: export do Search Console em `certificacaoiso.com.br-Performance-on-Search-2026-08-07`
(último dado: 05/08/2026). **Sem estes números não há como saber se a mudança de título
funcionou** — o GSC não faz teste A/B, então a única medição possível é antes × depois.

## A página que foi alterada

| | |
|---|---|
| URL | `/iso-9001/` |
| Cliques | 2.264 |
| Impressões | 296.838 |
| CTR | **0,76%** |
| Posição média | 5,1 |

## A consulta principal dessa página

| | |
|---|---|
| Consulta | `iso 9001` |
| Cliques | 1.489 |
| Impressões | 144.523 |
| CTR | **1,03%** |
| Posição média | 3,43 |

Outras consultas relevantes da mesma família:

| Consulta | Cliques | Impressões | CTR | Posição |
|---|---|---|---|---|
| iso9001 | 124 | 9.913 | 1,25% | 3,06 |
| o que é iso 9001 | 16 | 4.027 | 0,40% | 7,01 |
| o que e iso 9001 | 1 | 333 | 0,30% | 6,87 |

## O que mudou em 21/08/2026

| Campo | Antes | Depois |
|---|---|---|
| `seo_title` | ISO 9001: o que é, requisitos e como certificar | ISO 9001: o que é, requisitos, custo e prazo em 2026 |
| `seo_description` | ISO 9001: o que é, requisitos, quanto custa, quanto tempo leva e o que responder quando um cliente ou edital exige o certificado. Guia prático da Templum. | O que é, requisitos, quanto custa (a partir de R$ 2.000/mês) e quanto tempo leva — e o que responder quando um cliente ou edital exige o certificado. |

Raciocínio: o título antigo prometia exatamente o que SGS, TOTVS, FM2S e Bureau Veritas
prometem na mesma tela. **Custo e prazo é o que ninguém mais coloca** — e é o que a página
agora entrega de fato, com tabela de preço. O ano é frescor legítimo: a revisão
ISO 9001:2026 publica em setembro de 2026 e a página tem seção sobre ela.

O preço na descrição é escolha deliberada, alinhada ao objetivo de **lead qualificado e não
tráfego**: quem não tem orçamento se autoexclui antes do clique, e quem tem chega sabendo
que a empresa é transparente. Pode até reduzir clique bruto; deve aumentar clique útil.

## Como medir (28 dias)

1. Exportar de novo o Performance do Search Console em ~18/09/2026, mesmo intervalo de dias;
2. Comparar **CTR da consulta `iso 9001`** (linha de base: 1,03%) e **CTR da página
   `/iso-9001/`** (linha de base: 0,76%);
3. Olhar a **posição** junto: se a posição piorar, o CTR pode subir sem ganho de clique — e
   vice-versa. O número que decide é clique absoluto.

Expectativa honesta: 1,03% → algo entre 1,5% e 2,5%. Não prometo 3%: numa consulta como
"iso 9001" o resultado orgânico disputa a tela com anúncios, painel e resumo de IA, e boa
parte da impressão nunca teve clique disponível.

## O que NÃO é problema de título (e por isso não foi tocado)

Cuidado com a leitura do CTR agregado do site (0,6% a 0,7%). Olhe estas consultas:

| Consulta | Impressões | Posição | CTR |
|---|---|---|---|
| rd | 18.931 | **1,58** | 0,01% |
| checklist | 29.115 | 7,36 | 0,01% |
| implantação | 29.803 | 6,85 | 0,02% |
| 5w2h | 28.668 | 9,84 | 0,06% |
| fluxograma | 104.502 | 3,76 | 0,13% |

Posição 1,58 com 1 clique em 19 mil impressões é impossível numa busca normal. O padrão é
de impressão que aparece dentro de **"Perguntas frequentes"/"Outras pessoas perguntam"** e
de consultas genéricas em que a tela é ocupada por ferramenta, imagem e resumo de IA —
impressão contada, clique nunca disponível. São ~210 mil impressões produzindo 161 cliques.

Ou seja: **o CTR do site inteiro é em boa parte artefato de medição**, e persegui-lo no
agregado é perseguir fantasma. O que vale otimizar é o punhado de consultas em que o clique
existe de verdade: `iso 9001` (1,03%), `iso 14001` (1,1%), `iso 45001` (1,01%),
`housekeeping` (1,23%), `iso 17025` (0,91%).
