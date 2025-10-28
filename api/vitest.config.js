import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: "src",
    },
    setupFiles: ["tests/setup.js"],
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Disable parallel file execution to prevent database test race conditions
    // (vitest v4 defaults to parallel, v3 was sequential)
    fileParallelism: false,
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
  },
});
