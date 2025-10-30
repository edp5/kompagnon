import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: "src",
    },
    setupFiles: ["tests/setup.js"],
    pool: "forks",
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
  },
});
