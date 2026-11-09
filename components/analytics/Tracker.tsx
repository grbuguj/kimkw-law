"use client";

import { useEffect } from "react";
import { detectSource, LOCATIONS, type CtaLocation } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

function locationOf(el: Element): CtaLocation {
  const tagged = el.closest("[data-track-loc]")?.getAttribute("data-track-loc");
  const id = tagged ?? el.closest("section[id]")?.id ?? "other";
  return (LOCATIONS as readonly string[]).includes(id) ? (id as CtaLocation) : "other";
}

/**
 * 페이지 방문 1회 기록 + 전화/예약/지도 링크 클릭을 위임 방식으로 수집.
 * 링크마다 코드를 붙이지 않아도 된다 (위치는 가장 가까운 data-track-loc 또는 section id).
 */
export default function Tracker() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("kimkw_pv")) {
        sessionStorage.setItem("kimkw_pv", "1");
        const utm = new URLSearchParams(location.search).get("utm_source");
        track({
          type: "page_view",
          source: detectSource(document.referrer, utm),
          device: matchMedia("(max-width: 639px)").matches ? "mobile" : "desktop",
        });
      }
    } catch {
      /* ignore */
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        track({ type: "cta_call", loc: locationOf(a) });
      } else if (href.includes("map.naver.com") && href.includes("ticket")) {
        track({ type: "cta_book", loc: locationOf(a) });
      } else if (href.includes("map.naver.com")) {
        track({ type: "map_click" });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
