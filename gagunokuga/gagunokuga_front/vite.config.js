import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // 환경 변수 로드

  return {
    plugins: [
        vue(),
        tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    logLevel: "info",
    build: {
      outDir: "dist",
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    define: {
      "import.meta.env.VITE_APP_API_BASE_URL": JSON.stringify(env.VITE_APP_API_BASE_URL || "http://localhost:8080"),
    },
  };
});
