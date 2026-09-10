import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src"],
    },
    projects: [
      {
        test: {
          name: "Unit tests",
          setupFiles: ["./tests/setup.js"],
          isolate: true,
          include: ["tests/**/unit/**/*.test.js"],
        },
      },
      {
        test: {
          name: "Integration tests",
          setupFiles: ["./tests/setup.js"],
          include: ["tests/**/integration/**/*.test.js"],
          execArgv: ["--expose-gc"],
          isolate: true,
          maxWorkers: 1,
        },
      },
      {
        test: {
          name: "Acceptance tests",
          setupFiles: ["./tests/setup.js"],
          include: ["tests/**/acceptance/**/*.test.js"],
          execArgv: ["--expose-gc"],
          isolate: true,
          maxWorkers: 1,
        },
      },
    ],
    fileParallelism: false,
    reporters: process.env.GITHUB_ACTIONS
      ? ["dot", "github-actions"]
      : ["dot"],
  },
});
