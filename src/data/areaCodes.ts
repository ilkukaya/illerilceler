import type { AreaCode } from "@/types";
import { provinces } from "@/data/provinces";

/** Derived from provinces.ts — İstanbul has two (212/216), everyone else has one. */
export const areaCodes: AreaCode[] = provinces.flatMap((p) =>
  p.areaCodes.map((code) => ({
    code,
    provinceSlug: p.slug,
    type: "fixed" as const,
    label:
      p.slug === "istanbul"
        ? code === "212"
          ? "İstanbul Avrupa Yakası"
          : "İstanbul Anadolu Yakası"
        : undefined,
  })),
);

export function getAreaCode(code: string): AreaCode | undefined {
  const normalized = code.replace(/^0+/, "");
  return areaCodes.find((a) => a.code === normalized);
}
