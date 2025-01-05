import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      enableRouteGeneration: false,
    }),
    react(),
  ],
  clearScreen: false,
  server: {
    host: host || false,
    port: 3000,
    strictPort: true,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 3000,
        }
      : undefined,
  },
  envPrefix: [
    "VITE_",
    "TAURI_PLATFORM",
    "TAURI_ARCH",
    "TAURI_FAMILY",
    "TAURI_PLATFORM_VERSION",
    "TAURI_PLATFORM_TYPE",
    "TAURI_DEBUG",
  ],
  build: {
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
