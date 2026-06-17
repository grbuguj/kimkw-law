import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "김포 법무사 김관우 | 개인회생·파산·등기 무료상담",
  description:
    "법원 30년·전 김포등기소장·전 인천법원 개인회생위원 김관우 법무사가 직접 상담합니다. 개인회생, 파산, 등기, 상속 — 혼자 고민 마시고 편하게 물어보세요. 무료 15분 상담.",
  keywords: [
    "김포 법무사",
    "김포 개인회생",
    "김포 파산",
    "김관우 법무사",
    "사우역 법무사",
    "김포 등기",
  ],
  openGraph: {
    title: "김포 법무사 김관우 | 혼자 고민 마세요",
    description:
      "법원 30년·전 인천법원 개인회생위원 김관우 법무사가 직접 상담합니다. 무료 15분 상담.",
    type: "website",
    locale: "ko_KR",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#122139",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
