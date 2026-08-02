import type { PostalCode } from "@/types";
import { neighborhoods } from "@/data/neighborhoods";

/**
 * Postal code demo dataset. Kadıköy entries are derived from
 * neighborhoods.ts (single source of truth); a few extra well-known codes
 * are hand-added for search breadth. PTT's full dataset should replace
 * this file for production use — see isDemoData.
 */
const fromNeighborhoods: PostalCode[] = neighborhoods
  .filter((n) => n.postalCode)
  .map((n) => ({
    code: n.postalCode as string,
    provinceSlug: n.provinceSlug,
    districtSlug: n.districtSlug,
    neighborhoodSlug: n.slug,
    isDemoData: true,
  }));

const extra: PostalCode[] = [
  {
    code: "06420",
    provinceSlug: "ankara",
    districtSlug: "cankaya",
    isDemoData: true,
  },
  {
    code: "06010",
    provinceSlug: "ankara",
    districtSlug: "altindag",
    isDemoData: true,
  },
  {
    code: "35220",
    provinceSlug: "izmir",
    districtSlug: "konak",
    isDemoData: true,
  },
  {
    code: "35600",
    provinceSlug: "izmir",
    districtSlug: "karsiyaka",
    isDemoData: true,
  },
  {
    code: "34349",
    provinceSlug: "istanbul",
    districtSlug: "besiktas",
    isDemoData: true,
  },
  {
    code: "34664",
    provinceSlug: "istanbul",
    districtSlug: "uskudar",
    isDemoData: true,
  },
  {
    code: "16090",
    provinceSlug: "bursa",
    districtSlug: "osmangazi",
    isDemoData: true,
  },
  {
    code: "07050",
    provinceSlug: "antalya",
    districtSlug: "muratpasa",
    isDemoData: true,
  },
  {
    code: "42030",
    provinceSlug: "konya",
    districtSlug: "selcuklu",
    isDemoData: true,
  },
  {
    code: "47200",
    provinceSlug: "mardin",
    districtSlug: "artuklu",
    isDemoData: true,
  },
];

export const postalCodes: PostalCode[] = [...fromNeighborhoods, ...extra];

export function getPostalCode(code: string): PostalCode | undefined {
  return postalCodes.find((p) => p.code === code);
}

export function getPostalCodesForDistrict(
  provinceSlug: string,
  districtSlug: string,
): PostalCode[] {
  return postalCodes.filter(
    (p) => p.provinceSlug === provinceSlug && p.districtSlug === districtSlug,
  );
}

export function getNearbyPostalCodes(code: string, limit = 4): PostalCode[] {
  const target = getPostalCode(code);
  if (!target) return [];
  return postalCodes
    .filter(
      (p) =>
        p.code !== code &&
        p.provinceSlug === target.provinceSlug &&
        p.districtSlug === target.districtSlug,
    )
    .slice(0, limit);
}
