import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";
import { provinces } from "@/data/provinces";
import {
  districtNamesByProvince,
  getDistrictsForProvince,
} from "@/data/districts";
import { plateCodes } from "@/data/plateCodes";
import { areaCodes } from "@/data/areaCodes";
import { postalCodes } from "@/data/postalCodes";
import { getProvinceImage, getDistrictImage } from "@/generated/locationImageManifest";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const staticPaths = [
  "/",
  "/iller/",
  "/ilceler/",
  "/mahalleler/",
  "/koyler/",
  "/plaka-kodlari/",
  "/alan-kodlari/",
  "/posta-kodlari/",
  "/haritalar/",
  "/haritalar/turkiye-haritasi/",
  "/istatistikler/",
  "/istatistikler/en-kalabalik-iller/",
  "/istatistikler/yuzolcumune-gore-en-buyuk-iller/",
  "/egitim/",
  "/egitim/quiz/",
  "/egitim/81-il-ve-plakalari/",
  "/araclar/",
  "/araclar/iki-sehir-arasi-mesafe/",
  "/arama/",
  "/rehber/",
  "/gizlilik/",
  "/cerez-politikasi/",
  "/kullanim-kosullari/",
  "/iletisim/",
];

interface SitemapImage {
  loc: string;
  title: string;
  caption: string;
  licenseUrl: string;
}

interface SitemapUrl {
  path: string;
  image?: SitemapImage;
}

export const GET: APIRoute = () => {
  const urls = new Map<string, SitemapUrl>();
  const add = (path: string, image?: SitemapImage) => {
    if (!urls.has(path)) urls.set(path, { path, image });
  };

  for (const path of staticPaths) add(path);

  for (const p of provinces) {
    const image = getProvinceImage(p.slug);
    add(`/iller/${p.slug}/`, {
      loc: `${siteConfig.url}${image?.openGraph ?? "/images/og-default.svg"}`,
      title: p.name,
      caption: image?.alt ?? p.name,
      licenseUrl: image?.credit?.licenseUrl ?? `${siteConfig.url}/gorsel-kaynaklari/`,
    });
  }

  for (const provinceSlug of Object.keys(districtNamesByProvince)) {
    add(`/iller/${provinceSlug}/ilceler/`);
    for (const d of getDistrictsForProvince(provinceSlug)) {
      const image = getDistrictImage(d.id);
      add(`/iller/${provinceSlug}/${d.slug}/`, {
        loc: `${siteConfig.url}${image?.openGraph ?? "/images/og-default.svg"}`,
        title: d.name,
        caption: image?.alt ?? d.name,
        licenseUrl: image?.credit?.licenseUrl ?? `${siteConfig.url}/gorsel-kaynaklari/`,
      });
    }
  }

  for (const pc of plateCodes) add(`/plaka-kodlari/${pc.code}/`);
  for (const ac of areaCodes) add(`/alan-kodlari/${ac.code}/`);
  for (const pc of postalCodes) add(`/posta-kodlari/${pc.code}/`);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${Array.from(urls.values())
  .map(({ path, image }) => {
    if (!image) return `  <url><loc>${siteConfig.url}${path}</loc></url>`;
    return `  <url>
    <loc>${siteConfig.url}${path}</loc>
    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      <image:caption>${escapeXml(image.caption)}</image:caption>
      <image:license>${escapeXml(image.licenseUrl)}</image:license>
    </image:image>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
