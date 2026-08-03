/**
 * Hand-curated image tiering for province/district hero art.
 *
 * - Level A (highest-traffic provinces/districts): explicit archetype pick
 *   + natural alt text authored for that specific place.
 * - Level B: archetype derived from that location's own real data (region,
 *   seas, coastline) — not hand-curated, but not a copy-paste fallback either.
 * - Level C: no differentiating signal available; district inherits its
 *   province's archetype (see locationImageManifest.ts for how this maps to
 *   the `type: "fallback"` tier from the LocationImage model).
 *
 * All of this only selects a *scene key* for the stylized illustration tier
 * (see sceneArchetypes.js) and supplies curated alt/caption/focal-point text
 * — it never claims to be a real photograph.
 */
import type { Province, District, FocalPoint, ImageCredit, ImageAIMetadata } from "@/types";
import { archetypeKeys } from "./sceneArchetypes.js";

export interface ProvinceImageOverride {
  sceneKey: string;
  alt: string;
  caption?: string;
  focalPoint?: FocalPoint;
  /** Fill in once a real photo is dropped into src/assets/locations/provinces/<slug>/hero-real.*. */
  credit?: ImageCredit;
  /** Fill in once an AI-generated photo is dropped into .../hero-ai.*. */
  aiMetadata?: ImageAIMetadata;
}

export interface DistrictImageOverride {
  sceneKey: string;
  alt: string;
  caption?: string;
  focalPoint?: FocalPoint;
  credit?: ImageCredit;
  aiMetadata?: ImageAIMetadata;
}

/** 21 provinces the product brief calls out as highest-traffic. */
export const PROVINCE_LEVEL_A_SLUGS = [
  "istanbul",
  "ankara",
  "izmir",
  "bursa",
  "antalya",
  "adana",
  "konya",
  "gaziantep",
  "mardin",
  "trabzon",
  "van",
  "erzurum",
  "canakkale",
  "mugla",
  "aydin",
  "denizli",
  "nevsehir",
  "samsun",
  "eskisehir",
  "diyarbakir",
  "sanliurfa",
] as const;

/** 21 highest-traffic districts (id = `${provinceSlug}-${districtSlug}`). */
export const DISTRICT_LEVEL_A_IDS = [
  "istanbul-kadikoy",
  "istanbul-besiktas",
  "istanbul-uskudar",
  "istanbul-bakirkoy",
  "istanbul-fatih",
  "istanbul-beyoglu",
  "istanbul-sisli",
  "istanbul-atasehir",
  "istanbul-basaksehir",
  "istanbul-buyukcekmece",
  "ankara-cankaya",
  "ankara-kecioren",
  "izmir-konak",
  "izmir-karsiyaka",
  "mugla-bodrum",
  "izmir-cesme",
  "antalya-alanya",
  "antalya-muratpasa",
  "mardin-artuklu",
  "mardin-midyat",
  "trabzon-ortahisar",
] as const;

/**
 * Explicit province → archetype picks where the generic region/sea rule
 * below would undersell (or misrepresent) a province's real identity.
 */
const PROVINCE_ARCHETYPE_OVERRIDES: Record<string, string> = {
  istanbul: "bosphorus-strait",
  ankara: "capital-citadel-steppe",
  izmir: "industrial-port-bay",
  bursa: "uludag-green-city",
  kocaeli: "industrial-port-bay",
  yalova: "industrial-port-bay",
  mardin: "stone-hill-town",
  van: "lake-shore",
  canakkale: "strait-monument",
  denizli: "travertine-terraces",
  nevsehir: "fairy-chimney-valley",
  diyarbakir: "mesopotamian-basalt-city",
  aksaray: "central-steppe-salt",
  nigde: "fairy-chimney-valley",
  karaman: "anatolian-plain-castle",
  bayburt: "eastern-highland-peak",
  gumushane: "eastern-highland-peak",
};

function seaBasedArchetype(seas: string[] | undefined): string | null {
  if (!seas || seas.length === 0) return null;
  if (seas.includes("Van Gölü")) return "lake-shore";
  if (seas.includes("Çanakkale Boğazı")) return "strait-monument";
  if (seas.includes("İstanbul Boğazı")) return "bosphorus-strait";
  if (seas.includes("Akdeniz")) return "mediterranean-cliff-harbor";
  if (seas.includes("Ege Denizi")) return "aegean-cove-windmill";
  if (seas.includes("Karadeniz")) return "black-sea-tea-hills";
  if (seas.includes("İzmit Körfezi")) return "industrial-port-bay";
  if (seas.includes("Marmara Denizi")) return "marmara-green-plain";
  return null;
}

function regionBasedArchetype(region: string): string {
  switch (region) {
    case "ic-anadolu":
      return "anatolian-plain-castle";
    case "dogu-anadolu":
      return "eastern-highland-peak";
    case "guneydogu-anadolu":
      return "gap-plain-heritage";
    case "karadeniz":
      return "anatolian-plain-castle"; // landlocked Karadeniz-region provinces (Amasya, Tokat, Çorum…)
    case "marmara":
      return "marmara-green-plain";
    case "akdeniz":
      return "lake-shore"; // inland Akdeniz-region provinces without a coastline (Isparta, Burdur)
    case "ege":
    default:
      return "anatolian-plain-castle";
  }
}

/**
 * Resolve a province's scene archetype: explicit override > its own seas
 * data > its own region data. Every one of the 81 provinces gets a pick
 * grounded in its own real fields — none of them literally borrow another
 * province's choice.
 */
export function resolveProvinceArchetype(province: Province): {
  sceneKey: string;
  tier: "A" | "B";
} {
  const tier: "A" | "B" = (PROVINCE_LEVEL_A_SLUGS as readonly string[]).includes(province.slug)
    ? "A"
    : "B";
  const override = PROVINCE_ARCHETYPE_OVERRIDES[province.slug];
  const sceneKey =
    override ?? seaBasedArchetype(province.seas) ?? regionBasedArchetype(province.region);
  return { sceneKey: archetypeKeys.includes(sceneKey) ? sceneKey : "anatolian-plain-castle", tier };
}

function districtCoastArchetype(
  coastline: string[] | undefined,
  provinceSlug: string,
): string | null {
  if (!coastline || coastline.length === 0) return null;
  const has = (needle: string) => coastline.some((c) => c.includes(needle));
  if (provinceSlug === "istanbul" && (has("Boğaziçi") || has("Haliç") || has("Marmara"))) {
    return "bosphorus-district-ferry";
  }
  if (has("İzmir Körfezi")) return "industrial-port-bay";
  if (has("Akdeniz")) return "mediterranean-cliff-harbor";
  if (has("Ege")) return "aegean-cove-windmill";
  if (has("Karadeniz")) return "black-sea-tea-hills";
  if (has("Göl")) return "lake-shore";
  if (has("Marmara")) {
    return provinceSlug === "kocaeli" || provinceSlug === "yalova"
      ? "industrial-port-bay"
      : "marmara-green-plain";
  }
  return null;
}

/**
 * Resolve a district's scene archetype and tier.
 * tier "B" = the district's own coastline data changed the pick;
 * tier "C" = no differentiating signal, inherits the province's archetype.
 */
export function resolveDistrictArchetype(
  district: District,
  provinceArchetypeKey: string,
): { sceneKey: string; tier: "A" | "B" | "C" } {
  if ((DISTRICT_LEVEL_A_IDS as readonly string[]).includes(district.id)) {
    return { sceneKey: districtImageOverrides[district.id]!.sceneKey, tier: "A" };
  }
  const coastPick = districtCoastArchetype(district.coastline, district.provinceSlug);
  if (coastPick && coastPick !== provinceArchetypeKey) {
    return { sceneKey: coastPick, tier: "B" };
  }
  return { sceneKey: provinceArchetypeKey, tier: "C" };
}

export const provinceImageOverrides: Record<string, ProvinceImageOverride> = {
  istanbul: {
    sceneKey: "bosphorus-strait",
    alt: "İstanbul Boğazı, köprü ve tarihi şehir silüeti",
    caption: "İstanbul Boğazı'nın köprü ve Kız Kulesi ile tarihi silüeti",
    focalPoint: { x: 58, y: 55 },
  },
  ankara: {
    sceneKey: "capital-citadel-steppe",
    alt: "Ankara Kalesi ve İç Anadolu bozkırı",
    caption: "Ankara Kalesi ve başkentin bozkır manzarası",
    focalPoint: { x: 45, y: 55 },
  },
  izmir: {
    sceneKey: "industrial-port-bay",
    alt: "İzmir Körfezi ve kıyı silüeti",
    caption: "İzmir Körfezi'nden kıyı şeridi görünümü",
    focalPoint: { x: 50, y: 55 },
  },
  bursa: {
    sceneKey: "uludag-green-city",
    alt: "Uludağ eteklerinde Bursa ve Ulu Cami silüeti",
    caption: "Uludağ'ın eteğinde yeşil şehir ve tarihi cami silüeti",
    focalPoint: { x: 55, y: 60 },
  },
  antalya: {
    sceneKey: "mediterranean-cliff-harbor",
    alt: "Antalya falezleri ve Akdeniz kıyısı",
    caption: "Antalya'nın falezleri ve tarihi liman kıyısı",
    focalPoint: { x: 52, y: 60 },
  },
  adana: {
    sceneKey: "mediterranean-cliff-harbor",
    alt: "Adana ve Akdeniz kıyı şeridi",
    caption: "Çukurova'nın Akdeniz'e uzanan kıyı şeridi",
    focalPoint: { x: 48, y: 58 },
  },
  konya: {
    sceneKey: "anatolian-plain-castle",
    alt: "Konya ovası ve kubbeli tarihi merkez",
    caption: "Konya ovası, kale ve kubbeli tarihi merkez silüeti",
    focalPoint: { x: 55, y: 55 },
  },
  gaziantep: {
    sceneKey: "gap-plain-heritage",
    alt: "Gaziantep Kalesi ve verimli GAP ovası",
    caption: "Gaziantep Kalesi ve çevresindeki verimli ova",
    focalPoint: { x: 45, y: 58 },
  },
  mardin: {
    sceneKey: "stone-hill-town",
    alt: "Mardin'in taş teraslı evleri ve Mezopotamya Ovası",
    caption: "Mardin'in yamaca kurulu taş evleri ve önündeki ova",
    focalPoint: { x: 62, y: 55 },
  },
  trabzon: {
    sceneKey: "black-sea-tea-hills",
    alt: "Trabzon'da yeşil yaylalar ve Karadeniz kıyısı",
    caption: "Trabzon'un yeşil tepeleri ve Karadeniz kıyısı",
    focalPoint: { x: 50, y: 50 },
  },
  van: {
    sceneKey: "lake-shore",
    alt: "Van Gölü kıyısı ve kar zirveleri",
    caption: "Van Gölü'nden ada ve kar zirveleri manzarası",
    focalPoint: { x: 55, y: 55 },
  },
  erzurum: {
    sceneKey: "eastern-highland-peak",
    alt: "Erzurum'da karlı doruklar ve yüksek yayla",
    caption: "Erzurum'un karlı dorukları ve yüksek platosu",
    focalPoint: { x: 50, y: 45 },
  },
  canakkale: {
    sceneKey: "strait-monument",
    alt: "Çanakkale Boğazı ve şehitlik anıtı",
    caption: "Çanakkale Boğazı ve anıtın yer aldığı kıyı",
    focalPoint: { x: 68, y: 55 },
  },
  mugla: {
    sceneKey: "aegean-cove-windmill",
    alt: "Muğla'da Ege koyu ve beyaz badanalı evler",
    caption: "Ege kıyısında badanalı evler ve yel değirmeni",
    focalPoint: { x: 45, y: 55 },
  },
  aydin: {
    sceneKey: "aegean-cove-windmill",
    alt: "Aydın'da Ege kıyısı ve zeytinlik yamaçlar",
    caption: "Aydın'ın Ege kıyısı ve zeytinlik yamaçları",
    focalPoint: { x: 45, y: 55 },
  },
  denizli: {
    sceneKey: "travertine-terraces",
    alt: "Pamukkale traverten terasları, Denizli",
    caption: "Pamukkale'nin beyaz traverten terasları",
    focalPoint: { x: 50, y: 55 },
  },
  nevsehir: {
    sceneKey: "fairy-chimney-valley",
    alt: "Nevşehir'de peri bacaları ve sıcak hava balonları",
    caption: "Kapadokya vadisinde peri bacaları ve balonlar",
    focalPoint: { x: 50, y: 45 },
  },
  samsun: {
    sceneKey: "black-sea-tea-hills",
    alt: "Samsun'da Karadeniz kıyısı ve yeşil tepeler",
    caption: "Samsun'un Karadeniz kıyısı ve yeşil tepeleri",
    focalPoint: { x: 50, y: 50 },
  },
  eskisehir: {
    sceneKey: "anatolian-plain-castle",
    alt: "Eskişehir ovası ve tarihi merkez silüeti",
    caption: "Eskişehir ovası ve tarihi merkezin silüeti",
    focalPoint: { x: 50, y: 55 },
  },
  diyarbakir: {
    sceneKey: "mesopotamian-basalt-city",
    alt: "Diyarbakır'ın bazalt surları ve Dicle Ovası",
    caption: "Diyarbakır'ın tarihi bazalt surları ve nehir ovası",
    focalPoint: { x: 45, y: 58 },
  },
  sanliurfa: {
    sceneKey: "gap-plain-heritage",
    alt: "Şanlıurfa'da höyükler ve GAP ovası",
    caption: "Şanlıurfa çevresindeki höyükler ve verimli ova",
    focalPoint: { x: 55, y: 58 },
  },
};

export const districtImageOverrides: Record<string, DistrictImageOverride> = {
  "istanbul-kadikoy": {
    sceneKey: "bosphorus-district-ferry",
    alt: "Kadıköy sahili ve İstanbul vapuru",
    caption: "Kadıköy sahilinde vapur ve kıyı silüeti",
    focalPoint: { x: 55, y: 60 },
  },
  "istanbul-besiktas": {
    sceneKey: "bosphorus-strait",
    alt: "Beşiktaş sahili, Boğaz ve vapur iskelesi",
    caption: "Beşiktaş'tan Boğaz ve köprü manzarası",
    focalPoint: { x: 55, y: 55 },
  },
  "istanbul-uskudar": {
    sceneKey: "bosphorus-strait",
    alt: "Üsküdar sahilinden Kız Kulesi manzarası",
    caption: "Üsküdar sahili ve karşısındaki Kız Kulesi",
    focalPoint: { x: 70, y: 58 },
  },
  "istanbul-bakirkoy": {
    sceneKey: "bosphorus-district-ferry",
    alt: "Bakırköy sahili ve Marmara Denizi",
    caption: "Bakırköy'ün Marmara Denizi'ne kıyısı",
    focalPoint: { x: 50, y: 60 },
  },
  "istanbul-fatih": {
    sceneKey: "bosphorus-strait",
    alt: "Fatih'te tarihi yarımadanın silüeti",
    caption: "Tarihi yarımadadan cami silüetleri",
    focalPoint: { x: 35, y: 52 },
  },
  "istanbul-beyoglu": {
    sceneKey: "bosphorus-district-ferry",
    alt: "Beyoğlu'ndan Boğaz ve Haliç manzarası",
    caption: "Beyoğlu yakasından kıyı silüeti",
    focalPoint: { x: 50, y: 55 },
  },
  "istanbul-sisli": {
    sceneKey: "bosphorus-district-ferry",
    alt: "Şişli'nin modern iş merkezi silüeti",
    caption: "Şişli'nin modern gökdelen silüeti",
    focalPoint: { x: 50, y: 50 },
  },
  "istanbul-atasehir": {
    sceneKey: "bosphorus-district-ferry",
    alt: "Ataşehir finans merkezi silüeti",
    caption: "Ataşehir'in finans merkezi kuleleri",
    focalPoint: { x: 50, y: 48 },
  },
  "istanbul-basaksehir": {
    sceneKey: "marmara-green-plain",
    alt: "Başakşehir'de yeşil alanlar ve modern yerleşim",
    caption: "Başakşehir'in yeşil alanları ve modern yerleşimi",
    focalPoint: { x: 50, y: 55 },
  },
  "istanbul-buyukcekmece": {
    sceneKey: "bosphorus-district-ferry",
    alt: "Büyükçekmece sahili ve gölü",
    caption: "Büyükçekmece'nin sahili ve gölü",
    focalPoint: { x: 50, y: 58 },
  },
  "ankara-cankaya": {
    sceneKey: "capital-citadel-steppe",
    alt: "Çankaya'dan Ankara Kalesi ve bozkır manzarası",
    caption: "Çankaya'dan başkentin bozkır manzarası",
    focalPoint: { x: 45, y: 55 },
  },
  "ankara-kecioren": {
    sceneKey: "capital-citadel-steppe",
    alt: "Keçiören ve Ankara'nın kuzey silüeti",
    caption: "Keçiören'den Ankara'nın kuzey silüeti",
    focalPoint: { x: 48, y: 55 },
  },
  "izmir-konak": {
    sceneKey: "industrial-port-bay",
    alt: "Konak sahili ve İzmir Saat Kulesi",
    caption: "Konak sahilinden İzmir Körfezi manzarası",
    focalPoint: { x: 50, y: 58 },
  },
  "izmir-karsiyaka": {
    sceneKey: "industrial-port-bay",
    alt: "Karşıyaka'dan İzmir Körfezi manzarası",
    caption: "Karşıyaka sahilinden körfez manzarası",
    focalPoint: { x: 50, y: 58 },
  },
  "mugla-bodrum": {
    sceneKey: "aegean-cove-windmill",
    alt: "Bodrum koyu, beyaz evler ve yel değirmeni",
    caption: "Bodrum koyunda beyaz evler ve yel değirmeni",
    focalPoint: { x: 55, y: 55 },
  },
  "izmir-cesme": {
    sceneKey: "aegean-cove-windmill",
    alt: "Çeşme sahili ve Ege kıyısı",
    caption: "Çeşme'nin Ege kıyısı ve badanalı evleri",
    focalPoint: { x: 45, y: 55 },
  },
  "antalya-alanya": {
    sceneKey: "mediterranean-cliff-harbor",
    alt: "Alanya Kalesi ve Akdeniz kıyısı",
    caption: "Alanya Kalesi'nin bulunduğu falez ve kıyı",
    focalPoint: { x: 55, y: 58 },
  },
  "antalya-muratpasa": {
    sceneKey: "mediterranean-cliff-harbor",
    alt: "Muratpaşa sahili ve Antalya falezleri",
    caption: "Muratpaşa'dan Antalya falezleri manzarası",
    focalPoint: { x: 50, y: 58 },
  },
  "mardin-artuklu": {
    sceneKey: "stone-hill-town",
    alt: "Artuklu'da Mardin'in taş evleri",
    caption: "Artuklu'da Mardin'in tarihi taş evleri",
    focalPoint: { x: 60, y: 55 },
  },
  "mardin-midyat": {
    sceneKey: "stone-hill-town",
    alt: "Midyat'ın taş mimarisi ve Mezopotamya Ovası",
    caption: "Midyat'ın taş mimarisi ve önündeki ova",
    focalPoint: { x: 60, y: 55 },
  },
  "trabzon-ortahisar": {
    sceneKey: "black-sea-tea-hills",
    alt: "Ortahisar'dan Karadeniz ve yeşil tepeler",
    caption: "Ortahisar'dan Karadeniz kıyısı ve yeşil tepeler",
    focalPoint: { x: 50, y: 50 },
  },
};
