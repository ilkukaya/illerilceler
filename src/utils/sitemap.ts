/**
 * Sitemap sections. /sitemap.xml is an index pointing at one file per
 * section, so Search Console reports indexing per page type (il, ilçe,
 * mesafe…) and no single file approaches the 50,000-URL limit.
 */
import { siteConfig } from "@/config/site";
import { provinces } from "@/data/provinces";
import { districts } from "@/data/districts";
import { plateCodes } from "@/data/plateCodes";
import { areaCodes } from "@/data/areaCodes";
import { postalCodes } from "@/data/postalCodes";
import { getProvinceImage, getDistrictImage } from "@/generated/locationImageManifest";
import { distancePath } from "@/utils/links";

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  image?: { loc: string; title: string };
}

const BUILD_DATE = new Date().toISOString().slice(0, 10);

const corePaths = [
  "/",
  "/iller/",
  "/ilceler/",
  "/mahalleler/",
  "/plaka-kodlari/",
  "/alan-kodlari/",
  "/posta-kodlari/",
  "/haritalar/",
  "/haritalar/turkiye-haritasi/",
  "/istatistikler/",
  "/istatistikler/en-kalabalik-iller/",
  "/istatistikler/yuzolcumune-gore-en-buyuk-iller/",
  "/istatistikler/nufus-yogunluguna-gore-iller/",
  "/istatistikler/rakima-gore-iller/",
  "/istatistikler/en-cok-ilcesi-olan-iller/",
  "/istatistikler/en-kalabalik-ilceler/",
  "/mesafe/",
  "/egitim/",
  "/egitim/quiz/",
  "/egitim/81-il-ve-plakalari/",
  "/araclar/",
  "/araclar/iki-sehir-arasi-mesafe/",
  "/araclar/gunes-dogusu-batisi/",
  "/acik-veri/",
  "/hakkimizda/",
  "/rehber/",
  "/iletisim/",
  "/gizlilik/",
  "/cerez-politikasi/",
  "/kullanim-kosullari/",
];

export const sitemapSections: Record<string, () => SitemapEntry[]> = {
  core: () => [
    ...corePaths.map((path) => ({ path, lastmod: BUILD_DATE })),
    ...plateCodes.map((pc) => ({ path: `/plaka-kodlari/${pc.code}/`, lastmod: BUILD_DATE })),
    ...areaCodes.map((ac) => ({ path: `/alan-kodlari/${ac.code}/`, lastmod: BUILD_DATE })),
    ...postalCodes.map((pc) => ({ path: `/posta-kodlari/${pc.code}/`, lastmod: BUILD_DATE })),
  ],
  iller: () =>
    provinces.flatMap((p) => {
      const img = getProvinceImage(p.slug);
      return [
        {
          path: `/iller/${p.slug}/`,
          lastmod: p.lastReviewed ?? BUILD_DATE,
          image: img ? { loc: img.openGraph, title: `${p.name} haritası` } : undefined,
        },
        { path: `/iller/${p.slug}/ilceler/`, lastmod: p.lastReviewed ?? BUILD_DATE },
        { path: `/iller/${p.slug}/mesafeler/`, lastmod: BUILD_DATE },
      ];
    }),
  ilceler: () =>
    districts.map((d) => {
      const img = getDistrictImage(d.id);
      return {
        path: `/iller/${d.provinceSlug}/${d.slug}/`,
        lastmod: d.lastReviewed ?? BUILD_DATE,
        image: img ? { loc: img.openGraph, title: d.name } : undefined,
      };
    }),
  mesafe: () => {
    const out: SitemapEntry[] = [];
    const list = provinces.filter((p) => p.coordinates);
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++)
        out.push({ path: distancePath(list[i].slug, list[j].slug), lastmod: BUILD_DATE });
    return out;
  },
};

function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderUrlset(entries: SitemapEntry[]): string {
  const u = siteConfig.url;
  const body = entries
    .map((e) => {
      const img = e.image
        ? `<image:image><image:loc>${esc(u + e.image.loc)}</image:loc><image:title>${esc(e.image.title)}</image:title></image:image>`
        : "";
      return `<url><loc>${u}${e.path}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}${img}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
}

export function renderIndex(): string {
  const u = siteConfig.url;
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(sitemapSections)
  .map((name) => `<sitemap><loc>${u}/sitemaps/${name}.xml</loc><lastmod>${BUILD_DATE}</lastmod></sitemap>`)
  .join("\n")}
</sitemapindex>
`;
}
