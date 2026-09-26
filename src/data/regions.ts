import type { Region, RegionSlug } from "@/types";

export const regions: Region[] = [
  {
    slug: "marmara",
    name: "Marmara Bölgesi",
    color: "#3D6FA3",
    shortDescription:
      "Türkiye'nin en yoğun nüfuslu ve en sanayileşmiş bölgesi. İstanbul, Bursa ve Kocaeli gibi büyük şehirleri içerir.",
    provinceCount: 11,
  },
  {
    slug: "ege",
    name: "Ege Bölgesi",
    color: "#5B8F4E",
    shortDescription:
      "Zeytinlikleri, turizm sahilleri ve tarım üretimiyle bilinen, İzmir'in merkezinde yer aldığı bölge.",
    provinceCount: 8,
  },
  {
    slug: "akdeniz",
    name: "Akdeniz Bölgesi",
    color: "#D08B3A",
    shortDescription:
      "Turizmin kalbi olan Antalya'nın da bulunduğu, sıcak yazları ve turunçgil üretimiyle tanınan bölge.",
    provinceCount: 8,
  },
  {
    slug: "ic-anadolu",
    name: "İç Anadolu Bölgesi",
    color: "#B8A15A",
    shortDescription:
      "Başkent Ankara'yı ve Türkiye'nin tahıl ambarı sayılan geniş platoları barındıran merkezi bölge.",
    provinceCount: 13,
  },
  {
    slug: "karadeniz",
    name: "Karadeniz Bölgesi",
    color: "#2E8A86",
    shortDescription:
      "Yeşil yaylaları, fındık üretimi ve balıkçılığıyla öne çıkan, kıyı boyunca uzanan dar ve uzun bölge.",
    provinceCount: 18,
  },
  {
    slug: "dogu-anadolu",
    name: "Doğu Anadolu Bölgesi",
    color: "#7B6AA6",
    shortDescription:
      "Türkiye'nin en yüksek ve en engebeli bölgesi; Ağrı Dağı ve Van Gölü bu bölgede yer alır.",
    provinceCount: 14,
  },
  {
    slug: "guneydogu-anadolu",
    name: "Güneydoğu Anadolu Bölgesi",
    color: "#B5654A",
    shortDescription:
      "Fırat ve Dicle havzalarını kapsayan, tarih ve kültür açısından zengin, GAP projesinin merkezindeki bölge.",
    provinceCount: 9,
  },
];

export function getRegion(slug: RegionSlug | string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}
