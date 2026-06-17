import { SYSTEM_PROMPT } from "./systemPrompt";

/**
 * 멀티 프로바이더 스트리밍 래퍼 (서버 전용).
 * 같은 시스템 프롬프트를 Gemini / Groq / Claude 어디에든 흘려보낸다.
 * 키는 모두 서버 환경변수에서만 읽는다.
 */
export type Provider = "gemini" | "groq" | "claude";

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export class MissingKeyError extends Error {
  constructor(public provider: Provider) {
    super(`${provider} API key missing`);
  }
}

const MAX_TOKENS = 1024;
const TEMPERATURE = 0.7;

// 무료 등급 모델 (필요 시 여기만 바꾸면 됨)
const GEMINI_MODEL = "gemini-2.5-flash";
const GROQ_MODEL = "qwen/qwen3-32b"; // 대안: llama-3.3-70b-versatile, moonshotai/kimi-k2-instruct
const CLAUDE_MODEL = "claude-sonnet-4-6";

export function hasKey(provider: Provider): boolean {
  if (provider === "gemini") return !!process.env.GEMINI_API_KEY;
  if (provider === "groq") return !!process.env.GROQ_API_KEY;
  if (provider === "claude") return !!process.env.ANTHROPIC_API_KEY;
  return false;
}

export async function streamLLM(
  provider: Provider,
  messages: LLMMessage[],
  onText: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (provider === "gemini") return streamGemini(messages, onText, signal);
  if (provider === "groq") return streamGroq(messages, onText, signal);
  if (provider === "claude") return streamClaude(messages, onText, signal);
  throw new Error(`unknown provider: ${provider}`);
}

/**
 * Qwen 등 추론 모델이 응답 앞에 붙이는 <think>...</think> 블록을 스트리밍 중 제거.
 * <think>는 항상 맨 앞에만 오므로, 닫힘 태그를 만나거나 think 블록이 아님이
 * 확실해질 때까지만 버퍼링하고 이후는 그대로 흘려보낸다.
 */
function createThinkStripper(onText: (c: string) => void) {
  let buffer = "";
  let passthrough = false;
  let started = false;
  // 첫 출력의 앞쪽 공백/빈 줄을 제거해 말풍선이 깔끔하게 시작되도록
  const out = (text: string) => {
    let t = text;
    if (!started) {
      t = t.replace(/^\s+/, "");
      if (t === "") return;
      started = true;
    }
    onText(t);
  };
  return {
    feed(chunk: string) {
      if (passthrough) {
        out(chunk);
        return;
      }
      buffer += chunk;
      const trimmed = buffer.replace(/^\s+/, "");
      if (trimmed === "") return; // 아직 공백뿐
      if (trimmed.startsWith("<think>")) {
        const end = buffer.indexOf("</think>");
        if (end !== -1) {
          const after = buffer.slice(end + "</think>".length);
          buffer = "";
          passthrough = true;
          if (after) out(after);
        }
        return; // 닫힘 태그 올 때까지 버퍼링
      }
      if ("<think>".startsWith(trimmed)) return; // 아직 <think>가 될 수 있음 → 대기
      // think 블록이 아님이 확실 → 통과 모드
      passthrough = true;
      out(buffer);
      buffer = "";
    },
    flush() {
      if (!passthrough && buffer) {
        out(buffer);
        buffer = "";
      }
    },
  };
}

/** 공통 SSE 라인 파서 */
async function readSSE(
  res: Response,
  onEvent: (json: unknown) => void,
): Promise<void> {
  if (!res.body) throw new Error("no response body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        onEvent(JSON.parse(data));
      } catch {
        /* 부분 청크 등 무시 */
      }
    }
  }
}

async function streamGemini(
  messages: LLMMessage[],
  onText: (c: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new MissingKeyError("gemini");

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: MAX_TOKENS,
          temperature: TEMPERATURE,
        },
      }),
      signal,
    },
  );
  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  await readSSE(res, (json) => {
    const parts = (
      json as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    )?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      for (const p of parts) if (p?.text) onText(p.text);
    }
  });
}

async function streamGroq(
  messages: LLMMessage[],
  onText: (c: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new MissingKeyError("groq");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      // Qwen3 추론(thinking) 토큰 노출 방지
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\n/no_think` },
        ...messages,
      ],
      stream: true,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const stripper = createThinkStripper(onText);
  await readSSE(res, (json) => {
    const delta = (
      json as { choices?: { delta?: { content?: string } }[] }
    )?.choices?.[0]?.delta?.content;
    if (delta) stripper.feed(delta);
  });
  stripper.flush();
}

async function streamClaude(
  messages: LLMMessage[],
  onText: (c: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new MissingKeyError("claude");

  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: key });
  const stream = client.messages.stream(
    {
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages,
    },
    { signal },
  );
  stream.on("text", (t) => onText(t));
  await stream.finalMessage();
}
