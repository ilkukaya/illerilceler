/** Canonical URL builders shared by pages, sitemap and internal links. */

export const provincePath = (slug: string) => `/iller/${slug}/`;
export const districtPath = (provinceSlug: string, slug: string) => `/iller/${provinceSlug}/${slug}/`;
export const districtListPath = (provinceSlug: string) => `/iller/${provinceSlug}/ilceler/`;
export const platePath = (code: string) => `/plaka-kodlari/${code}/`;
export const areaCodePath = (code: string) => `/alan-kodlari/${code}/`;

/**
 * One page per province pair; slugs are ordered alphabetically so
 * "ankara-istanbul" and "istanbul-ankara" resolve to the same canonical URL.
 */
export function distancePath(a: string, b: string): string {
  const [x, y] = [a, b].sort();
  return `/mesafe/${x}-${y}/`;
}
