import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세특 AI 도우미 - 교과 세특 작성 서비스",
  description: "생성형 AI 기반 교과 세특 작성·검토·내보내기 웹서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
