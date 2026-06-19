export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface StreamOptions {
  provider?: string; // "gemini" | "groq" | "claude" (생략 시 서버 기본값)
  signal?: AbortSignal;
  sessionId?: string;
}

/**
 * /api/chat 로 대화 기록을 보내고, 응답 텍스트를 청크 단위로 콜백한다.
 * @param onDelta 새로 도착한 텍스트 조각마다 호출
 */
export async function streamChat(
  messages: ChatMessage[],
  onDelta: (chunk: string) => void,
  opts: StreamOptions = {},
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, provider: opts.provider, sessionId: opts.sessionId }),
    signal: opts.signal,
  });

  if (!res.ok) {
    let msg = "잠시 문제가 생겼어요. 조금 뒤 다시 시도해 주세요.";
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  if (!res.body) throw new Error("응답을 받지 못했습니다.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onDelta(decoder.decode(value, { stream: true }));
  }
}
