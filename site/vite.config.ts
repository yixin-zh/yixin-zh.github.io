import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const BASE = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: BASE,
  plugins: [react()],
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
  },
});
