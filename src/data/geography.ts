import type { DailyFact, StatDefinition } from "@/types";
import {
  provinces,
  totalDistrictCount,
  totalPopulation,
} from "@/data/provinces";

export const nationalStats = {
  population: totalPopulation || 85279553,
  populationYear: 2024,
  areaKm2: 783562,
  highestElevationM: 5137,
  highestElevationPlace: "Ağrı Dağı",
  averageDistrictPopulation: Math.round(
    (totalPopulation || 85279553) / (totalDistrictCount || 973),
  ),
  provinceCount: provinces.length,
  districtCount: totalDistrictCount || 973,
};

export const homeStatCards: StatDefinition[] = [
  {
    key: "population",
    label: "Nüfus",
    value: "85.279.553",
    icon: "users",
    color: "blue",
    description: "Toplam nüfus (2024)",
  },
  {
    key: "area",
    label: "Yüzölçümü",
    value: "783.562 km²",
    icon: "map",
    color: "green",
    description: "Toplam yüzölçümü",
  },
  {
    key: "elevation",
    label: "Rakım",
    value: "5.137 m",
    icon: "mountain",
    color: "purple",
    description: "En yüksek nokta (Ağrı Dağı)",
  },
  {
    key: "district-population",
    label: "İlçe Nüfusu",
    value: "93.356",
    icon: "bar-chart-3",
    color: "orange",
    description: "Ortalama ilçe nüfusu",
  },
];

export const dailyFacts: DailyFact[] = [
  {
    slug: "nemrut-dagi",
    title: "Nemrut Dağı",
    location: "Adıyaman",
    image: "/images/geography/nemrut-dagi.svg",
    excerpt:
      "Nemrut Dağı, 2.134 metre yüksekliğiyle Türkiye'nin en önemli tarihi ve doğal güzelliklerinden biridir.",
    body: "Kommagene Krallığı Kralı I. Antiokhos tarafından MÖ 1. yüzyılda inşa ettirilen dev tanrı heykelleri, dağın zirvesinde yer alır. UNESCO Dünya Mirası Listesi'nde bulunan Nemrut, özellikle gün doğumu manzarasıyla ünlüdür.",
    href: "/iller/adiyaman/",
  },
  {
    slug: "agri-dagi",
    title: "Ağrı Dağı",
    location: "Ağrı",
    image: "/images/geography/agri-dagi.svg",
    excerpt:
      "5.137 metre yüksekliğiyle Ağrı Dağı, Türkiye'nin en yüksek zirvesidir.",
    body: "Sönmüş bir volkan konisi olan Ağrı Dağı, Nuh'un Gemisi efsanesiyle de anılır. Zirvesi yıl boyunca karla kaplıdır ve dağcılık tutkunlarının gözde rotalarından biridir.",
    href: "/iller/agri/",
  },
  {
    slug: "van-golu",
    title: "Van Gölü",
    location: "Van",
    image: "/images/geography/van-golu.svg",
    excerpt:
      "Van Gölü, yaklaşık 3.755 km² yüzölçümüyle Türkiye'nin en büyük gölüdür.",
    body: "Sodalı bir göl olan Van Gölü, dünyada eşi benzeri olmayan inci kefali balığına ev sahipliği yapar. Gölün ortasındaki Akdamar Adası, tarihi Akdamar Kilisesi ile tanınır.",
    href: "/iller/van/",
  },
  {
    slug: "kizilirmak",
    title: "Kızılırmak",
    location: "Sivas – Samsun",
    image: "/images/geography/kizilirmak.svg",
    excerpt:
      "Kızılırmak, yaklaşık 1.355 km uzunluğuyla Türkiye'nin en uzun nehridir.",
    body: "Sivas'ın Kızıldağ mevkiinden doğan nehir, İç Anadolu'da geniş bir yay çizerek Karadeniz'e dökülür. Adını taşıdığı kızıl renkli alüvyonlu sularından alır.",
    href: "/haritalar/turkiye-haritasi/",
  },
  {
    slug: "pamukkale",
    title: "Pamukkale",
    location: "Denizli",
    image: "/images/geography/pamukkale.svg",
    excerpt:
      "Pamukkale'nin beyaz travertenleri, binlerce yıldır kalsiyum bikarbonatlı sıcak suların birikimiyle oluşmuştur.",
    body: "Antik Hierapolis kentiyle birlikte UNESCO Dünya Mirası Listesi'nde yer alan Pamukkale, Türkiye'nin en çok ziyaret edilen doğal oluşumlarından biridir.",
    href: "/iller/denizli/",
  },
  {
    slug: "gobeklitepe",
    title: "Göbeklitepe",
    location: "Şanlıurfa",
    image: "/images/geography/gobeklitepe.svg",
    excerpt:
      "Göbeklitepe, yaklaşık 12.000 yıllık geçmişiyle bilinen en eski tapınma alanlarından biridir.",
    body: "'Sıfır Noktası' olarak da anılan Göbeklitepe, yerleşik hayata geçişin izlerini taşıyan T biçimli dikilitaşlarıyla arkeoloji dünyasını değiştiren bir keşiftir.",
    href: "/iller/sanliurfa/",
  },
];

export const mountains = [
  { name: "Ağrı Dağı", elevationM: 5137, location: "Ağrı" },
  { name: "Erciyes Dağı", elevationM: 3916, location: "Kayseri" },
  { name: "Kaçkar Dağı", elevationM: 3937, location: "Rize" },
  { name: "Uludağ", elevationM: 2543, location: "Bursa" },
  { name: "Nemrut Dağı (Bitlis)", elevationM: 2948, location: "Bitlis" },
  { name: "Süphan Dağı", elevationM: 4058, location: "Van" },
];

export const rivers = [
  { name: "Kızılırmak", lengthKm: 1355 },
  { name: "Fırat", lengthKm: 2800 },
  { name: "Dicle", lengthKm: 1900 },
  { name: "Sakarya", lengthKm: 824 },
  { name: "Yeşilırmak", lengthKm: 519 },
];

export const lakes = [
  { name: "Van Gölü", areaKm2: 3755, location: "Van" },
  { name: "Tuz Gölü", areaKm2: 1665, location: "Ankara – Konya" },
  { name: "Beyşehir Gölü", areaKm2: 656, location: "Konya" },
  { name: "Eğirdir Gölü", areaKm2: 482, location: "Isparta" },
];

export const neighboringCountries = [
  "Yunanistan",
  "Bulgaristan",
  "Gürcistan",
  "Ermenistan",
  "Azerbaycan (Nahçıvan)",
  "İran",
  "Irak",
  "Suriye",
];
