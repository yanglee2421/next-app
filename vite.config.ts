import { defineConfig } from "vite-plus";

export default defineConfig({
  // fmt: {},
  lint: {
    plugins: ["eslint", "oxc", "typescript"],
    rules: {
      "typescript/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
    overrides: [
      {
        files: ["apps/vercel/**/*.tsx", "apps/vercel/**/*.ts"],
        plugins: [
          "eslint",
          "oxc",
          "typescript",
          "react",
          "react-perf",
          "nextjs",
        ],
      },
    ],
  },
});
