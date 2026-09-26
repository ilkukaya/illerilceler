import type { APIRoute } from "astro";
import { renderIndex } from "@/utils/sitemap";

export const GET: APIRoute = () =>
  new Response(renderIndex(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
