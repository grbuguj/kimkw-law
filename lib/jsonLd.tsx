import { career, office, practiceAreas, seo, siteUrl } from "./siteContent";

/**
 * 사무소(LegalService) + 법무사(Person) 구조화 데이터.
 * 검색엔진과 AI가 "김포 / 법무사 / 김관우 / 경력 / 업무"를 정확히 연결하도록 한다.
 * 리뷰 평점(aggregateRating)은 구글이 자체 게시 리뷰 마크업을 인정하지 않으므로 넣지 않는다.
 */
export function buildJsonLd() {
  const officeId = `${siteUrl}/#office`;
  const lawyerId = `${siteUrl}/#lawyer`;
  const services = practiceAreas.map((a) => a.title);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": officeId,
        name: office.name,
        alternateName: ["김관우 법무사사무소", "김포 법무사 김관우"],
        description: seo.summary,
        url: siteUrl,
        telephone: "+82-507-1456-7936",
        image: `${siteUrl}/office.jpg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "사우중로 17 나동 1층 102호",
          addressLocality: "김포시",
          addressRegion: "경기도",
          addressCountry: "KR",
        },
        areaServed: { "@type": "City", name: "김포시" },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        hasMap: office.naverMapUrl,
        sameAs: [office.naverMapUrl],
        knowsAbout: services,
        founder: { "@id": lawyerId },
        employee: { "@id": lawyerId },
      },
      {
        "@type": "Person",
        "@id": lawyerId,
        name: "김관우",
        jobTitle: "법무사",
        image: `${siteUrl}/lawyer.jpg`,
        description: career.map((c) => c.title).join(", "),
        worksFor: { "@id": officeId },
        knowsAbout: services,
      },
    ],
  };
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
      }}
    />
  );
}
