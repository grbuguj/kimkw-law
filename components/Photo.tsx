"use client";

import { useEffect, useRef, useState } from "react";
import Placeholder from "./Placeholder";

/**
 * public/ 에 둔 사진을 표시한다. 파일이 아직 없으면(404) 회색 플레이스홀더로 폴백.
 * 덕분에 파일을 넣기 전에도 화면이 깨지지 않고, 넣으면 자동 새로고침으로 바로 보인다.
 */
export default function Photo({
  src,
  alt,
  label,
  ratio = "aspect-[4/3]",
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  ratio?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // SSR로 그려진 이미지는 하이드레이션 전에 404가 나면서 onError를 놓칠 수 있다.
  // 마운트 시점에 이미 실패한 상태(로드 완료인데 크기 0)면 폴백 처리한다.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return <Placeholder label={label} ratio={ratio} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`${ratio} w-full rounded-2xl object-cover ${className}`}
    />
  );
}
