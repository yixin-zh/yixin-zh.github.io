import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A user site (https://<user>.github.io/) is served from "/"; a project site
// (https://<user>.github.io/<repo>/) needs "/<repo>/".  Set BASE_PATH for the
// latter — the deploy workflow derives it from the repository name.  Dev and
// prod share this value so path bugs show up locally.
const BASE = process.env.BASE_PATH ?? "/";

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
