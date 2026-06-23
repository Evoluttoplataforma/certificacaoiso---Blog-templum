// Edge Function: rebuild
// Valida que quem chamou está logado → dispara o Deploy Hook da Cloudflare
// (URL = secret CLOUDFLARE_DEPLOY_HOOK_URL) pra o blog reconstruir lendo do Supabase.
// Deploy com "Verify JWT" DESLIGADO (validamos o usuário aqui dentro).
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const SUPA = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const auth = req.headers.get("Authorization") || "";
    // valida o usuário logado
    const u = await fetch(`${SUPA}/auth/v1/user`, { headers: { Authorization: auth, apikey: ANON } });
    if (!u.ok) return json({ error: "unauthorized" }, 401);

    const hook = Deno.env.get("CLOUDFLARE_DEPLOY_HOOK_URL");
    if (!hook) return json({ error: "CLOUDFLARE_DEPLOY_HOOK_URL não configurado" }, 500);
    const r = await fetch(hook, { method: "POST" });
    return json({ ok: r.ok });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
