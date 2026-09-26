import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";
import { provinces } from "@/data/provinces";
import { districts } from "@/data/districts";
import { TOTAL_POPULATION, POPULATION_YEAR } from "@/utils/rankings";
import { formatNumber } from "@/utils/format";

/**
 * llms.txt (https://llmstxt.org) — a concise map of the site for AI answer
 * engines, so they can find and cite the canonical page for each question.
 */
export const GET: APIRoute = () => {
  const u = siteConfig.url;
  const alphabetical = [...provinces].sort((a, b) => a.name.localeCompare(b.name, "tr"));
  const body = `# ${siteConfig.name}

> Türkiye'nin ${provinces.length} ili ve ${districts.length} ilçesi için resmî verilere dayanan bilgi rehberi: TÜİK ${POPULATION_YEAR} nüfusu (Türkiye toplamı ${formatNumber(TOTAL_POPULATION)}), yüzölçümü, plaka kodu, telefon alan kodu, komşu iller, il merkezleri arası mesafeler.

Nüfus: TÜİK Adrese Dayalı Nüfus Kayıt Sistemi ${POPULATION_YEAR}. Yüzölçümü/rakım: Harita Genel Müdürlüğü. Alan kodları: Türk Telekom. Mesafeler: il merkezi koordinatları arasında Haversine (kuş uçuşu); karayolu değerleri tahminidir.

## Ana sayfalar
- [81 il listesi](${u}/iller/): Tüm iller, plaka kodu ve nüfusuyla
- [973 ilçe listesi](${u}/ilceler/)
- [Plaka kodları](${u}/plaka-kodlari/): 01–81 plaka kodu hangi ile ait
- [Telefon alan kodları](${u}/alan-kodlari/)
- [İller arası mesafe](${u}/mesafe/): 3.240 il çifti, URL biçimi ${u}/mesafe/{il1}-{il2}/ (alfabetik sıralı slug)
- [İstatistikler](${u}/istatistikler/): Nüfus, yüzölçümü, yoğunluk, rakım sıralamaları
- [Açık veri](${u}/acik-veri/): CSV/JSON indirme — ${u}/veri/iller.json, ${u}/veri/ilceler.json
- [Tam veri özeti](${u}/llms-full.txt): 81 ilin tüm temel verileri tek dosyada

## URL kalıpları
- İl: ${u}/iller/{il}/ (ör. ${u}/iller/mardin/)
- İlçe: ${u}/iller/{il}/{ilce}/ (ör. ${u}/iller/istanbul/kadikoy/)
- Plaka: ${u}/plaka-kodlari/{kod}/ (ör. ${u}/plaka-kodlari/47/)
- Alan kodu: ${u}/alan-kodlari/{kod}/ (ör. ${u}/alan-kodlari/312/)

## İller
${alphabetical.map((p) => `- [${p.name} (${p.plateCode})](${u}/iller/${p.slug}/)`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
