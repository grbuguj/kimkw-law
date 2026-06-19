import {
  streamLLM,
  hasKey,
  MissingKeyError,
  type Provider,
  type LLMMessage,
} from "@/lib/llm";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const VALID_PROVIDERS: Provider[] = ["gemini", "groq", "claude"];
const DEFAULT_PROVIDER: Provider = "groq";

function sanitize(messages: unknown): LLMMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is LLMMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}

async function saveConversation(
  sessionId: string,
  messages: LLMMessage[],
  assistantReply: string,
  ip: string | null,
  userAgent: string | null,
) {
  const full = [
    ...messages,
    { role: "assistant" as const, content: assistantReply },
  ];
  try {
    const { error } = await supabase.from("conversations").upsert(
      { session_id: sessionId, messages: full, ip, user_agent: userAgent },
      { onConflict: "session_id" },
    );
    if (error) {
      // UNIQUE 제약조건 없으면 insert로 폴백
      await supabase.from("conversations").insert({
        session_id: sessionId,
        messages: full,
        ip,
        user_agent: userAgent,
      });
    }
  } catch (e) {
    console.error("[saveConversation] failed:", e);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const raw = body as {
    messages?: unknown;
    provider?: unknown;
    sessionId?: unknown;
  };
  const provider: Provider = VALID_PROVIDERS.includes(raw?.provider as Provider)
    ? (raw.provider as Provider)
    : DEFAULT_PROVIDER;

  const messages = sanitize(raw?.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "메시지가 비어 있습니다." }, { status: 400 });
  }

  const sessionId =
    typeof raw?.sessionId === "string" && raw.sessionId.length > 0
      ? raw.sessionId
      : crypto.randomUUID();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  if (!hasKey(provider)) {
    return Response.json(
      {
        error: `상담 도우미(${provider})가 아직 설정되지 않았습니다. 키를 .env.local 에 넣어주세요.`,
        provider,
      },
      { status: 503 },
    );
  }

  const encoder = new TextEncoder();
  let assistantReply = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await streamLLM(provider, messages, (text) => {
          assistantReply += text;
          controller.enqueue(encoder.encode(text));
        });
        controller.close();
        // 스트리밍 완료 후 비동기 저장 (응답 지연 없음)
        void saveConversation(sessionId, messages, assistantReply, ip, userAgent);
      } catch (err) {
        console.error(`[/api/chat] ${provider} stream error:`, err);
        const note =
          err instanceof MissingKeyError
            ? `\n\n(${provider} 키가 설정되지 않았어요.)`
            : "\n\n죄송합니다. 잠시 문제가 생겼어요. 조금 뒤 다시 시도하시거나, 편하게 전화로 문의해 주세요.";
        controller.enqueue(encoder.encode(note));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
