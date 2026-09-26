import type { APIRoute } from "astro";
import { MAP_VIEWBOX, provinceShapes } from "@/data/turkeyMap";

/**
 * Shared SVG sprite for every small locator map on the site. Pages reference
 * it with <use href="/harita/turkiye.svg#p-<slug>"> so the outlines are
 * downloaded once and cached, instead of being inlined into 1,000+ pages.
 * Paths carry no fill, so colour comes from the referencing <use> element
 * (and therefore follows the light/dark theme tokens).
 */
export const GET: APIRoute = () => {
  const body = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MAP_VIEWBOX}">
<g id="turkiye">${provinceShapes.map((s) => `<path d="${s.dLite}"/>`).join("")}</g>
${provinceShapes.map((s) => `<path id="p-${s.slug}" d="${s.dLite}"/>`).join("\n")}
</svg>`;
  return new Response(body, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
};
