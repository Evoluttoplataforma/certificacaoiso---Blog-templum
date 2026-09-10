import { defineConfig } from 'astro/config';
import remarkOrbitLinks from './src/lib/remark-orbit-links.mjs';
import remarkInternalLinks from './src/lib/remark-internal-links.mjs';

// Blog Certificação ISO — certificacaoiso.com.br
// Estático (ótimo SEO/AIEO/GEO). URLs /<slug>/ idênticas ao WordPress antigo
// (permalink /%postname%/) → zero link quebrado. Sitemap pós-build.
export default defineConfig({
  site: 'https://certificacaoiso.com.br',
  // inlineStylesheets 'always': o CSS vai DENTRO do HTML, em vez de um <link> que
  // bloqueia a primeira pintura. Medido em 10/09/2026 (Lighthouse mobile, produção):
  // /_astro/_slug_.css era o ÚNICO recurso bloqueante da página — 8,6 KB transferidos
  // e 312 ms segurando o FCP. O padrão 'auto' só embute folhas abaixo de 4 KB, e as
  // nossas têm 28 e 34 KB.
  // O preço: o CSS deixa de ser um arquivo cacheado e reusado entre páginas, e passa a
  // repetir em cada HTML (~+8 KB gzip por página). Vale porque a sessão típica aqui vem
  // da busca orgânica e lê UMA página — o cache entre páginas beneficia quem navega, que
  // é a minoria. Se o comportamento mudar, voltar para 'auto' é uma linha.
  build: { format: 'directory', inlineStylesheets: 'always' },
  trailingSlash: 'always',
  markdown: {
    // 1) links internos absolutos → relativos (+ resolve órfãos); 2) linkbuilding orbitgestao.
    remarkPlugins: [remarkInternalLinks, remarkOrbitLinks],
  },
});
