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

export const GET: APIRoute = () => {
  const urls = new Set<string>(staticPaths);

  for (const p of provinces) {
    urls.add(`/iller/${p.slug}/`);
  }

  for (const provinceSlug of Object.keys(districtNamesByProvince)) {
    urls.add(`/iller/${provinceSlug}/ilceler/`);
    for (const d of getDistrictsForProvince(provinceSlug)) {
      urls.add(`/iller/${provinceSlug}/${d.slug}/`);
    }
  }

  for (const pc of plateCodes) {
    urls.add(`/plaka-kodlari/${pc.code}/`);
  }

  for (const ac of areaCodes) {
    urls.add(`/alan-kodlari/${ac.code}/`);
  }

  for (const pc of postalCodes) {
    urls.add(`/posta-kodlari/${pc.code}/`);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls)
  .map((path) => `  <url><loc>${siteConfig.url}${path}</loc></url>`)
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
