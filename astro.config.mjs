// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

/**
 * Canonical site origin. Resolution order:
 * 1. SITE_URL — set this in Netlify once the custom domain (illerilceler.com) is live
 * 2. URL      — Netlify injects the project's primary URL automatically at build time
 * 3. fallback — the intended production domain
 * Canonical tags, sitemap, robots.txt and JSON-LD all read from this single value,
 * so the site never points search engines at a domain it is not served from.
 */
const site = (
  process.env.SITE_URL ||
  process.env.URL ||
  "https://illerilceler.com"
).replace(/\/$/, "");

export default defineConfig({
  site,
  trailingSlash: "always",
  compressHTML: true,
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
});
