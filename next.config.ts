import type { NextConfig } from "next";

const nextConfig: NextConfig & {
  turbopack?: Record<string, unknown>;
} = {
  // Turbopack 유지 + (webpack 설정이 어딘가에 남아 있어도) 경고를 잠재우는 용도
  turbopack: {},

  // 지식 스냅샷(15MB) + 그래프 라벨(14MB)은 실제로 읽는 라우트에만 트레이스한다.
  // 이전의 '/api/**' 전역 포함은 학생/생성/OCR 등 무관한 라우트 전부에
  // 29MB JSON을 배포 번들로 실어 보냈다.
  outputFileTracingIncludes: {
    '/api/admin/crawl': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/admin/crawl-status': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/admin/quality-report': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/admin/reindex': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/counsel-chat': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/counsel-chat/graph': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/knowledge/meta': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/knowledge/sync': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/record-review': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/search': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/search-eval': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    '/api/search-openai': ['./output/star-moe-knowledge-*.json', './output/graph-rag-labels/*.json'],
    // /api/health는 스냅샷 존재 여부만 확인하므로 canonical JSON만 있으면 된다.
    '/api/health': ['./output/star-moe-knowledge-*.json'],
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
