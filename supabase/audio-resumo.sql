-- ============================================================================
-- Resumo em áudio dos artigos — colunas + bucket de storage
-- Rodar no SQL Editor do Supabase. Idempotente (IF NOT EXISTS / ON CONFLICT).
--
-- Por que colunas em blog_templum_posts e não uma tabela nova: src/lib/posts.js lê
-- `select=*` dos posts publicados no build. Coluna nova chega de graça na página, sem
-- uma segunda requisição ao Supabase — e o build INTEIRO depende dessas requisições
-- (ver o comentário do retry em posts.js). Uma tabela 1:1 custaria um round-trip a mais
-- em cada build para guardar cinco campos.
--
-- Tudo nullable: post sem áudio é o caso normal (1.015 posts, 20 com áudio na 1ª leva).
-- ============================================================================

alter table public.blog_templum_posts
  -- Roteiro narrado. NÃO é o artigo inteiro: é o resumo de ~90s que o leitor ouve.
  -- Fica no banco (e não só no MP3) por três motivos: é editável no CMS, é auditável
  -- (dá para ler o que a voz diz sem baixar áudio), e é a fonte do hash de idempotência.
  add column if not exists audio_script      text,
  -- URL pública no bucket blog-audio. O MP3 NÃO vai por git: 20 arquivos já são ~30MB,
  -- e os 1.015 seriam ~2GB — o repo publica só o blog (ver CLAUDE.md).
  add column if not exists audio_url         text,
  add column if not exists audio_duration_s  integer,
  add column if not exists audio_voice       text,
  add column if not exists audio_model       text,
  add column if not exists audio_generated_at timestamptz,
  -- sha256 do roteiro que gerou ESTE mp3. Sem ele, rodar o script de novo regrava os 20
  -- áudios e queima 40k créditos do ElevenLabs para produzir arquivos idênticos.
  add column if not exists audio_script_hash text;

-- Só os posts que têm áudio — o índice parcial fica minúsculo (20 linhas, não 1.015).
create index if not exists blog_templum_posts_audio_idx
  on public.blog_templum_posts (slug) where audio_url is not null;

-- ---------------------------------------------------------------------------
-- Bucket público de áudio. Público na LEITURA (o <audio> do navegador não manda
-- header de auth); a escrita é só service_role, que ignora RLS.
-- 6MB de teto por arquivo: um resumo de 90s em MP3 128kbps mono dá ~1,4MB. O teto
-- existe para um roteiro acidentalmente gigante estourar no upload em vez de virar
-- um arquivo de 40MB que ninguém baixa no 4G.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-audio', 'blog-audio', true, 6291456, array['audio/mpeg'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
