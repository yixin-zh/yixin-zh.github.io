import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The site is served from https://<user>.github.io/my-online-resume/, so the
// base path is fixed.  Keeping it identical in dev and prod means path bugs
// show up locally instead of after a deploy.
const BASE = "/my-online-resume/";

export default defineConfig({
  base: BASE,
  plugins: [react()],
  // Everything the Python build writes into var/ is served from the site root.
  publicDir: path.resolve(__dirname, "../var"),
  build: {
    outDir: path.resolve(__dirname, "../docs"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
  },
});
