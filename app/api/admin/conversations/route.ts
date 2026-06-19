import { supabase, type ConversationRow } from "@/lib/supabase";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function checkAuth(req: NextRequest) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const auth = req.headers.get("x-admin-password");
  return auth === pw;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single<ConversationRow>();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("id, session_id, messages, ip, created_at")
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<ConversationRow[]>();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
