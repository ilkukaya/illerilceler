/**
 * Single source of truth for every province/district's hero image.
 *
 * This module is the "generated" layer described in the image strategy: it
 * combines the curated overrides (src/data/locationImageOverrides.ts) with
 * the real/AI photo assets actually present on disk
 * (src/assets/locations/**) to produce one LocationImage entry per
 * province and per district.
 *
 * Drop-in upgrade path: place a file at
 *   src/assets/locations/provinces/<slug>/hero-real.<jpg|jpeg|png|webp>
 *   src/assets/locations/districts/<provinceSlug>/<districtSlug>/hero-real.*
 * (or `hero-ai.*` for an AI-generated photo) and this manifest automatically
 * switches that location from "stylized"/"fallback" to "real-photo" /
 * "ai-photorealistic" on the next build — no code changes needed. Fill in
 * the matching `credit` (real photo) or `aiMetadata` (AI photo) in
 * locationImageOverrides.ts so validate-location-images can confirm it.
 */
import type { LocationImage, LocationImageType } from "@/types";
import { provinces } from "@/data/provinces";
import { districts } from "@/data/districts";
import { getRegion } from "@/data/regions";
import {
  resolveProvinceArchetype,
  resolveDistrictArchetype,
  provinceImageOverrides,
  districtImageOverrides,
} from "@/data/locationImageOverrides";

const heroAssetModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/locations/**/hero-{real,ai}.{jpg,jpeg,png,webp}",
  { eager: true },
);

interface FoundAsset {
  kind: Extract<LocationImageType, "real-photo" | "ai-photorealistic">;
  path: string;
}

function findHeroAsset(dir: string): FoundAsset | null {
  const realPrefix = `/src/assets/locations/${dir}/hero-real.`;
  const aiPrefix = `/src/assets/locations/${dir}/hero-ai.`;
  const paths = Object.keys(heroAssetModules);
  const real = paths.find((p) => p.startsWith(realPrefix));
  if (real) return { kind: "real-photo", path: real };
  const ai = paths.find((p) => p.startsWith(aiPrefix));
  if (ai) return { kind: "ai-photorealistic", path: ai };
  return null;
}

/** Resolves a manifest `hero`/`thumbnail` path back to its Vite-imported module, for <Picture src=...>. */
export function resolveHeroAssetModule(path: string): ImageMetadata | undefined {
  return heroAssetModules[path]?.default;
}

function naturalAlt(name: string, place: string): string {
  return `${name}, ${place}`;
}

const manifest: Record<string, LocationImage> = {};

for (const province of provinces) {
  const resolved = resolveProvinceArchetype(province);
  const override = provinceImageOverrides[province.slug];
  const sceneKey = override?.sceneKey ?? resolved.sceneKey;
  const dir = `provinces/${province.slug}`;
  const asset = findHeroAsset(dir);
  const region = getRegion(province.region);
  const verified = asset?.kind === "real-photo" && Boolean(override?.credit?.sourceName);

  manifest[province.slug] = {
    type: asset ? asset.kind : "stylized",
    sceneKey,
    locationKind: "province",
    locationSlug: province.slug,
    hero: asset ? asset.path : `scene:${sceneKey}`,
    thumbnail: asset ? asset.path : `scene:${sceneKey}`,
    openGraph: `/og/provinces/${province.slug}.webp`,
    alt: override?.alt ?? naturalAlt(province.name, region?.name ?? "Türkiye"),
    caption: override?.caption,
    focalPoint: override?.focalPoint ?? { x: 50, y: 48 },
    credit: asset?.kind === "real-photo" ? override?.credit : undefined,
    aiMetadata: asset?.kind === "ai-photorealistic" ? override?.aiMetadata : undefined,
    verifiedLocation: verified,
  };
}

for (const district of districts) {
  const province = provinces.find((p) => p.slug === district.provinceSlug);
  if (!province) continue;
  const provinceResolved = resolveProvinceArchetype(province);
  const provinceOverride = provinceImageOverrides[province.slug];
  const effectiveProvinceSceneKey = provinceOverride?.sceneKey ?? provinceResolved.sceneKey;
  const { sceneKey, tier } = resolveDistrictArchetype(district, effectiveProvinceSceneKey);
  const override = districtImageOverrides[district.id];
  const dir = `districts/${district.provinceSlug}/${district.slug}`;
  const asset = findHeroAsset(dir);
  const verified = asset?.kind === "real-photo" && Boolean(override?.credit?.sourceName);

  manifest[district.id] = {
    type: asset ? asset.kind : tier === "C" ? "fallback" : "stylized",
    sceneKey,
    locationKind: "district",
    locationSlug: district.slug,
    provinceSlug: district.provinceSlug,
    hero: asset ? asset.path : `scene:${sceneKey}`,
    thumbnail: asset ? asset.path : `scene:${sceneKey}`,
    openGraph: `/og/districts/${district.provinceSlug}/${district.slug}.webp`,
    alt: override?.alt ?? naturalAlt(district.name, province.name),
    caption: override?.caption,
    focalPoint: override?.focalPoint ?? { x: 50, y: 48 },
    credit: asset?.kind === "real-photo" ? override?.credit : undefined,
    aiMetadata: asset?.kind === "ai-photorealistic" ? override?.aiMetadata : undefined,
    verifiedLocation: verified,
  };
}

export const locationImageManifest: Record<string, LocationImage> = manifest;

export function getProvinceImage(slug: string): LocationImage | undefined {
  return manifest[slug];
}

/** districtId is the District.id field, e.g. "istanbul-kadikoy". */
export function getDistrictImage(districtId: string): LocationImage | undefined {
  return manifest[districtId];
}
