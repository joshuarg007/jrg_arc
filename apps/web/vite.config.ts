import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./apps/web",
  base: "./",
  server: {
    port: 5173,
    open: true,
    // Allow imports from the monorepo root (../../), e.g., packages/core/src
    fs: {
      allow: [path.resolve(__dirname, "../..")]
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "../../packages/core/src"),
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
      "~": path.resolve(__dirname, "./src")
    }
  }
});
