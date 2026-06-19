import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 서버 전용 클라이언트 (service_role — RLS 우회, 절대 클라이언트 번들에 포함 금지)
export const supabase = createClient(url, key);

export type ConversationRow = {
  id: string;
  session_id: string;
  messages: { role: "user" | "assistant"; content: string }[];
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};
