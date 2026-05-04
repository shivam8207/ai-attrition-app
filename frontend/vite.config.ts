import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/static",
    emptyOutDir: true,
    sourcemap: true,
    target: "esnext",
  },
  server: {
    proxy: {
      "/attr": "http://localhost:5000/",
      "/upload": "http://localhost:5000/",
      "/down":"http://localhost:5000/",
    },
  },
});
