import {
  EVENT_TYPES,
  LOCATIONS,
  SOURCES,
  TOPICS,
  type TrackPayload,
} from "@/lib/analytics/events";
import {
  dayKey,
  kstDate,
  pipeline,
  redisEnabled,
  TTL_SECONDS,
  uvKey,
} from "@/lib/analytics/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|vercel/i;

function pick<T extends readonly string[]>(list: T, v: unknown): T[number] | undefined {
  return typeof v === "string" && (list as readonly string[]).includes(v)
    ? (v as T[number])
    : undefined;
}

/**
 * 익명 이벤트 수집. 하루 단위 해시에 카운터만 올린다.
 *   kimkw:stats:YYYY-MM-DD  → { "ev:chat_start": 3, "topic:rehab": 2, "src:naver": 5, ... }
 *   kimkw:uv:YYYY-MM-DD     → HyperLogLog (고유 방문자 수 추정)
 */
export async function POST(req: Request) {
  if (!redisEnabled) return new Response(null, { status: 204 });
  if (BOT_RE.test(req.headers.get("user-agent") ?? "")) {
    return new Response(null, { status: 204 });
  }

  let body: Partial<TrackPayload>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new Response(null, { status: 400 });
  }

  const type = pick(EVENT_TYPES, body.type);
  if (!type) return new Response(null, { status: 400 });

  const key = dayKey(kstDate());
  const fields = [`ev:${type}`];

  const topic = pick(TOPICS, body.topic);
  const source = pick(SOURCES, body.source);
  const loc = pick(LOCATIONS, body.loc);
  const device = body.device === "mobile" || body.device === "desktop" ? body.device : undefined;

  if (type === "page_view") {
    if (source) fields.push(`src:${source}`);
    if (device) fields.push(`dev:${device}`);
  }
  if (type === "chat_message" && topic) fields.push(`topic:${topic}`);
  if ((type === "cta_call" || type === "cta_book") && loc) {
    fields.push(`${type}:${loc}`);
  }

  const cmds: (string | number)[][] = fields.map((f) => ["HINCRBY", key, f, 1]);
  cmds.push(["EXPIRE", key, TTL_SECONDS]);

  const vid = typeof body.vid === "string" ? body.vid.slice(0, 64) : "";
  if (type === "page_view" && vid) {
    const uk = uvKey(kstDate());
    cmds.push(["PFADD", uk, vid], ["EXPIRE", uk, TTL_SECONDS]);
  }

  try {
    await pipeline(cmds);
  } catch {
    // 통계 실패가 사이트 동작에 영향 주지 않도록 무시
  }
  return new Response(null, { status: 204 });
}
