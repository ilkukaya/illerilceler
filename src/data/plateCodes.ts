import type { PlateCode } from "@/types";
import { provinces } from "@/data/provinces";

/** Derived 1:1 from provinces.ts — every province has exactly one plate code. */
export const plateCodes: PlateCode[] = provinces.map((p) => ({
  code: p.plateCode,
  provinceSlug: p.slug,
}));

export function getPlateCode(code: string): PlateCode | undefined {
  const normalized = code.replace(/^0+/, "").padStart(2, "0");
  return plateCodes.find((p) => p.code === normalized);
}
