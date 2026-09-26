import type { APIRoute } from "astro";
import { siteConfig } from "@/config/site";
import { provinces, getNeighborProvinces } from "@/data/provinces";
import { getDistrictsForProvince } from "@/data/districts";
import { getRegion } from "@/data/regions";
import { formatNumber } from "@/utils/format";
import { provinceRanks, POPULATION_YEAR } from "@/utils/rankings";

/** Full plain-text fact sheet of all 81 provinces for AI answer engines. */
export const GET: APIRoute = () => {
  const u = siteConfig.url;
  const sections = [...provinces]
    .sort((a, b) => Number(a.plateCode) - Number(b.plateCode))
    .map((p) => {
      const r = provinceRanks(p);
      const ds = getDistrictsForProvince(p.slug)
        .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
        .map((d) => `${d.name} (${d.population ? formatNumber(d.population) : "—"})`)
        .join(", ");
      return `## ${p.name}
- Sayfa: ${u}/iller/${p.slug}/
- Plaka kodu: ${p.plateCode}
- Telefon alan kodu: ${p.areaCodes.map((c) => `0${c}`).join(", ")}
- Bölge: ${getRegion(p.region)?.name ?? ""}
- Nüfus (${p.populationYear ?? POPULATION_YEAR}, TÜİK): ${p.population ? formatNumber(p.population) : "—"} (Türkiye'de ${r.population}. sırada)
- Yüzölçümü: ${p.areaKm2 ? `${formatNumber(p.areaKm2)} km²` : "—"} (${r.area}. sırada)
- İl merkezi rakımı: ${p.elevationM !== undefined ? `${formatNumber(p.elevationM)} m` : "—"}
- İlçe sayısı: ${p.districtCount ?? "—"}; mahalle sayısı: ${p.neighborhoodCount ? formatNumber(p.neighborhoodCount) : "—"}
- Komşu iller: ${getNeighborProvinces(p).map((n) => n.name).join(", ")}
- İlçeler (nüfusa göre): ${ds}`;
    });
  const body = `# ${siteConfig.name} — 81 il veri özeti

Kaynak: TÜİK ADNKS ${POPULATION_YEAR}, Harita Genel Müdürlüğü, Türk Telekom. Alıntılarken lütfen ilgili il sayfasına bağlantı verin.

${sections.join("\n\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
