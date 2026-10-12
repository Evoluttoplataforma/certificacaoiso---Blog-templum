# Referência DEO/GEO · engenharia de conteúdo (RAG)

Fonte: estratégia Q&A + Answer First + Semrush (prompts IA) + arquitetura do blog Templum.

## O que a IA faz (RAG)

- Não lê o artigo inteiro: busca **chunks** com similaridade à pergunta.
- Chunk ideal: **pergunta (H2/H3)** + **primeira frase = resposta** + suporte (lista/tabela).

## Regra Answer First

1. Primeiro `<p>` ou primeiro item de lista após o heading = resposta completa em linguagem direta.
2. Sem introdução longa antes da resposta (jornalismo invertido para máquina).
3. Verbos de ação: certificar, implantar, contratar organismo, calcular custo.

## FAQ híbrido (obrigatório em pillars P0/P1)

| Camada | Onde | Função |
|--------|------|--------|
| **Bloco topo** | `#respostas-diretas` (ul/li) | Chunks RAG rápidos; espelha prompts Semrush |
| **FAQ distribuído** | A cada 2–3 seções profundas: `h3` = pergunta natural + 1–2 parágrafos Answer First | Micro-respostas; aumenta superfície de prompts |
| **FAQ CMS** | Campo `faq` no Supabase | **FAQPage** JSON-LD no build (`[slug].astro`) + sanfoninha Google |

Perguntas do FAQ CMS devem **repetir** (ou ser subset de) perguntas já respondidas no corpo, com a mesma resposta factual (evitar contradição).

## Headings = prompts

- Evitar: `Processos`, `Documentação`, `Certificação`.
- Preferir: `Como obter a certificação ISO 9001 no Brasil?`, `Quanto custa a certificação ISO 9001?`.
- H3 para objeções: `Preciso de consultoria para certificar?`, `A certificação substitui licença ambiental?`

## Estruturas que LLM copia

- Passos → `<ol>` ou `<ul>` curtos (máx. 7–9 itens visíveis).
- Comparações → `<table>` HTML simples (sem layout em div).
- Consultoria x organismo → tabela 2 colunas quando couber.

## O que o blog já faz (manter)

- `FAQPage` automático quando `faq` no CMS.
- `Article` + `BreadcrumbList` + `Organization` no post.
- `public/llms.txt` / `llms-full.txt` (mapa para crawlers de IA).
- `#respostas-diretas` nos hubs/pillars GEO recentes.
- `post-portas` (navegação por intent).

## Gaps a fechar (prioridade)

1. **FAQ distribuído** em artigos legados longos (só FAQ no rodapé).
2. **Plain text no schema:** respostas FAQ no JSON-LD hoje podem levar HTML; preferir texto limpo no campo `faq` (links ok, sem blocos longos).
3. **H2 genéricos** em posts antigos: rebatizar em lote por cluster (planilha GEO).
4. **Pillar vs hub:** conteúdo de certificação só no pillar; hub linka (Trilha A SERP).

## Prompts Semrush

Usar `audit-geo-semrush-trabalho.csv`: coluna `prompt` = candidato a H3 ou item em `#respostas-diretas`.

## Lighthouse (home mobile)

- **SEO 100** no Lighthouse: base técnica ok.
- Performance ~67 com extensões (Ubersuggest etc.): medir de novo em **aba anônima**.
- Ganhos reais do site: cadeia **Google Fonts** (Roboto Mono + Montserrat), thumbs de **categoria** 800px servidas ~468px (~80 KiB). Não bloqueia GEO; ajuda crawl/usuário.

## Benchmark concorrente (uso interno)

- **Bureau Veritas (Positions BR):** uma landing comercial rankeia pos. **5–15** em dezenas de variantes `certificação iso 9001` (autoridade de certificadora + URL `/certificacoes/.../iso-9001`).
- **Nós:** blog educativo; competir com **profundidade + Q&A + E-E-A-T** (consultoria x organismo), não imitar página de venda de certificado.
- **Blog da Qualidade (completeLinks.csv):** menu focado em software (documentos, NC, auditorias, processos). Nosso cluster operacional (mapeamento, 7.5, 5W2H) cobre o mesmo território informacional **sem** review de SaaS.

## Schema (blogdaqualidade export)

Home deles: `WebPage` + `Organization` + `SearchAction`; **sem FAQPage na home**. Nossos **posts com FAQ** estão mais alinhados ao GEO do vídeo do que a home de portal genérico.
