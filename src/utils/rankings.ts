/**
 * Derived statistics & rankings, computed once at build time from the real
 * TÜİK / HGM figures in src/data. Every "Türkiye'de kaçıncı" sentence on the
 * site comes from here, so it can never drift from the underlying data.
 */
import { provinces } from "@/data/provinces";
import { districts } from "@/data/districts";
import type { District, Province } from "@/types";
import { haversineDistanceKm as haversineKm } from "@/utils/distance";

export const TOTAL_POPULATION = provinces.reduce((s, p) => s + (p.population ?? 0), 0);
export const TOTAL_AREA = provinces.reduce((s, p) => s + (p.areaKm2 ?? 0), 0);
export const NATIONAL_DENSITY = TOTAL_POPULATION / TOTAL_AREA;
export const POPULATION_YEAR = provinces[0]?.populationYear ?? 2025;

export function density(pop?: number, area?: number): number | undefined {
  if (!pop || !area) return undefined;
  return pop / area;
}

function rankMap<T>(items: T[], key: (t: T) => number | undefined, id: (t: T) => string) {
  const sorted = items
    .filter((t) => key(t) !== undefined)
    .sort((a, b) => (key(b) ?? 0) - (key(a) ?? 0));
  return new Map(sorted.map((t, i) => [id(t), i + 1]));
}

export const provincesByPopulation = [...provinces].sort(
  (a, b) => (b.population ?? 0) - (a.population ?? 0),
);
export const provincesByArea = [...provinces].sort((a, b) => (b.areaKm2 ?? 0) - (a.areaKm2 ?? 0));
export const provincesByDensity = [...provinces].sort(
  (a, b) => (density(b.population, b.areaKm2) ?? 0) - (density(a.population, a.areaKm2) ?? 0),
);
export const provincesByDistrictCount = [...provinces].sort(
  (a, b) => (b.districtCount ?? 0) - (a.districtCount ?? 0),
);
export const provincesByElevation = [...provinces].sort(
  (a, b) => (b.elevationM ?? 0) - (a.elevationM ?? 0),
);

const provPopRank = rankMap(provinces, (p) => p.population, (p) => p.slug);
const provAreaRank = rankMap(provinces, (p) => p.areaKm2, (p) => p.slug);
const provDensityRank = rankMap(provinces, (p) => density(p.population, p.areaKm2), (p) => p.slug);
const provElevRank = rankMap(provinces, (p) => p.elevationM, (p) => p.slug);

export function provinceRanks(p: Province) {
  return {
    population: provPopRank.get(p.slug),
    area: provAreaRank.get(p.slug),
    density: provDensityRank.get(p.slug),
    elevation: provElevRank.get(p.slug),
    total: provinces.length,
  };
}

export const districtsByPopulation = [...districts].sort(
  (a, b) => (b.population ?? 0) - (a.population ?? 0),
);
export const districtsByArea = [...districts].sort((a, b) => (b.areaKm2 ?? 0) - (a.areaKm2 ?? 0));

const distPopRankNational = rankMap(districts, (d) => d.population, (d) => d.id);
const distAreaRankNational = rankMap(districts, (d) => d.areaKm2, (d) => d.id);

export function districtRanks(d: District) {
  const siblings = districts.filter((x) => x.provinceSlug === d.provinceSlug);
  const inProvincePop = rankMap(siblings, (x) => x.population, (x) => x.id).get(d.id);
  const inProvinceArea = rankMap(siblings, (x) => x.areaKm2, (x) => x.id).get(d.id);
  return {
    nationalPopulation: distPopRankNational.get(d.id),
    nationalArea: distAreaRankNational.get(d.id),
    provincePopulation: inProvincePop,
    provinceArea: inProvinceArea,
    siblings: siblings.length,
    total: districts.length,
  };
}

/** Five-step quantile class (1–5) of a province's population, for choropleths. */
export function populationClass(p: Province): number {
  const rank = provPopRank.get(p.slug) ?? provinces.length;
  const q = 1 - (rank - 1) / provinces.length;
  return Math.min(5, Math.max(1, Math.ceil(q * 5)));
}

export function densityClass(p: Province): number {
  const rank = provDensityRank.get(p.slug) ?? provinces.length;
  const q = 1 - (rank - 1) / provinces.length;
  return Math.min(5, Math.max(1, Math.ceil(q * 5)));
}

/** Straight-line (great-circle) distances from a province centre to all others. */
export function nearestProvinces(p: Province, limit = 6) {
  if (!p.coordinates) return [];
  return provinces
    .filter((o) => o.slug !== p.slug && o.coordinates)
    .map((o) => ({ province: o, km: haversineKm(p.coordinates!, o.coordinates!) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

export function farthestProvince(p: Province) {
  if (!p.coordinates) return undefined;
  return provinces
    .filter((o) => o.slug !== p.slug && o.coordinates)
    .map((o) => ({ province: o, km: haversineKm(p.coordinates!, o.coordinates!) }))
    .sort((a, b) => b.km - a.km)[0];
}
