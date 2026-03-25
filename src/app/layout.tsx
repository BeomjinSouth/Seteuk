import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "성호 AI - 교과 세특 작성 서비스",
  description: "생성형 AI 기반 교과 세특 작성·검토·내보내기 웹서비스",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
