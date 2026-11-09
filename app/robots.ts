import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteContent";

/** 검색엔진·AI 크롤러 모두 허용 (AI 답변에 인용되려면 막지 않아야 함). 상담 API·관리자 화면만 제외. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
