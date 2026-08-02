import type { SearchIndexEntry } from "@/types";
import { provinces } from "@/data/provinces";
import {
  districts,
  districtNamesByProvince,
  getDistrictsForProvince,
} from "@/data/districts";
import { neighborhoods } from "@/data/neighborhoods";
import { plateCodes } from "@/data/plateCodes";
import { areaCodes } from "@/data/areaCodes";
import { postalCodes } from "@/data/postalCodes";
import { getProvinceBySlug } from "@/data/provinces";

function buildIndex(): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];

  for (const p of provinces) {
    entries.push({
      id: `province-${p.slug}`,
      type: "province",
      title: p.name,
      subtitle: "İl",
      meta: `Plaka ${p.plateCode}`,
      href: `/iller/${p.slug}/`,
      keywords: [
        p.name,
        `${p.name} ili`,
        `${p.plateCode} plaka`,
        `${p.plateCode} nerenin plakası`,
      ],
    });
  }

  for (const provinceSlug of Object.keys(districtNamesByProvince)) {
    const province = getProvinceBySlug(provinceSlug);
    for (const d of getDistrictsForProvince(provinceSlug)) {
      entries.push({
        id: `district-${provinceSlug}-${d.slug}`,
        type: "district",
        title: d.name,
        subtitle: province ? `${province.name} / İlçe` : "İlçe",
        meta: province?.name,
        href: `/iller/${provinceSlug}/${d.slug}/`,
        keywords: [
          d.name,
          `${d.name} ilçesi`,
          `${d.name} ${province?.name ?? ""}`,
        ],
      });
    }
  }
  // districts.ts may contain provinces without a name-list entry; include defensively
  for (const d of districts) {
    if (districtNamesByProvince[d.provinceSlug]) continue;
    const province = getProvinceBySlug(d.provinceSlug);
    entries.push({
      id: `district-${d.provinceSlug}-${d.slug}`,
      type: "district",
      title: d.name,
      subtitle: province ? `${province.name} / İlçe` : "İlçe",
      meta: province?.name,
      href: `/iller/${d.provinceSlug}/${d.slug}/`,
      keywords: [d.name, `${d.name} ilçesi`],
    });
  }

  for (const n of neighborhoods) {
    const province = getProvinceBySlug(n.provinceSlug);
    entries.push({
      id: `neighborhood-${n.provinceSlug}-${n.districtSlug}-${n.slug}`,
      type: "neighborhood",
      title: n.name,
      subtitle: "Mahalle",
      meta: province?.name,
      href: `/posta-kodlari/${n.postalCode ?? ""}/`,
      keywords: [n.name, `${n.name} mahallesi`],
    });
  }

  for (const pc of plateCodes) {
    const province = getProvinceBySlug(pc.provinceSlug);
    if (!province) continue;
    entries.push({
      id: `plate-${pc.code}`,
      type: "plate",
      title: `${pc.code} Plaka Kodu`,
      subtitle: `${province.name} plaka kodu`,
      meta: province.name,
      href: `/plaka-kodlari/${pc.code}/`,
      keywords: [
        pc.code,
        `${pc.code} nerenin plakası`,
        `${pc.code} plaka`,
        province.name,
      ],
    });
  }

  for (const ac of areaCodes) {
    const province = getProvinceBySlug(ac.provinceSlug);
    if (!province) continue;
    entries.push({
      id: `area-${ac.code}`,
      type: "area-code",
      title: `${ac.code} Alan Kodu`,
      subtitle: ac.label ?? `${province.name} alan kodu`,
      meta: province.name,
      href: `/alan-kodlari/${ac.code}/`,
      keywords: [
        ac.code,
        `0${ac.code}`,
        `${ac.code} nerenin alan kodu`,
        `${ac.code} nerenin kodu`,
        province.name,
      ],
    });
  }

  for (const pc of postalCodes) {
    const province = getProvinceBySlug(pc.provinceSlug);
    entries.push({
      id: `postal-${pc.code}`,
      type: "postal-code",
      title: `${pc.code} Posta Kodu`,
      subtitle: province?.name,
      meta: pc.districtSlug,
      href: `/posta-kodlari/${pc.code}/`,
      keywords: [pc.code, `${pc.code} posta kodu`],
    });
  }

  const staticPages: SearchIndexEntry[] = [
    {
      id: "page-iller",
      type: "page",
      title: "İller",
      subtitle: "Tüm iller listesi",
      href: "/iller/",
      keywords: ["iller", "il listesi"],
    },
    {
      id: "page-haritalar",
      type: "page",
      title: "Türkiye Haritası",
      subtitle: "İnteraktif harita",
      href: "/haritalar/turkiye-haritasi/",
      keywords: ["harita", "türkiye haritası"],
    },
    {
      id: "page-egitim",
      type: "page",
      title: "Eğitim Köşesi",
      subtitle: "Öğrenciler için içerikler",
      href: "/egitim/",
      keywords: ["eğitim", "ödev", "quiz"],
    },
    {
      id: "page-mesafe",
      type: "page",
      title: "İki Şehir Arası Mesafe",
      subtitle: "Mesafe hesaplama aracı",
      href: "/araclar/iki-sehir-arasi-mesafe/",
      keywords: ["mesafe", "kaç km", "arası kaç km"],
    },
    {
      id: "page-istatistikler",
      type: "page",
      title: "İstatistikler",
      subtitle: "Nüfus ve coğrafya istatistikleri",
      href: "/istatistikler/",
      keywords: ["istatistik", "nüfus sıralaması"],
    },
  ];

  return [...entries, ...staticPages];
}

export const searchIndex: SearchIndexEntry[] = buildIndex();
