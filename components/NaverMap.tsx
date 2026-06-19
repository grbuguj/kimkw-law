"use client";

import { useEffect, useRef, useState } from "react";
import { office } from "@/lib/siteContent";

// NCP(네이버 클라우드 플랫폼) Maps Client ID — Vercel/.env.local 환경변수로 주입
// 신규 키는 ncpKeyId, 구버전 키는 ncpClientId 파라미터를 사용합니다.
const CLIENT_ID = process.env.NEXT_PUBLIC_NCP_MAP_CLIENT_ID;
const SCRIPT_ID = "naver-maps-sdk";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver?: any;
  }
}

export default function NaverMap() {
  const ref = useRef<HTMLDivElement>(null);
  // 키가 빌드 시 주입되지 않으면 처음부터 숨김 (SSR/클라이언트 동일 → hydration 안전)
  const [failed, setFailed] = useState(!CLIENT_ID);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    const init = () => {
      const naver = window.naver;
      if (cancelled || !ref.current || !naver?.maps) return;

      const fallbackCenter = new naver.maps.LatLng(37.6154, 126.7156);
      const map = new naver.maps.Map(ref.current, {
        center: fallbackCenter,
        zoom: 17,
        scrollWheel: false,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drop = (pos: any) => {
        map.setCenter(pos);
        new naver.maps.Marker({ position: pos, map });
      };

      if (naver.maps.Service?.geocode) {
        naver.maps.Service.geocode(
          { query: office.address },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (status: string, response: any) => {
            const ok = naver.maps.Service.Status.OK;
            const addrs = response?.v2?.addresses;
            if (status === ok && addrs?.length) {
              drop(new naver.maps.LatLng(+addrs[0].y, +addrs[0].x));
            } else {
              drop(fallbackCenter);
            }
          },
        );
      } else {
        drop(fallbackCenter);
      }
    };

    if (window.naver?.maps) {
      init();
      return;
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}&submodules=geocoder`;
      script.async = true;
      script.onerror = () => setFailed(true);
      document.head.appendChild(script);
    }
    script.addEventListener("load", init);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", init);
    };
  }, []);

  // 키가 없거나 로드 실패 시 지도를 숨김 → 부모의 링크 버튼이 안내 역할
  if (failed) return null;

  return (
    <div
      ref={ref}
      className="mt-10 h-60 w-full overflow-hidden rounded-2xl border border-navy-100 sm:mt-12 sm:h-72"
      aria-label={`${office.name} 위치 지도`}
    />
  );
}
