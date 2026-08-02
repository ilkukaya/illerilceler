import type { Neighborhood } from "@/types";
import { turkishSlugify } from "@/utils/slugify";

/**
 * Neighborhood-level demo records. Kadıköy is fully populated (postal
 * codes, population) to support the postal code lookup pages; other
 * districts can be added the same way as the dataset grows. Postal codes
 * are unique per neighborhood, as in the real PTT system.
 */
export const neighborhoods: Neighborhood[] = [
  {
    id: "kadikoy-acibadem",
    slug: "acibadem",
    name: "Acıbadem",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34718",
    population: 22841,
    summary:
      "Sağlık kuruluşları ve yeşil sokaklarıyla tanınan, Kadıköy'ün kuzeyindeki sakin bir mahalle.",
    isDemoData: true,
  },
  {
    id: "kadikoy-bostanci",
    slug: "bostanci",
    name: "Bostancı",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34744",
    population: 22150,
    isDemoData: true,
  },
  {
    id: "kadikoy-caddebostan",
    slug: "caddebostan",
    name: "Caddebostan",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34728",
    population: 15230,
    isDemoData: true,
  },
  {
    id: "kadikoy-caferaga",
    slug: "caferaga",
    name: "Caferağa",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34710",
    population: 18760,
    isDemoData: true,
  },
  {
    id: "kadikoy-dumlupinar",
    slug: "dumlupinar",
    name: "Dumlupınar",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34720",
    population: 14980,
    isDemoData: true,
  },
  {
    id: "kadikoy-egitim",
    slug: "egitim",
    name: "Eğitim",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34722",
    population: 12870,
    isDemoData: true,
  },
  {
    id: "kadikoy-erenkoy",
    slug: "erenkoy",
    name: "Erenköy",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34738",
    population: 19420,
    isDemoData: true,
  },
  {
    id: "kadikoy-fenerbahce",
    slug: "fenerbahce",
    name: "Fenerbahçe",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34726",
    population: 11360,
    isDemoData: true,
  },
  {
    id: "kadikoy-fikirtepe",
    slug: "fikirtepe",
    name: "Fikirtepe",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34724",
    population: 24670,
    isDemoData: true,
  },
  {
    id: "kadikoy-goztepe",
    slug: "goztepe",
    name: "Göztepe",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34730",
    population: 21050,
    isDemoData: true,
  },
  {
    id: "kadikoy-hasanpasa",
    slug: "hasanpasa",
    name: "Hasanpaşa",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34712",
    population: 13540,
    isDemoData: true,
  },
  {
    id: "kadikoy-kosuyolu",
    slug: "kosuyolu",
    name: "Koşuyolu",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34746",
    population: 9870,
    isDemoData: true,
  },
  {
    id: "kadikoy-kozyatagi",
    slug: "kozyatagi",
    name: "Kozyatağı",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34742",
    population: 20130,
    isDemoData: true,
  },
  {
    id: "kadikoy-merdivenkoy",
    slug: "merdivenkoy",
    name: "Merdivenköy",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34732",
    population: 17650,
    isDemoData: true,
  },
  {
    id: "kadikoy-osmanaga",
    slug: "osmanaga",
    name: "Osmanağa",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34714",
    population: 10230,
    isDemoData: true,
  },
  {
    id: "kadikoy-rasimpasa",
    slug: "rasimpasa",
    name: "Rasimpaşa",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34716",
    population: 8940,
    isDemoData: true,
  },
  {
    id: "kadikoy-sahrayicedit",
    slug: "sahrayicedit",
    name: "Sahrayıcedit",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34734",
    population: 18920,
    isDemoData: true,
  },
  {
    id: "kadikoy-suadiye",
    slug: "suadiye",
    name: "Suadiye",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34740",
    population: 16580,
    isDemoData: true,
  },
  {
    id: "kadikoy-sureyya",
    slug: "sureyya",
    name: "Süreyya",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34736",
    population: 7650,
    isDemoData: true,
  },
  {
    id: "kadikoy-zuhtupasa",
    slug: "zuhtupasa",
    name: "Zühtüpaşa",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34748",
    population: 15340,
    isDemoData: true,
  },
  {
    id: "kadikoy-19-mayis",
    slug: "19-mayis",
    name: "19 Mayıs",
    districtSlug: "kadikoy",
    provinceSlug: "istanbul",
    postalCode: "34750",
    population: 9120,
    isDemoData: true,
  },
];

export function getNeighborhoodsForDistrict(
  provinceSlug: string,
  districtSlug: string,
): Neighborhood[] {
  return neighborhoods.filter(
    (n) => n.provinceSlug === provinceSlug && n.districtSlug === districtSlug,
  );
}

export function getNeighborhoodBySlug(
  provinceSlug: string,
  districtSlug: string,
  slug: string,
): Neighborhood | undefined {
  return neighborhoods.find(
    (n) =>
      n.provinceSlug === provinceSlug &&
      n.districtSlug === districtSlug &&
      n.slug === slug,
  );
}

export function neighborhoodSlug(name: string): string {
  return turkishSlugify(name);
}
