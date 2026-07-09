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
]);

export default eslintConfig;
