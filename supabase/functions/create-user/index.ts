// Edge Function: create-user
// Valida que quem chamou está logado → cria o colaborador no Auth (Admin API,
// service_role) e a linha em blog_templum_members. Envia convite por e-mail.
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
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const auth = req.headers.get("Authorization") || "";

    // só usuário logado pode convidar
    const me = await fetch(`${SUPA}/auth/v1/user`, { headers: { Authorization: auth, apikey: ANON } });
    if (!me.ok) return json({ error: "unauthorized" }, 401);

    const { email, full_name, role } = await req.json();
    if (!email) return json({ error: "email obrigatório" }, 400);

    // convida (cria o usuário no Auth + envia e-mail p/ definir senha)
    const inv = await fetch(`${SUPA}/auth/v1/invite`, {
      method: "POST",
      headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const invData = await inv.json();
    if (!inv.ok) return json({ error: invData.msg || invData.error_description || "erro ao criar usuário" }, 400);
    const userId = invData.id || invData.user?.id;

    // cria o perfil/colaborador
    await fetch(`${SUPA}/rest/v1/blog_templum_members`, {
      method: "POST",
      headers: {
        apikey: SERVICE, Authorization: `Bearer ${SERVICE}`,
        "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ user_id: userId, email, full_name: full_name || null, role: role || "editor" }),
    });

    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
