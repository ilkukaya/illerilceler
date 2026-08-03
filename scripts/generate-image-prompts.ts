/**
 * Builds content/image-generation-prompts.json — one AI-image prompt per
 * province and district, for locations that don't have a real photo yet.
 *
 * Level A (42 flagship locations) get a hand-written prompt grounded in
 * that specific place's real, well-known features. Everyone else gets a
 * prompt assembled from their own real data fields (region, seas,
 * coastline, climate, famousFor) combined with the descriptive phrase for
 * their resolved scene archetype — never a generic "nice city in Turkey"
 * filler, and never an invented landmark.
 *
 * The `outputPath` in each entry matches exactly what
 * src/generated/locationImageManifest.ts looks for, so dropping a
 * generated image at that path is enough for the site to start using it.
 *
 * Usage: npm run prompts:generate
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { provinces } from "../src/data/provinces.ts";
import { districts } from "../src/data/districts.ts";
import { getRegion } from "../src/data/regions.ts";
import {
  resolveProvinceArchetype,
  resolveDistrictArchetype,
  provinceImageOverrides,
  districtImageOverrides,
  PROVINCE_LEVEL_A_SLUGS,
  DISTRICT_LEVEL_A_IDS,
} from "../src/data/locationImageOverrides.ts";

const OUT_PATH = path.resolve(process.cwd(), "content/image-generation-prompts.json");

const NEGATIVE_PROMPT =
  "no incorrect or mismatched city landmarks, no landmarks borrowed from a different Turkish city, " +
  "no sea or mountains where none exist, no deformed or duplicated buildings, no fake or illegible text, " +
  "no invented license plates, no fantasy or non-existent architecture, no exaggerated touristic or fantasy look, " +
  "no generic Western skyline, no unrealistic historic architecture, no watermarks, no logos.";

/** English visual-essence phrase per scene archetype, used to ground generated prompts in real features. */
const ARCHETYPE_DESCRIPTORS: Record<string, string> = {
  "bosphorus-strait": "the Bosphorus strait with a suspension bridge, ferries, and a historic mosque-domed skyline along the shoreline",
  "bosphorus-district-ferry": "a dense Bosphorus-adjacent urban shoreline with passenger ferries and a lively coastal skyline",
  "capital-citadel-steppe": "a hilltop citadel overlooking the dry Central Anatolian steppe",
  "stone-hill-town": "honey-colored stone houses cascading down a hillside above a wide plain",
  "mesopotamian-basalt-city": "dark basalt city walls above a river plain",
  "gap-plain-heritage": "an ancient mound and hilltop citadel above a fertile southeastern Anatolian plain",
  "black-sea-tea-hills": "misty green tea-terraced hills rolling down to the Black Sea coast",
  "uludag-green-city": "a forested mountain backdrop above a green city with a historic mosque",
  "mediterranean-cliff-harbor": "limestone cliffs dropping to a turquoise Mediterranean bay with a historic harbor",
  "aegean-cove-windmill": "whitewashed hillside houses above an Aegean cove with a windmill and sailboats",
  "strait-monument": "a narrow strait with ships passing and a memorial on a coastal headland",
  "fairy-chimney-valley": "cone-shaped fairy chimney rock formations in a valley with hot-air balloons at dawn",
  "anatolian-plain-castle": "a wheat-colored Central Anatolian plain with a hilltop castle and a domed historic center",
  "lake-shore": "a still lake shoreline with a small island and mountains in the distance",
  "eastern-highland-peak": "a dramatic snow-capped peak above a high Eastern Anatolian plateau",
  "central-steppe-salt": "pale, mineral-streaked flats near a salt lake with a distant volcanic cone",
  "industrial-port-bay": "a modern skyline around a working port bay",
  "marmara-green-plain": "a green agricultural plain with a village mosque silhouette",
  "travertine-terraces": "white stepped travertine terraces cascading down a hillside with mineral-blue pools",
};

const PROMPT_PREFIX = "Cinematic panoramic editorial travel photograph representing";
const PROMPT_SUFFIX =
  "premium tourism editorial photography, clean composition with negative space for a website title overlay, " +
  "no text, no logos, no fantasy architecture, no invented monuments, photorealistic, 16:7 aspect ratio.";

/** Turkish sea/strait/lake proper nouns as they appear in seas/coastline fields, in natural English. */
const GEO_NAME_EN: Record<string, string> = {
  Akdeniz: "the Mediterranean Sea",
  "Ege Denizi": "the Aegean Sea",
  Karadeniz: "the Black Sea",
  "Marmara Denizi": "the Sea of Marmara",
  "Çanakkale Boğazı": "the Dardanelles strait",
  "İstanbul Boğazı": "the Bosphorus strait",
  "Van Gölü": "Lake Van",
  "İzmit Körfezi": "İzmit Bay",
  "İzmir Körfezi": "İzmir Bay",
  Boğaziçi: "the Bosphorus",
  Haliç: "the Golden Horn",
  "Küçükçekmece Gölü": "Küçükçekmece Lagoon",
};

function translateGeo(name: string): string {
  return GEO_NAME_EN[name] ?? name;
}

const LEVEL_A_PROVINCE_PROMPTS: Record<string, string> = {
  istanbul:
    `${PROMPT_PREFIX} İstanbul, Turkey, the Bosphorus strait separating Europe and Asia, a suspension bridge, a passenger ferry crossing calm water, Maiden's Tower silhouette near the shore, historic mosque domes and minarets on the skyline, warm late-afternoon light, realistic Istanbul geography and urban density, ${PROMPT_SUFFIX}`,
  ankara:
    `${PROMPT_PREFIX} Ankara, Turkey, the historic Ankara Castle on a rocky hill overlooking the city, the monumental limestone colonnade of Anıtkabir in the middle distance, dry Central Anatolian steppe stretching to the horizon, warm golden-hour light, realistic capital-city density mixing government buildings and older neighborhoods, ${PROMPT_SUFFIX}`,
  izmir:
    `${PROMPT_PREFIX} İzmir, Turkey, the wide İzmir Bay (Körfez) lined with a modern waterfront promenade (Kordon), the İzmir Clock Tower silhouette near the harbor, ferries crossing calm water, bright Aegean daylight, realistic coastal metropolitan density, ${PROMPT_SUFFIX}`,
  bursa:
    `${PROMPT_PREFIX} Bursa, Turkey, the forested slopes of Uludağ mountain rising behind the city, the multi-domed Ulu Cami and Ottoman-era architecture in the foreground, green foothills, soft afternoon light, realistic terrain transitioning from mountain forest to urban streets, ${PROMPT_SUFFIX}`,
  antalya:
    `${PROMPT_PREFIX} Antalya, Turkey, dramatic limestone cliffs (falezler) dropping into the turquoise Mediterranean Sea, the old harbor of Kaleiçi with historic stone buildings, the Taurus Mountains faint on the horizon, bright Mediterranean daylight, realistic coastal terrain, ${PROMPT_SUFFIX}`,
  adana:
    `${PROMPT_PREFIX} Adana, Turkey, the historic stone Taşköprü bridge over the Seyhan River, the wide domes of a large modern mosque on the riverbank, the flat fertile Çukurova plain surrounding the city, warm southern daylight, realistic river-city density, ${PROMPT_SUFFIX}`,
  konya:
    `${PROMPT_PREFIX} Konya, Turkey, the turquoise-tiled conical dome of the Mevlana Museum rising above the historic center, the vast flat Konya plain stretching to the horizon, warm dry daylight, realistic Central Anatolian city density, ${PROMPT_SUFFIX}`,
  gaziantep:
    `${PROMPT_PREFIX} Gaziantep, Turkey, the ancient hilltop Gaziantep Castle overlooking the old city, dense traditional stone houses, pistachio groves on the fertile plain nearby, warm terracotta-toned light, realistic southeastern Anatolian urban texture, ${PROMPT_SUFFIX}`,
  mardin:
    `${PROMPT_PREFIX} Mardin, Turkey, authentic honey-colored stone houses cascading down the hillside, traditional Mesopotamian architecture, wide view toward the Mesopotamian plain, warm natural late-afternoon sunlight, realistic terrain and urban density, ${PROMPT_SUFFIX}`,
  trabzon:
    `${PROMPT_PREFIX} Trabzon, Turkey, green tea-terraced hills rising steeply from the Black Sea coastline, mist over the valleys, a fishing harbor with small boats, cool humid daylight, realistic Black Sea coastal terrain, ${PROMPT_SUFFIX}`,
  van:
    `${PROMPT_PREFIX} Van, Turkey, the vast turquoise waters of Lake Van, Akdamar Island with its historic Armenian church visible offshore, snow-capped mountains in the distance, crisp high-altitude daylight, realistic Eastern Anatolian lake terrain, ${PROMPT_SUFFIX}`,
  erzurum:
    `${PROMPT_PREFIX} Erzurum, Turkey, the snow-capped peaks of the Palandöken mountains above a high Eastern Anatolian plateau city, twin Seljuk minarets (Çifte Minareli Medrese) silhouette in the historic center, crisp cold-climate daylight, realistic high-plateau terrain, ${PROMPT_SUFFIX}`,
  canakkale:
    `${PROMPT_PREFIX} Çanakkale, Turkey, the narrow Dardanelles strait (Çanakkale Boğazı) with ships passing, a war memorial on a coastal headland, a lighthouse, warm maritime dusk light, realistic strait geography, ${PROMPT_SUFFIX}`,
  mugla:
    `${PROMPT_PREFIX} Muğla, Turkey, whitewashed hillside houses above a turquoise Aegean cove, a traditional windmill silhouette, pine-covered hills, sailboats on calm water, bright Aegean daylight, realistic coastal terrain, ${PROMPT_SUFFIX}`,
  aydin:
    `${PROMPT_PREFIX} Aydın, Turkey, terraced olive groves on hillsides above the Aegean coastline, a quiet whitewashed coastal town, warm golden Aegean light, realistic agricultural coastal terrain, ${PROMPT_SUFFIX}`,
  denizli:
    `${PROMPT_PREFIX} Denizli, Turkey, the white stepped travertine terraces of Pamukkale cascading down a hillside with mineral-blue pools, ancient Hierapolis ruin columns at the crest, bright warm daylight, realistic travertine terrain, ${PROMPT_SUFFIX}`,
  nevsehir:
    `${PROMPT_PREFIX} Nevşehir, Turkey, cone-shaped fairy chimney rock formations across a Cappadocian valley, dozens of hot-air balloons drifting at sunrise, soft pastel dawn light, realistic volcanic-rock terrain, ${PROMPT_SUFFIX}`,
  samsun:
    `${PROMPT_PREFIX} Samsun, Turkey, a wide Black Sea coastline with green hills behind the city, a historic monument on the waterfront promenade, bright coastal daylight, realistic Black Sea urban-coastal terrain, ${PROMPT_SUFFIX}`,
  eskisehir:
    `${PROMPT_PREFIX} Eskişehir, Turkey, the Porsuk River canal lined with colorful Odunpazarı Ottoman-era houses, a wide Central Anatolian plain beyond the city, soft daylight, realistic riverside university-town texture, ${PROMPT_SUFFIX}`,
  diyarbakir:
    `${PROMPT_PREFIX} Diyarbakır, Turkey, the massive black basalt city walls (Diyarbakır Surları) above the Tigris river plain, dense traditional dark-stone architecture, warm afternoon light, realistic southeastern Anatolian urban terrain, ${PROMPT_SUFFIX}`,
  sanliurfa:
    `${PROMPT_PREFIX} Şanlıurfa, Turkey, an ancient hilltop citadel above the old city, the sacred Balıklıgöl pool area, the fertile plain beyond, warm golden light, realistic southeastern Anatolian heritage terrain, ${PROMPT_SUFFIX}`,
};

const LEVEL_A_DISTRICT_PROMPTS: Record<string, string> = {
  "istanbul-kadikoy":
    "Cinematic panoramic editorial photograph representing Kadıköy, Istanbul, authentic Bosphorus shoreline, passenger ferry, dense but elegant urban fabric, subtle historic buildings, lively coastal atmosphere, natural daylight, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-besiktas":
    "Cinematic panoramic editorial photograph representing Beşiktaş, Istanbul, a Bosphorus-shore neighborhood with a passenger ferry pier, the Bosphorus Bridge visible in the distance, dense elegant waterfront buildings, natural daylight, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-uskudar":
    "Cinematic panoramic editorial photograph representing Üsküdar, Istanbul, the Asian shore of the Bosphorus with Maiden's Tower (Kız Kulesi) visible just offshore, historic mosque silhouettes along the waterfront, calm morning light, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-bakirkoy":
    "Cinematic panoramic editorial photograph representing Bakırköy, Istanbul, a Sea of Marmara coastal district with a seaside promenade, dense mid-rise residential blocks, calm daylight, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-fatih":
    "Cinematic panoramic editorial photograph representing Fatih, Istanbul's historic peninsula, Ottoman-era mosque domes and minarets along the skyline, dense historic urban fabric, the Golden Horn nearby, warm daylight, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-beyoglu":
    "Cinematic panoramic editorial photograph representing Beyoğlu, Istanbul, a dense European-side district overlooking the Golden Horn and the Bosphorus, a mix of 19th-century buildings and modern rooftops, evening light, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-sisli":
    "Cinematic panoramic editorial photograph representing Şişli, Istanbul, a dense modern business district skyline with mid-rise and high-rise office towers, daylight haze typical of a major metropolitan center, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-atasehir":
    "Cinematic panoramic editorial photograph representing Ataşehir, Istanbul, a modern Anatolian-side financial district with glass office towers, clear daylight, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-basaksehir":
    "Cinematic panoramic editorial photograph representing Başakşehir, Istanbul, a green, modern residential district with planned housing blocks and open parkland, calm daylight, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "istanbul-buyukcekmece":
    "Cinematic panoramic editorial photograph representing Büyükçekmece, Istanbul, a Sea of Marmara coastal district with a lagoon-like bay, a bridge over the water, quiet coastal daylight, realistic Istanbul geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "ankara-cankaya":
    "Cinematic panoramic editorial photograph representing Çankaya, Ankara, the government and diplomatic heart of the capital, Ankara Castle visible on a distant hill, dry Central Anatolian steppe at the horizon, warm daylight, realistic Ankara geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "ankara-kecioren":
    "Cinematic panoramic editorial photograph representing Keçiören, Ankara, a hillside residential district on the northern edge of the capital, dry steppe hills behind dense housing, warm daylight, realistic Ankara geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "izmir-konak":
    "Cinematic panoramic editorial photograph representing Konak, İzmir, the historic waterfront district with the İzmir Clock Tower on the bay (Kordon), ferries crossing the water, bright Aegean daylight, realistic İzmir geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "izmir-karsiyaka":
    "Cinematic panoramic editorial photograph representing Karşıyaka, İzmir, a lively waterfront district across İzmir Bay from Konak, a seaside promenade with palm trees, bright daylight, realistic İzmir geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "mugla-bodrum":
    "Cinematic panoramic editorial photograph representing Bodrum, Muğla, whitewashed houses cascading toward a turquoise Aegean cove, a traditional windmill silhouette on a ridge, sailboats in the marina, bright Aegean daylight, realistic Bodrum peninsula geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "izmir-cesme":
    "Cinematic panoramic editorial photograph representing Çeşme, İzmir, whitewashed Aegean coastal houses, a historic seaside castle, turquoise water and sailboats, bright daylight, realistic Çeşme peninsula geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "antalya-alanya":
    "Cinematic panoramic editorial photograph representing Alanya, Antalya, the hilltop Alanya Castle on a peninsula jutting into the turquoise Mediterranean, red-tile-roofed old town below, bright coastal daylight, realistic Alanya geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "antalya-muratpasa":
    "Cinematic panoramic editorial photograph representing Muratpaşa, Antalya, the central Antalya coastline with limestone falez cliffs above the Mediterranean, a modern resort-city skyline, bright daylight, realistic Antalya geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "mardin-artuklu":
    "Cinematic panoramic editorial photograph representing Artuklu, Mardin, the historic honey-stone old city of Mardin cascading down the hillside toward the Mesopotamian plain, warm late-afternoon light, realistic Mardin geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "mardin-midyat":
    "Cinematic panoramic editorial photograph representing Midyat, Mardin, honey-colored carved stone houses and courtyards in a historic Syriac old town, the Mesopotamian plain in the distance, warm daylight, realistic Midyat geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
  "trabzon-ortahisar":
    "Cinematic panoramic editorial photograph representing Ortahisar, Trabzon, the historic central district of Trabzon between green tea-terraced hills and the Black Sea coastline, misty daylight, realistic Trabzon geography, premium editorial travel photography, clean space for website heading overlay, no text, no logos, no invented landmarks, photorealistic, 16:7 aspect ratio.",
};

function buildGeneratedPrompt(params: {
  name: string;
  sceneKey: string;
  regionName: string;
  seas?: string[];
  coastline?: string[];
  climate?: string[];
  famousFor?: { label: string }[];
}): string {
  const descriptor = ARCHETYPE_DESCRIPTORS[params.sceneKey] ?? ARCHETYPE_DESCRIPTORS["anatolian-plain-castle"];
  const extras: string[] = [];
  if (params.seas?.length) extras.push(`along ${params.seas.map(translateGeo).join(" and ")}`);
  if (params.coastline?.length) extras.push(`with a coastline on ${params.coastline.map(translateGeo).join(" and ")}`);
  if (params.climate?.length) extras.push(params.climate.join(", "));
  if (params.famousFor?.length) {
    extras.push(`known locally for ${params.famousFor.slice(0, 2).map((f) => f.label).join(" and ")}`);
  }
  const extraClause = extras.length ? `, ${extras.join(", ")}` : "";
  return (
    `${PROMPT_PREFIX} ${params.name}, Turkey, ${descriptor}${extraClause}, ` +
    `realistic terrain and urban density true to the ${params.regionName}, ${PROMPT_SUFFIX}`
  );
}

interface PromptEntry {
  location: string;
  slug: string;
  type: "province" | "district";
  tier: "A" | "B" | "C";
  prompt: string;
  negativePrompt: string;
  aspectRatio: "16:7";
  alt: string;
  outputPath: string;
}

function naturalAlt(name: string, place: string): string {
  return `${name}, ${place}`;
}

async function main() {
  const entries: PromptEntry[] = [];

  for (const province of provinces) {
    const resolved = resolveProvinceArchetype(province);
    const override = provinceImageOverrides[province.slug];
    const sceneKey = override?.sceneKey ?? resolved.sceneKey;
    const region = getRegion(province.region);
    const isLevelA = (PROVINCE_LEVEL_A_SLUGS as readonly string[]).includes(province.slug);
    const prompt =
      LEVEL_A_PROVINCE_PROMPTS[province.slug] ??
      buildGeneratedPrompt({
        name: province.name,
        sceneKey,
        regionName: region?.name ?? "Turkey",
        seas: province.seas,
        climate: province.climate,
        famousFor: province.famousFor,
      });
    entries.push({
      location: province.name,
      slug: province.slug,
      type: "province",
      tier: isLevelA ? "A" : "B",
      prompt,
      negativePrompt: NEGATIVE_PROMPT,
      aspectRatio: "16:7",
      alt: override?.alt ?? naturalAlt(province.name, region?.name ?? "Türkiye"),
      outputPath: `src/assets/locations/provinces/${province.slug}/hero-ai.jpg`,
    });
  }

  for (const district of districts) {
    const province = provinces.find((p) => p.slug === district.provinceSlug);
    if (!province) continue;
    const provinceResolved = resolveProvinceArchetype(province);
    const provinceOverride = provinceImageOverrides[province.slug];
    const effectiveProvinceSceneKey = provinceOverride?.sceneKey ?? provinceResolved.sceneKey;
    const { sceneKey, tier } = resolveDistrictArchetype(district, effectiveProvinceSceneKey);
    const override = districtImageOverrides[district.id];
    const region = getRegion(province.region);
    const isLevelA = (DISTRICT_LEVEL_A_IDS as readonly string[]).includes(district.id);
    const prompt =
      LEVEL_A_DISTRICT_PROMPTS[district.id] ??
      buildGeneratedPrompt({
        name: `${district.name}, ${province.name}`,
        sceneKey: override?.sceneKey ?? sceneKey,
        regionName: region?.name ?? "Turkey",
        coastline: district.coastline,
        climate: district.climate,
      });
    entries.push({
      location: `${district.name}, ${province.name}`,
      slug: district.slug,
      type: "district",
      tier: isLevelA ? "A" : tier,
      prompt,
      negativePrompt: NEGATIVE_PROMPT,
      aspectRatio: "16:7",
      alt: override?.alt ?? naturalAlt(district.name, province.name),
      outputPath: `src/assets/locations/districts/${district.provinceSlug}/${district.slug}/hero-ai.jpg`,
    });
  }

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(entries, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${entries.length} prompts to ${path.relative(process.cwd(), OUT_PATH)}`);
  console.log(
    `  Level A (hand-authored): ${entries.filter((e) => e.tier === "A").length}, ` +
      `Level B (data-derived): ${entries.filter((e) => e.tier === "B").length}, ` +
      `Level C (inherited): ${entries.filter((e) => e.tier === "C").length}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
