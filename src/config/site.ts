export const siteConfig = {
  name: "illerilceler.com",
  shortName: "İller İlçeler",
  title: "İller İlçeler — Türkiye'nin 81 İli ve 973 İlçesi",
  titleTemplate: "%s | İller İlçeler",
  description:
    "Türkiye'nin 81 ili ve 973 ilçesi: güncel TÜİK 2025 nüfusu, yüzölçümü, plaka kodu, telefon alan kodu, posta kodu, komşu iller, harita ve iller arası mesafeler.",
  tagline: "Türkiye Bilgi Merkezi",
  locale: "tr-TR",
  language: "tr",
  /** Canonical origin — resolved in astro.config.mjs (SITE_URL → Netlify URL → fallback). */
  url: ((import.meta.env?.SITE as string | undefined) ?? "https://illerilceler.com").replace(
    /\/$/,
    "",
  ),
  ogImage: "/og/default.png",
  themeColor: "#C8102E",
  /**
   * Official social profiles. Leave empty until an account really exists —
   * these URLs are published in Organization.sameAs structured data.
   */
  social: {} as Record<string, string>,
  contactEmail: "iletisim@illerilceler.com",
  stats: {
    provinces: "81",
    districts: "973",
    plateCodes: "81",
  },
  disclaimer:
    "Bilgiler bilgilendirme amaçlıdır; resmî işlemler için ilgili kurumların güncel duyurularını esas alınız.",
} as const;

export type SiteConfig = typeof siteConfig;
