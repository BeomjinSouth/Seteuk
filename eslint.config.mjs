import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next, made nested-aware so build
    // output inside nested checkouts (e.g. .claude/worktrees/*/.next) is not
    // linted — parsing those generated chunks OOMs the ESLint process.
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "next-env.d.ts",
    // Claude Code worktrees are separate checkouts, not project source.
    ".claude/**",
  ]),
  {
    rules: {
      // `const { omitted, ...rest } = value` 형태로 필드를 제거하는 관용구를
      // 미사용 변수로 오탐하지 않도록 rest sibling은 무시한다.
      "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    },
  },
]);

export default eslintConfig;
