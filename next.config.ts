import type { NextConfig } from "next";

const nextConfig: NextConfig & {
  turbopack?: Record<string, unknown>;
} = {
  // Turbopack 유지 + (webpack 설정이 어딘가에 남아 있어도) 경고를 잠재우는 용도
  turbopack: {},

  outputFileTracingIncludes: {
    '/api/**': ['./output/**/*.json'],
  },

  async redirects() {
    return [
      {
        source: '/observation-board',
        destination: '/observation-board-2',
        permanent: false,
      },
      {
        source: '/observation-board/:path*',
        destination: '/observation-board-2',
        permanent: false,
      },
      {
        source: '/observations',
        destination: '/observation-board-2',
        permanent: false,
      },
      {
        source: '/observations/:path*',
        destination: '/observation-board-2',
        permanent: false,
      },
    ];
  },

  /**
   * 핵심: 서버 번들링에서 pdfjs-dist를 제외(외부 패키지로 취급)해서
   * pdf.worker.mjs가 .next/chunks로 “이사”되지 않게 함.
   * 그러면 런타임에서 node_modules의 실제 파일을 그대로 찾을 수 있습니다.
   */
  serverExternalPackages: ["pdfjs-dist", "canvas"],
};

export default nextConfig;
