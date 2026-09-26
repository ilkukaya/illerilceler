import type { APIRoute } from "astro";
import { searchIndex } from "@/data/searchIndex";

/**
 * The client-side search index as a standalone, CDN-cached JSON file. The
 * search dialog fetches it on first open, so no page ships the raw
 * province/district data inside its JavaScript bundle.
 */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchIndex), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
