import type { APIRoute } from "astro";
import { sitemapSections, renderUrlset } from "@/utils/sitemap";

export function getStaticPaths() {
  return Object.keys(sitemapSections).map((name) => ({ params: { name } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(renderUrlset(sitemapSections[params.name as string]()), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
