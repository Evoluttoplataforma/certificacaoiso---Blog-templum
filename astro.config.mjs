import { defineConfig } from 'astro/config';
import remarkOrbitLinks from './src/lib/remark-orbit-links.mjs';
import remarkInternalLinks from './src/lib/remark-internal-links.mjs';

// Blog Certificação ISO — certificacaoiso.com.br
// Estático (ótimo SEO/AIEO/GEO). URLs /<slug>/ idênticas ao WordPress antigo
// (permalink /%postname%/) → zero link quebrado. Sitemap pós-build.
export default defineConfig({
  site: 'https://certificacaoiso.com.br',
  build: { format: 'directory' },
  trailingSlash: 'always',
  markdown: {
    // 1) links internos absolutos → relativos (+ resolve órfãos); 2) linkbuilding orbitgestao.
    remarkPlugins: [remarkInternalLinks, remarkOrbitLinks],
  },
});
