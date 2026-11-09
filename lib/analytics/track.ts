"use client";

import type { TrackPayload } from "./events";

function visitorId(): string {
  try {
    let id = localStorage.getItem("kimkw_vid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("kimkw_vid", id);
    }
    return id;
  } catch {
    return "";
  }
}

/** 페이지를 떠나도 유실되지 않게 sendBeacon 우선. 실패해도 조용히 무시. */
export function track(payload: Omit<TrackPayload, "vid">) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ ...payload, vid: visitorId() });
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/track", blob)) return;
    void fetch("/api/track", { method: "POST", body, keepalive: true });
  } catch {
    /* ignore */
  }
}
