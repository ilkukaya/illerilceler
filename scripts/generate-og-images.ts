/**
 * Generates a unique 1200x630 Open Graph image for every province and
 * district, using the same LocationScene archetype system as the site's
 * hero art (see src/data/sceneArchetypes.js). Runs as a prebuild step
 * (see package.json) so `public/og/**` is always in sync with the manifest
 * — no external image service, no network calls, fully reproducible.
 *
 * Usage: npm run og:generate
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { provinces } from "../src/data/provinces.ts";
import { districts } from "../src/data/districts.ts";
import { getRegion } from "../src/data/regions.ts";
import {
  resolveProvinceArchetype,
  resolveDistrictArchetype,
  provinceImageOverrides,
  districtImageOverrides,
} from "../src/data/locationImageOverrides.ts";
import { sceneArchetypes } from "../src/data/sceneArchetypes.js";
import { seededRandom, CANVAS_W, CANVAS_H } from "../src/utils/sceneEngine.js";

const OG_W = 1200;
const OG_H = 630;
const OUT_ROOT = path.resolve(process.cwd(), "public/og");
const FONT_STACK = "DejaVu Sans, Liberation Sans, sans-serif";
// Material Design "place" pin glyph, 24x24 viewBox — used for the small brand mark.
const PIN_PATH =
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUid(seed: string): string {
  return seed.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 40) || "scene";
}

const archetypes = sceneArchetypes as Record<string, (typeof sceneArchetypes)["bosphorus-strait"]>;

async function renderOgImage(params: {
  sceneKey: string;
  seed: string;
  title: string;
  subtitle: string;
  outPath: string;
}): Promise<void> {
  const { sceneKey, seed, title, subtitle, outPath } = params;
  const archetype = archetypes[sceneKey] ?? archetypes["anatolian-plain-castle"];
  const rng = seededRandom(seed);
  const layers = archetype.build(rng).join("");
  const uid = safeUid(seed);

  const sceneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}" preserveAspectRatio="xMidYMax slice">
    <defs>
      <linearGradient id="sky-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${archetype.sky[0]}" />
        <stop offset="100%" stop-color="${archetype.sky[1]}" />
      </linearGradient>
    </defs>
    <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#sky-${uid})" />
    ${layers}
  </svg>`;

  const overlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
    <defs>
      <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="50%" stop-color="#000000" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="${OG_W}" height="${OG_H}" fill="url(#scrim)" />
    <text x="56" y="${OG_H - 132}" font-family="${FONT_STACK}" font-weight="800" font-size="56" fill="#ffffff">${escapeXml(title)}</text>
    <text x="56" y="${OG_H - 90}" font-family="${FONT_STACK}" font-weight="600" font-size="25" fill="#e2e8f0">${escapeXml(subtitle)}</text>
    <g transform="translate(56, ${OG_H - 58})">
      <rect width="30" height="30" rx="9" fill="#635BFF" />
      <path d="${PIN_PATH}" fill="#ffffff" transform="translate(3,3) scale(1)" />
      <text x="40" y="20" font-family="${FONT_STACK}" font-weight="700" font-size="17" fill="#ffffff">illerilceler.com</text>
    </g>
  </svg>`;

  const sceneBuffer = await sharp(Buffer.from(sceneSvg)).png().toBuffer();
  await mkdir(path.dirname(outPath), { recursive: true });
  await sharp(sceneBuffer)
    .composite([{ input: Buffer.from(overlaySvg) }])
    .webp({ quality: 82 })
    .toFile(outPath);
}

async function main() {
  let count = 0;

  for (const province of provinces) {
    const resolved = resolveProvinceArchetype(province);
    const override = provinceImageOverrides[province.slug];
    const sceneKey = override?.sceneKey ?? resolved.sceneKey;
    const region = getRegion(province.region);
    await renderOgImage({
      sceneKey,
      seed: province.slug,
      title: province.name,
      subtitle: region?.name ?? "Türkiye",
      outPath: path.join(OUT_ROOT, "provinces", `${province.slug}.webp`),
    });
    count++;
  }
  console.log(`OG images: ${count} province images done.`);

  count = 0;
  for (const district of districts) {
    const province = provinces.find((p) => p.slug === district.provinceSlug);
    if (!province) continue;
    const provinceResolved = resolveProvinceArchetype(province);
    const provinceOverride = provinceImageOverrides[province.slug];
    const effectiveProvinceSceneKey = provinceOverride?.sceneKey ?? provinceResolved.sceneKey;
    const { sceneKey } = resolveDistrictArchetype(district, effectiveProvinceSceneKey);
    const override = districtImageOverrides[district.id];
    const region = getRegion(province.region);
    await renderOgImage({
      sceneKey: override?.sceneKey ?? sceneKey,
      seed: district.id,
      title: district.name,
      subtitle: `${province.name} · ${region?.name ?? "Türkiye"}`,
      outPath: path.join(OUT_ROOT, "districts", district.provinceSlug, `${district.slug}.webp`),
    });
    count++;
  }
  console.log(`OG images: ${count} district images done.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
