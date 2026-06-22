# Arquitetura — Blog certificacaoiso.com.br

Modelo replicado do Evolutto: **Supabase = fonte de verdade**, blog lê no build,
CMS escreve client-side, publicação dispara rebuild.

## Visão geral

```
┌─────────────────────────┐         ┌─────────────────────────┐
│ BLOG (público)          │         │ CMS (painel, login)     │
│ certificacaoiso.com.br  │         │ (domínio próprio)       │
│ Astro estático          │         │ Astro + supabase-js     │
│ repo: ...---Blog-templum│         │ repo: separado          │
└───────────┬─────────────┘         └───────────┬─────────────┘
            │ LÊ no build                         │ ESCREVE no navegador
            └──────────────────┬──────────────────┘
                               ▼
                   ┌───────────────────────┐
                   │ SUPABASE (compartilhado)│
                   │ projeto "Templum Consult"│
                   │ tnpzoklepkvktbqouctf     │
                   └───────────────────────┘
```

## Mapeamento p/ a Templum

- **org_id da Templum:** `d7a3cbaa-6f5c-4f21-9326-03d9c30a6c7b`
- **Tabelas existentes (multi-tenant, já criadas):** `blog_posts`, `blog_categories`, `blog_settings`, `org_sites`, `seo_*`.
- O blog filtra **sempre** por esse org_id.

## Fluxo de publicação

```
CMS "Publicar" → grava em blog_posts (status=published)
   → Edge Function "rebuild" → Deploy Hook da Cloudflare
   → blog reconstrói lendo do Supabase → no ar em ~2 min
```

## Mapa: markdown atual → blog_posts

| Frontmatter (.md)     | Coluna blog_posts          |
|-----------------------|----------------------------|
| title                 | title                      |
| slug                  | slug                       |
| body (markdown)       | content                    |
| description           | excerpt                    |
| heroImage             | featured_image             |
| author                | author_name                |
| categories[0]         | category_id (FK)           |
| categories[1..]       | tags[]                     |
| pubDate               | published_at               |
| updatedDate           | updated_at                 |
| draft:false           | status = 'published'       |
| seoTitle              | seo_title                  |
| seoDescription        | seo_description            |
| keywords[]            | seo_keywords[]             |
| ogImage               | og_image                   |
| wordCount             | reading_time_min (derivado)|
| **tldr**              | ⚠️ SEM coluna (decidir)     |
| **faq**               | ⚠️ SEM coluna (decidir)     |

## Decisões abertas

1. **Pivot:** converter o blog markdown (1.015 posts, já pronto/SEO/acessível) →
   Supabase. As páginas/SEO/sidebar continuam idênticas — muda só a fonte de dados
   (getCollection → fetch Supabase no build). Markdown vira seed de importação.
2. **tldr/faq:** adicionar 2 colunas nullable em `blog_posts` (`tldr text`, `faq jsonb`)
   — aditivo e seguro, mas é tabela COMPARTILHADA (afeta todas as orgs). Alternativa:
   tldr→excerpt e faq depois.
3. **CMS:** é o painel do Orbit/Evolutto já existente (multi-tenant) ou um repo
   novo de CMS só do certificacaoiso?
4. **Imagens:** as 1.258 webp (193 MB) vão pro R2 (servidas em /wp-content) — featured_image
   e imagens do content apontam pra lá.
5. **Rebuild:** Edge Function "rebuild" + Deploy Hook da Cloudflare (criar).

## Segurança (pendência do projeto)

5 tabelas com RLS DESLIGADO (expostas à anon key): `conversions`,
`orbit_gestao_events`, `orbit_gestao_conversions`, `orbit_gestao_lead_journey`,
`ligacao-orbit`. Corrigir com `ENABLE ROW LEVEL SECURITY` **+ políticas**.
