import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteContent";

/** 업무별 페이지를 추가하면 여기에도 URL을 추가한다. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
