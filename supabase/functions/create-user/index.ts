// Edge Function: create-user
// Valida que quem chamou está logado → cria o colaborador no Auth (Admin API,
// service_role) JÁ COM SENHA e e-mail confirmado (sem depender de SMTP/convite),
// e grava em blog_templum_members. Deploy com "Verify JWT" DESLIGADO.
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
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const auth = req.headers.get("Authorization") || "";

    // só usuário logado pode criar
    const me = await fetch(`${SUPA}/auth/v1/user`, { headers: { Authorization: auth, apikey: ANON } });
    if (!me.ok) return json({ error: "unauthorized" }, 401);

    const { email, password, full_name, role } = await req.json();
    if (!email || !password) return json({ error: "email e senha são obrigatórios" }, 400);
    if (String(password).length < 6) return json({ error: "senha mínima de 6 caracteres" }, 400);

    // cria o usuário direto (com senha, e-mail já confirmado)
    const adm = await fetch(`${SUPA}/auth/v1/admin/users`, {
      method: "POST",
      headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name: full_name || null } }),
    });
    const u = await adm.json();
    if (!adm.ok) return json({ error: u.msg || u.message || u.error_description || "erro ao criar usuário" }, 400);

    // grava o perfil/colaborador
    await fetch(`${SUPA}/rest/v1/blog_templum_members`, {
      method: "POST",
      headers: {
        apikey: SERVICE, Authorization: `Bearer ${SERVICE}`,
        "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ user_id: u.id, email, full_name: full_name || null, role: role || "editor" }),
    });

    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
