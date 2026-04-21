import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig(function({ command, mode }) {
  const env = loadEnv(mode, process.cwd());
  const config = {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    build: {
      outDir: "../api/dists/admin",
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      open: true,
    },
  };
  if (mode === "production") {
    config.base = "/admin";
  } else if (command === "serve") {
    config.server.proxy = {
      "/api": {
        target: env.VITE_API_URL,
      },
    };
  }
  return config;
});
