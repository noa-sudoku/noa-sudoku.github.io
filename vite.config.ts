import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        features: resolve(__dirname, "features/index.html"),
        support: resolve(__dirname, "support/index.html"),
        privacy: resolve(__dirname, "privacy/index.html")
      }
    }
  }
});
