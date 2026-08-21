# As perguntas que os leitores fizeram (2010–2018)

Mineração dos **2.524 comentários aprovados** do blog, feita em 21/08/2026 — o dia em que
os comentários saíram das páginas. Eles continuam no banco (`blog_templum_comments`)
porque não são lixo: são oito anos de dúvida real de gente que chegou pelo Google
procurando ISO. Este arquivo é o que sobrou de útil daquilo, e serve de fila de conteúdo.

## Como o corte foi feito

- 2.524 comentários aprovados, todos entre 2010 e **06/07/2018** (o último). Zero em 2019–2026.
- Fora os autores da casa (Daniela Albuquerque, Guilherme Alonço, Igor Furniel, Thais
  Cargnelutti, admin), que **respondem** e não perguntam: sobram **1.719 de leitor**.
- Desses, **824 contêm pergunta** (têm "?").

## Temas, por volume de perguntas

| Tema | Perguntas |
|---|---|
| Auditoria (interna e externa) | 103 |
| Documentos obrigatórios | 98 |
| Curso / carreira / formação | 89 |
| Quem pode certificar (porte e ramo) | 66 |
| Planilha / modelo / template | 52 |
| Preço e custo | 46 |
| Certificadora / onde certificar | 35 |
| Não conformidade / ação corretiva | 35 |
| Treinamento e conscientização | 32 |
| Validade / manutenção / recertificação | 30 |
| Prazo e tempo | 21 |
| Indicadores e metas | 20 |
| Como começar / passo a passo | 11 |

E, por expressão exata: **"é obrigatório/obrigatória" aparece 101 vezes** (43 delas sobre
ISO/SGQ) — é, de longe, a dúvida número um. Depois: parceria/consultoria como carreira
(25), MEI e microempresa (17), sistema integrado (16), manual da qualidade (13),
"consigo fazer sozinho" (9), escopo do auditor (7).

## O que já virou FAQ do /iso-9001/ (21/08/2026)

1. A ISO 9001 é obrigatória por lei? — *o campeão: 43 perguntas*
2. Preciso de um procedimento para cada setor? E o manual da qualidade? — *98 + 13*
3. Existe número mínimo de funcionários? Prestadores sem carteira contam? — *66*
4. E se a empresa não passar na auditoria de certificação? — *ansiedade comercial recorrente*
5. O auditor da ISO 9001 pode cobrar licença ambiental ou item de segurança? — *7*

## Fila: perguntas boas que ainda não têm dono

Cada uma é uma pergunta real, repetida, e nenhuma está bem respondida hoje:

- **"Preciso da ISO 9001 para implantar a 14001?"** → post de SGI / integração de normas.
- **"Dá para auditar duas normas na mesma auditoria? Sai mais barato?"** → 16 perguntas.
- **"Sou MEI / tenho uma microempresa. Faz sentido?"** → 17 perguntas, e hoje o blog não
  responde em nenhum lugar.
- **"Quero trabalhar como consultor de ISO. Como faço?"** → 25 perguntas. Não é FAQ de
  comprador: é sinal de demanda por programa de parceria/licenciamento. Decisão comercial,
  não de conteúdo.
- **"Onde consigo modelo/planilha de [documento]?"** → 52 perguntas. Era o que as iscas
  `/presentes/` atendiam até 19/08/2026.
- **"Quais treinamentos a norma exige, e quem pode dar?"** → 32 perguntas.
- **"Como faço a renovação? Que documentos preciso ter em mãos?"** → recorrente no tema de
  validade, e o post de recertificação não responde direito.

## Como reproduzir

Os comentários seguem no banco. Para refazer a mineração com outro corte:

```sql
select c.created_at::date, p.slug, c.author_name, c.content
from blog_templum_comments c join blog_templum_posts p on p.id = c.post_id
where c.status = 'approved'
  and c.author_name not in ('Daniela Albuquerque','Guilherme Alonço','Igor Furniel','Thais Cargnelutti','admin')
  and c.content like '%?%'
order by c.created_at desc;
```
