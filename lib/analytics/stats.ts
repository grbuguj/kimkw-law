import { dayKey, kstDate, pipeline, redisEnabled, uvKey } from "./redis";
import {
  LOCATIONS,
  SOURCES,
  TOPICS,
  type CtaLocation,
  type EventType,
  type Source,
  type Topic,
} from "./events";

export interface DayRow {
  date: string;
  visitors: number;
  pageViews: number;
  chatStarts: number;
  calls: number;
  books: number;
}

export interface Stats {
  enabled: boolean;
  days: number;
  daily: DayRow[];
  totals: Record<EventType, number> & { visitors: number };
  prevTotals: { visitors: number; chatStarts: number; contacts: number };
  topics: { key: Topic; count: number }[];
  sources: { key: Source; count: number }[];
  ctaByLoc: { key: CtaLocation; call: number; book: number }[];
  devices: { mobile: number; desktop: number };
}

function toMap(flat: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!Array.isArray(flat)) return out;
  for (let i = 0; i < flat.length; i += 2) out[String(flat[i])] = Number(flat[i + 1]) || 0;
  return out;
}

const emptyTotals = () =>
  ({
    visitors: 0,
    page_view: 0,
    chat_open: 0,
    chat_start: 0,
    chat_message: 0,
    diagnosis_open: 0,
    diagnosis_submit: 0,
    cta_call: 0,
    cta_book: 0,
    map_click: 0,
  }) as Stats["totals"];

/** 최근 N일 + 비교용 직전 N일을 한 번의 파이프라인으로 읽는다. */
export async function loadStats(days: number): Promise<Stats> {
  const dates = Array.from({ length: days * 2 }, (_, i) => kstDate(days * 2 - 1 - i));

  let maps: Record<string, number>[] = dates.map(() => ({}));
  let uvs: number[] = dates.map(() => 0);

  if (redisEnabled) {
    const res = await pipeline([
      ...dates.map((d) => ["HGETALL", dayKey(d)]),
      ...dates.map((d) => ["PFCOUNT", uvKey(d)]),
    ]);
    maps = dates.map((_, i) => toMap(res[i]));
    uvs = dates.map((_, i) => Number(res[dates.length + i]) || 0);
  }

  const totals = emptyTotals();
  const topic: Record<string, number> = {};
  const source: Record<string, number> = {};
  const call: Record<string, number> = {};
  const book: Record<string, number> = {};
  const devices = { mobile: 0, desktop: 0 };
  const daily: DayRow[] = [];
  const prev = { visitors: 0, chatStarts: 0, contacts: 0 };

  dates.forEach((date, i) => {
    const m = maps[i];
    if (i < days) {
      prev.visitors += uvs[i];
      prev.chatStarts += m["ev:chat_start"] ?? 0;
      prev.contacts += (m["ev:cta_call"] ?? 0) + (m["ev:cta_book"] ?? 0);
      return;
    }
    totals.visitors += uvs[i];
    for (const [k, v] of Object.entries(m)) {
      const [kind, name] = k.split(":");
      const t = totals as Record<string, number>;
      if (kind === "ev") t[name] = (t[name] ?? 0) + v;
      else if (kind === "topic") topic[name] = (topic[name] ?? 0) + v;
      else if (kind === "src") source[name] = (source[name] ?? 0) + v;
      else if (kind === "dev" && (name === "mobile" || name === "desktop")) devices[name] += v;
      else if (kind === "cta_call") call[name] = (call[name] ?? 0) + v;
      else if (kind === "cta_book") book[name] = (book[name] ?? 0) + v;
    }
    daily.push({
      date,
      visitors: uvs[i],
      pageViews: m["ev:page_view"] ?? 0,
      chatStarts: m["ev:chat_start"] ?? 0,
      calls: m["ev:cta_call"] ?? 0,
      books: m["ev:cta_book"] ?? 0,
    });
  });

  const sortDesc = <K extends string>(keys: readonly K[], src: Record<string, number>) =>
    keys
      .map((key) => ({ key, count: src[key] ?? 0 }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count);

  return {
    enabled: redisEnabled,
    days,
    daily,
    totals,
    prevTotals: prev,
    topics: sortDesc(TOPICS, topic),
    sources: sortDesc(SOURCES, source),
    ctaByLoc: LOCATIONS.map((key) => ({ key, call: call[key] ?? 0, book: book[key] ?? 0 }))
      .filter((x) => x.call + x.book > 0)
      .sort((a, b) => b.call + b.book - (a.call + a.book)),
    devices,
  };
}
