import type { Region, RegionSlug } from "@/types";

export const regions: Region[] = [
  {
    slug: "marmara",
    name: "Marmara Bölgesi",
    color: "#635BFF",
    shortDescription:
      "Türkiye'nin en yoğun nüfuslu ve en sanayileşmiş bölgesi. İstanbul, Bursa ve Kocaeli gibi büyük şehirleri içerir.",
    provinceCount: 11,
  },
  {
    slug: "ege",
    name: "Ege Bölgesi",
    color: "#12B76A",
    shortDescription:
      "Zeytinlikleri, turizm sahilleri ve tarım üretimiyle bilinen, İzmir'in merkezinde yer aldığı bölge.",
    provinceCount: 8,
  },
  {
    slug: "akdeniz",
    name: "Akdeniz Bölgesi",
    color: "#0AA8CB",
    shortDescription:
      "Turizmin kalbi olan Antalya'nın da bulunduğu, sıcak yazları ve turunçgil üretimiyle tanınan bölge.",
    provinceCount: 8,
  },
  {
    slug: "ic-anadolu",
    name: "İç Anadolu Bölgesi",
    color: "#F79009",
    shortDescription:
      "Başkent Ankara'yı ve Türkiye'nin tahıl ambarı sayılan geniş platoları barındıran merkezi bölge.",
    provinceCount: 13,
  },
  {
    slug: "karadeniz",
    name: "Karadeniz Bölgesi",
    color: "#7C6CF2",
    shortDescription:
      "Yeşil yaylaları, fındık üretimi ve balıkçılığıyla öne çıkan, kıyı boyunca uzanan dar ve uzun bölge.",
    provinceCount: 18,
  },
  {
    slug: "dogu-anadolu",
    name: "Doğu Anadolu Bölgesi",
    color: "#EE46BC",
    shortDescription:
      "Türkiye'nin en yüksek ve en engebeli bölgesi; Ağrı Dağı ve Van Gölü bu bölgede yer alır.",
    provinceCount: 14,
  },
  {
    slug: "guneydogu-anadolu",
    name: "Güneydoğu Anadolu Bölgesi",
    color: "#F04438",
    shortDescription:
      "Fırat ve Dicle havzalarını kapsayan, tarih ve kültür açısından zengin, GAP projesinin merkezindeki bölge.",
    provinceCount: 9,
  },
];

export function getRegion(slug: RegionSlug | string): Region | undefined {
  return regions.find((r) => r.slug === slug);
}
