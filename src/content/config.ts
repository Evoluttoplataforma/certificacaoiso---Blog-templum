import { defineCollection, z } from 'astro:content';

// Coleção de artigos do blog. O CMS Git-based edita esses .md.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(''),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional().default('Equipe Templum'),
    categories: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    wpId: z.number().optional(), // rastreio da migração (id antigo do WordPress)
    // --- SEO/AIEO/GEO (opcionais; preenchidos pelo CMS nos posts novos) ---
    seoTitle: z.string().optional(),        // <title> custom (senão usa title)
    seoDescription: z.string().optional(),  // meta description custom
    ogImage: z.string().optional(),         // imagem social custom (senão heroImage)
    tldr: z.string().optional(),            // "Resposta rápida" citável (answer-first)
    keywords: z.array(z.string()).default([]),
    faq: z.array(z.object({ pergunta: z.string(), resposta: z.string() })).default([]),
  }),
});

export const collections = { blog };
