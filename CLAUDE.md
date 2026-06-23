# CLAUDE.md — repositório do BLOG (certificacaoiso.com.br)

> Leia `ARQUITETURA.md` (neste repo) para o sistema completo (site · blog · cms · Supabase).

## Este repositório
- **App:** Blog Certificação ISO — **`certificacaoiso.com.br`** (1.015 posts + iscas `/presentes/<slug>`)
- **Stack:** Astro estático que **lê o Supabase no BUILD** · Worker Cloudflare **`certificacaoiso-blog`**
- **Remote:** `github.com/Evoluttoplataforma/certificacaoiso---Blog-templum`
- **Dev:** `npm run dev` · **Build:** `npm run build` · **Preview:** `npm run preview`
- **Importante:** o `worker.js` faz **proxy de `/acesso*` → Worker do CMS**. Não quebre isso.

## ⚠️ Git & Deploy — regras (NÃO DAR ZIKA)
- Este repo publica **só o blog**. Mudou site/cms? É **outro repositório** — não commite aqui.
- **`git push origin main` = DEPLOY EM PRODUÇÃO** (Workers Builds). Só pushe pra publicar.
- **Antes de pushar:** `git status` + **`npm run build`** (o build lê o Supabase; se quebra, deploy quebra).
- Só commite/pushe quando o usuário pedir.
- **Nunca commitar:** `.env`, secrets, `service_role`, `node_modules`, `dist`,
  e principalmente o export do WordPress (`../blog-certificacaoiso/*.WordPress*.xml`, ~58MB) — fica fora do repo.
- Commit de IA termina com: `Co-Authored-By: Claude <noreply@anthropic.com>`
- Push rejeitado? → `git pull --rebase origin main` e push de novo.

## Dados (Supabase) — NÃO vai por git
- O conteúdo (posts/iscas/comentários) está no **Supabase** (`blog_templum_*`).
- `src/lib/posts.js` lê tudo no build. Mudança de schema/dados = **SQL no Supabase**
  (os `supabase/*.sql` são referência) ou Edge Function. Scripts de import rodam com
  `SUPABASE_SERVICE_KEY=... node supabase/<script>.mjs` (service_role via env, nunca no git).
- Publicar do CMS chama a Edge Function `blog-templum-rebuild` → rebuild deste blog.
