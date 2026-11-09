
/**
 * Upstash Redis REST 클라이언트 (의존성 없이 fetch로 호출).
 * 환경변수: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *  (Vercel Marketplace 연동 시 생기는 KV_REST_API_URL / KV_REST_API_TOKEN 도 인식)
 */
const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const redisEnabled = Boolean(URL_ && TOKEN);

type Cmd = (string | number)[];

export async function pipeline(cmds: Cmd[]): Promise<unknown[]> {
  if (!redisEnabled || cmds.length === 0) return [];
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string }[];
  return data.map((d) => (d.error ? null : d.result));
}

/** 한국 시간 기준 날짜 문자열 (YYYY-MM-DD) */
export function kstDate(offsetDays = 0, base = Date.now()): string {
  const d = new Date(base + 9 * 3600_000 - offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const dayKey = (date: string) => `kimkw:stats:${date}`;
export const uvKey = (date: string) => `kimkw:uv:${date}`;
export const TTL_SECONDS = 60 * 60 * 24 * 400; // 약 13개월 보관
