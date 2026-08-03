/**
 * Validates every province/district image entry and prints the build-end
 * report described in the image strategy. Mirrors the resolution logic in
 * src/generated/locationImageManifest.ts but checks the filesystem directly
 * with `fs` instead of `import.meta.glob` (a Vite-only API not available
 * to a plain Node/tsx script) — see that file's header comment for why the
 * two stay in lockstep.
 *
 * Usage: npm run images:validate (also runs automatically after `npm run build`)
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { provinces } from "../src/data/provinces.ts";
import { districts } from "../src/data/districts.ts";
import {
  resolveProvinceArchetype,
  resolveDistrictArchetype,
  provinceImageOverrides,
  districtImageOverrides,
} from "../src/data/locationImageOverrides.ts";

const ROOT = process.cwd();
const ASSET_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_HERO_BYTES = 700 * 1024; // generous ceiling; real hero photos should usually land well under this
const OG_MIN_BYTES = 200; // catches accidentally-empty/corrupt files
const TARGET_ASPECT = 16 / 7;
const ASPECT_TOLERANCE = 0.35; // photos won't be pixel-exact 16:7; flag only real outliers
const TEMP_URL_PATTERNS = [/googleusercontent\.com/i, /^https?:\/\//i, /blob:/i, /stitch/i];

interface Finding {
  slug: string;
  level: "error" | "warning";
  message: string;
}

const findings: Finding[] = [];

function findHeroAssetFs(dir: string): { kind: "real-photo" | "ai-photorealistic"; filePath: string } | null {
  const base = path.join(ROOT, "src/assets/locations", dir);
  if (!existsSync(base)) return null;
  for (const ext of ASSET_EXTENSIONS) {
    const realPath = path.join(base, `hero-real.${ext}`);
    if (existsSync(realPath)) return { kind: "real-photo", filePath: realPath };
  }
  for (const ext of ASSET_EXTENSIONS) {
    const aiPath = path.join(base, `hero-ai.${ext}`);
    if (existsSync(aiPath)) return { kind: "ai-photorealistic", filePath: aiPath };
  }
  return null;
}

async function checkAspectAndSize(slug: string, filePath: string) {
  const { size } = statSync(filePath);
  if (size > MAX_HERO_BYTES) {
    findings.push({
      slug,
      level: "warning",
      message: `Oversized hero image (${Math.round(size / 1024)} KB > ${Math.round(MAX_HERO_BYTES / 1024)} KB): ${path.relative(ROOT, filePath)}`,
    });
  }
  try {
    const meta = await sharp(filePath).metadata();
    if (meta.width && meta.height) {
      const ratio = meta.width / meta.height;
      if (Math.abs(ratio - TARGET_ASPECT) / TARGET_ASPECT > ASPECT_TOLERANCE) {
        findings.push({
          slug,
          level: "warning",
          message: `Aspect ratio ${ratio.toFixed(2)}:1 is far from the target 16:7 (${TARGET_ASPECT.toFixed(2)}:1): ${path.relative(ROOT, filePath)}`,
        });
      }
    }
  } catch {
    findings.push({ slug, level: "error", message: `Could not read image metadata: ${path.relative(ROOT, filePath)}` });
  }
}

function checkTempUrl(slug: string, field: string, value: string | undefined) {
  if (!value) return;
  for (const pattern of TEMP_URL_PATTERNS) {
    if (pattern.test(value)) {
      findings.push({ slug, level: "error", message: `${field} looks like an external/temporary URL, not a local asset: "${value}"` });
      return;
    }
  }
}

async function main() {
  let provinceCount = 0;
  let districtCount = 0;
  let realPhotos = 0;
  let aiPhotos = 0;
  let stylized = 0;
  let fallback = 0;
  let verified = 0;
  let missingCredits = 0;
  const heroUsage = new Map<string, string[]>();

  for (const province of provinces) {
    provinceCount++;
    const resolved = resolveProvinceArchetype(province);
    const override = provinceImageOverrides[province.slug];
    const asset = findHeroAssetFs(`provinces/${province.slug}`);
    const alt = override?.alt ?? `${province.name}`;

    if (!alt.trim()) findings.push({ slug: province.slug, level: "error", message: "Missing alt text." });
    checkTempUrl(province.slug, "hero", asset?.filePath);

    if (asset) {
      await checkAspectAndSize(province.slug, asset.filePath);
      const list = heroUsage.get(asset.filePath) ?? [];
      list.push(province.slug);
      heroUsage.set(asset.filePath, list);
      if (asset.kind === "real-photo") {
        realPhotos++;
        if (!override?.credit?.sourceName) {
          missingCredits++;
          findings.push({ slug: province.slug, level: "error", message: "real-photo asset present but locationImageOverrides.ts has no credit.sourceName." });
        } else {
          verified++;
        }
      } else {
        aiPhotos++;
        if (!override?.aiMetadata?.prompt) {
          findings.push({ slug: province.slug, level: "warning", message: "ai-photorealistic asset present but aiMetadata.prompt is not recorded." });
        }
      }
    } else if (resolved.tier === "A") {
      stylized++;
    } else {
      stylized++;
    }

    const ogPath = path.join(ROOT, "public/og/provinces", `${province.slug}.webp`);
    if (!existsSync(ogPath)) {
      findings.push({ slug: province.slug, level: "error", message: "Missing OG image (run npm run og:generate)." });
    } else if (statSync(ogPath).size < OG_MIN_BYTES) {
      findings.push({ slug: province.slug, level: "error", message: "OG image file looks empty/corrupt." });
    }
  }

  for (const district of districts) {
    districtCount++;
    const province = provinces.find((p) => p.slug === district.provinceSlug);
    if (!province) {
      findings.push({ slug: district.id, level: "error", message: `Unknown provinceSlug "${district.provinceSlug}".` });
      continue;
    }
    const provinceResolved = resolveProvinceArchetype(province);
    const provinceOverride = provinceImageOverrides[province.slug];
    const effectiveProvinceSceneKey = provinceOverride?.sceneKey ?? provinceResolved.sceneKey;
    const { tier } = resolveDistrictArchetype(district, effectiveProvinceSceneKey);
    const override = districtImageOverrides[district.id];
    const asset = findHeroAssetFs(`districts/${district.provinceSlug}/${district.slug}`);
    const alt = override?.alt ?? `${district.name}, ${province.name}`;

    if (!alt.trim()) findings.push({ slug: district.id, level: "error", message: "Missing alt text." });
    checkTempUrl(district.id, "hero", asset?.filePath);

    if (asset) {
      await checkAspectAndSize(district.id, asset.filePath);
      const list = heroUsage.get(asset.filePath) ?? [];
      list.push(district.id);
      heroUsage.set(asset.filePath, list);
      if (asset.kind === "real-photo") {
        realPhotos++;
        if (!override?.credit?.sourceName) {
          missingCredits++;
          findings.push({ slug: district.id, level: "error", message: "real-photo asset present but locationImageOverrides.ts has no credit.sourceName." });
        } else {
          verified++;
        }
      } else {
        aiPhotos++;
        if (!override?.aiMetadata?.prompt) {
          findings.push({ slug: district.id, level: "warning", message: "ai-photorealistic asset present but aiMetadata.prompt is not recorded." });
        }
      }
    } else if (tier === "C") {
      fallback++;
    } else {
      stylized++;
    }

    const ogPath = path.join(ROOT, "public/og/districts", district.provinceSlug, `${district.slug}.webp`);
    if (!existsSync(ogPath)) {
      findings.push({ slug: district.id, level: "error", message: "Missing OG image (run npm run og:generate)." });
    } else if (statSync(ogPath).size < OG_MIN_BYTES) {
      findings.push({ slug: district.id, level: "error", message: "OG image file looks empty/corrupt." });
    }
  }

  let duplicateHeroWarnings = 0;
  for (const [filePath, slugs] of heroUsage) {
    if (slugs.length > 1) {
      duplicateHeroWarnings++;
      findings.push({
        slug: slugs.join(", "),
        level: "warning",
        message: `Same real/AI hero file used by ${slugs.length} locations: ${path.relative(ROOT, filePath)}`,
      });
    }
  }

  const errors = findings.filter((f) => f.level === "error");
  const warnings = findings.filter((f) => f.level === "warning");

  console.log("");
  console.log("Location image report");
  console.log("======================");
  console.log(`Province images: ${provinceCount}/${provinces.length}`);
  console.log(`District images: ${districtCount}/${districts.length}`);
  console.log(`Real photos: ${realPhotos}`);
  console.log(`AI photorealistic images: ${aiPhotos}`);
  console.log(`Stylized images: ${stylized}`);
  console.log(`Fallback images: ${fallback}`);
  console.log(`Verified location images: ${verified}`);
  console.log(`Missing credits: ${missingCredits}`);
  console.log(`Oversized images: ${findings.filter((f) => f.message.startsWith("Oversized")).length}`);
  console.log(`Duplicate hero warnings: ${duplicateHeroWarnings}`);
  console.log("");

  if (findings.length > 0) {
    console.log(`${errors.length} error(s), ${warnings.length} warning(s):`);
    for (const f of findings) {
      console.log(`  [${f.level.toUpperCase()}] ${f.slug}: ${f.message}`);
    }
    console.log("");
  } else {
    console.log("No issues found.");
  }

  if (errors.length > 0) {
    console.error(`images:validate failed with ${errors.length} error(s).`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
