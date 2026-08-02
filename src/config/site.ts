export const siteConfig = {
  name: "illerilceler.com",
  shortName: "İller İlçeler",
  title: "İller İlçeler — Türkiye Bilgi Merkezi",
  titleTemplate: "%s | illerilceler.com",
  description:
    "Türkiye'nin illeri, ilçeleri, mahalleleri, plaka kodları, alan kodları, posta kodları ve coğrafi bilgileri tek platformda. 81 il, 973 ilçe, 32.000+ mahalle hakkında güncel bilgi.",
  tagline: "Türkiye Bilgi Merkezi",
  locale: "tr-TR",
  language: "tr",
  url: "https://illerilceler.com",
  ogImage: "/images/og-default.svg",
  themeColor: "#635BFF",
  twitterHandle: "@illerilceler",
  social: {
    instagram: "https://instagram.com/illerilceler",
    facebook: "https://facebook.com/illerilceler",
    twitter: "https://twitter.com/illerilceler",
    youtube: "https://youtube.com/@illerilceler",
  },
  contactEmail: "iletisim@illerilceler.com",
  stats: {
    provinces: "81",
    districts: "973",
    neighborhoods: "32.000+",
    villages: "18.000+",
    plateCodes: "81",
    areaCodes: "100+",
  },
  disclaimer:
    "Bilgiler bilgilendirme amacıyla sunulur. Resmî işlemler için ilgili kurumların güncel açıklamalarını kontrol ediniz.",
} as const;

export type SiteConfig = typeof siteConfig;
