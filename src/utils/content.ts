/**
 * Data-driven copy for every province and district page.
 *
 * Only 12 provinces / 45 districts have hand-written editorial text; the rest
 * previously rendered little more than a stats grid (thin content). These
 * helpers turn the verified TÜİK/HGM figures into readable, answer-first
 * Turkish prose and FAQs — every sentence is computed from src/data, so it is
 * always consistent with the tables on the same page, and suffixes follow
 * vowel harmony via src/utils/turkish.ts.
 */
import type { FAQItem, Province, District } from "@/types";
import { getRegion } from "@/data/regions";
import { getProvinceBySlug, getNeighborProvinces } from "@/data/provinces";
import { getDistrictsForProvince } from "@/data/districts";
import { formatNumber } from "@/utils/format";
import {
  provinceRanks,
  districtRanks,
  density,
  NATIONAL_DENSITY,
  POPULATION_YEAR,
  nearestProvinces,
} from "@/utils/rankings";
import { haversineDistanceKm } from "@/utils/distance";
import { genitive, copula, locative, withAnd, possessive } from "@/utils/turkish";

const n = (v: number) => formatNumber(Math.round(v));
const areaCodeText = (p: Province) => p.areaCodes.map((c) => `0${c}`).join(" ve ");

/** İstanbul's Anatolian-side districts dial 0216; the European side 0212. */
const ISTANBUL_ANATOLIAN = new Set([
  "adalar", "atasehir", "beykoz", "cekmekoy", "kadikoy", "kartal", "maltepe",
  "pendik", "sancaktepe", "sultanbeyli", "sile", "tuzla", "umraniye", "uskudar",
]);

export function districtAreaCodes(d: District, p: Province): string[] {
  if (p.slug === "istanbul" && p.areaCodes.length === 2) {
    return [ISTANBUL_ANATOLIAN.has(d.slug) ? "216" : "212"];
  }
  return p.areaCodes;
}

const districtAreaCodeText = (d: District, p: Province) =>
  districtAreaCodes(d, p).map((c) => `0${c}`).join(" ve ");

export function capitalProvince(): Province | undefined {
  return getProvinceBySlug("ankara");
}

/**
 * Hand-written FAQs are kept only when they cover a topic the computed FAQs do
 * not (e.g. "Mardin neyi ile meşhurdur?"). Stats questions always come from the
 * computed set so they match the current dataset.
 */
const COMPUTED_TOPICS = /plaka|alan kod|bölge|ilçe|nüfus|yüzölçüm|komşu|mahalle|hangi il|kaç km|posta kod/i;
function editorialExtras(faqs: FAQItem[] | undefined): FAQItem[] {
  return (faqs ?? []).filter((f) => !COMPUTED_TOPICS.test(f.question));
}

/** One-paragraph, quotable answer that opens every province page. */
export function provinceLead(p: Province): string {
  const region = getRegion(p.region);
  const r = provinceRanks(p);
  const parts: string[] = [];
  parts.push(
    `${p.name}, ${region ? `${region.name}'nde yer alan, ` : ""}plaka kodu ${p.plateCode} ve telefon alan kodu ${areaCodeText(p)} olan bir ildir.`,
  );
  if (p.population) {
    parts.push(
      `TÜİK ${p.populationYear ?? POPULATION_YEAR} verilerine göre nüfusu ${formatNumber(p.population)} kişidir ve ${
        r.population === 1 ? "Türkiye'nin en kalabalık ilidir" : `nüfus bakımından 81 il arasında ${r.population}. sıradadır`
      }.`,
    );
  }
  if (p.areaKm2) {
    parts.push(
      `Yüzölçümü ${formatNumber(p.areaKm2)} km² olup ${
        r.area === 1 ? "Türkiye'nin en büyük ilidir" : `81 il arasında ${r.area}. sıradadır`
      }.`,
    );
  }
  if (p.districtCount) {
    parts.push(
      `İl, ${p.districtCount} ilçe${p.neighborhoodCount ? ` ve ${formatNumber(p.neighborhoodCount)} mahalleden` : "den"} oluşur.`,
    );
  }
  return parts.join(" ");
}

/** Additional computed paragraphs (density, districts, geography, distances). */
export function provinceParagraphs(p: Province): string[] {
  const paragraphs: string[] = [];
  const r = provinceRanks(p);
  const d = density(p.population, p.areaKm2);
  const districts = getDistrictsForProvince(p.slug);

  if (d) {
    const ratio = d / NATIONAL_DENSITY;
    const cmp =
      ratio > 1.15
        ? `Türkiye ortalamasının (${n(NATIONAL_DENSITY)} kişi/km²) yaklaşık ${ratio >= 2 ? `${ratio.toFixed(1).replace(".", ",")} katıdır` : "üzerindedir"}`
        : ratio < 0.85
          ? `Türkiye ortalamasının (${n(NATIONAL_DENSITY)} kişi/km²) altındadır`
          : `Türkiye ortalamasına (${n(NATIONAL_DENSITY)} kişi/km²) yakındır`;
    paragraphs.push(
      `${genitive(p.name)} nüfus yoğunluğu kilometrekare başına yaklaşık ${n(d)} kişidir; bu değer ${cmp}. Yoğunluk sıralamasında ${p.name}, 81 il arasında ${r.density}. sırada yer alır.`,
    );
  }

  if (districts.length > 1) {
    const byPop = [...districts].filter((x) => x.population).sort((a, b) => b.population! - a.population!);
    const byArea = [...districts].filter((x) => x.areaKm2).sort((a, b) => b.areaKm2! - a.areaKm2!);
    const top = byPop[0];
    const bottom = byPop[byPop.length - 1];
    const sentences: string[] = [];
    if (top && bottom && top !== bottom) {
      const share = p.population ? (top.population! / p.population) * 100 : 0;
      sentences.push(
        `İlin en kalabalık ilçesi ${formatNumber(top.population!)} kişiyle ${top.name}${share >= 1 ? ` (il nüfusunun ${possessive(`%${share.toFixed(0)}`)})` : ""}, en az nüfuslu ilçesi ise ${formatNumber(bottom.population!)} kişiyle ${copula(bottom.name)}.`,
      );
    }
    if (byArea[0]) {
      sentences.push(`Yüzölçümü en büyük ilçe ${formatNumber(byArea[0].areaKm2!)} km² ile ${copula(byArea[0].name)}.`);
    }
    if (p.administrativeCenter) {
      sentences.push(`İl merkezi ${p.administrativeCenter} ilçesindedir.`);
    }
    if (sentences.length) paragraphs.push(sentences.join(" "));
  }

  const neighbors = getNeighborProvinces(p);
  const geo: string[] = [];
  if (neighbors.length) {
    geo.push(`${p.name}; ${withAnd(neighbors.map((x) => x.name))} illeriyle komşudur.`);
  }
  if (p.seas?.length) {
    geo.push(`${genitive(p.name)} ${withAnd(p.seas)} kıyısı bulunur.`);
  } else {
    geo.push(`${genitive(p.name)} denize kıyısı yoktur.`);
  }
  if (p.elevationM !== undefined) {
    geo.push(`İl merkezinin denizden yüksekliği yaklaşık ${formatNumber(p.elevationM)} metredir.`);
  }
  if (p.climate?.length) {
    geo.push(`İklim: ${p.climate.join(" · ")}.`);
  }
  paragraphs.push(geo.join(" "));

  const ankara = capitalProvince();
  const nearest = nearestProvinces(p, 1)[0];
  if (p.coordinates && ankara?.coordinates) {
    const dist: string[] = [];
    if (p.slug !== "ankara") {
      dist.push(
        `${p.name} il merkezinin başkent Ankara'ya kuş uçuşu uzaklığı yaklaşık ${n(haversineDistanceKm(p.coordinates, ankara.coordinates))} km'dir.`,
      );
    }
    if (nearest) {
      dist.push(`En yakın il merkezi yaklaşık ${n(nearest.km)} km ile ${copula(nearest.province.name)}.`);
    }
    if (dist.length) paragraphs.push(dist.join(" "));
  }

  return paragraphs;
}

export function provinceFaqs(p: Province): FAQItem[] {
  const region = getRegion(p.region);
  const r = provinceRanks(p);
  const districts = getDistrictsForProvince(p.slug);
  const neighbors = getNeighborProvinces(p);
  const faqs: FAQItem[] = [
    {
      question: `${genitive(p.name)} plaka kodu kaçtır?`,
      answer: `${genitive(p.name)} plaka kodu ${copula(p.plateCode)}.`,
    },
    {
      question: `${genitive(p.name)} telefon alan kodu kaçtır?`,
      answer: `${genitive(p.name)} sabit telefon alan kodu ${copula(areaCodeText(p))}.`,
    },
  ];
  if (region) {
    faqs.push({
      question: `${p.name} hangi bölgededir?`,
      answer: `${p.name}, ${region.name}'nde yer alır.`,
    });
  }
  if (p.population) {
    faqs.push({
      question: `${genitive(p.name)} nüfusu kaçtır?`,
      answer: `TÜİK Adrese Dayalı Nüfus Kayıt Sistemi ${p.populationYear ?? POPULATION_YEAR} sonuçlarına göre ${genitive(p.name)} nüfusu ${formatNumber(p.population)} kişidir. ${
        r.population === 1 ? "Türkiye'nin en kalabalık ilidir." : `Nüfus bakımından Türkiye'de ${r.population}. sıradadır.`
      }`,
    });
  }
  if (p.districtCount) {
    faqs.push({
      question: `${p.name} kaç ilçeden oluşur, ilçeleri nelerdir?`,
      answer: `${p.name} ${p.districtCount} ilçeden oluşur: ${withAnd([...districts].map((d) => d.name).sort((a, b) => a.localeCompare(b, "tr")))}.`,
    });
  }
  if (p.areaKm2) {
    faqs.push({
      question: `${genitive(p.name)} yüzölçümü ne kadardır?`,
      answer: `${genitive(p.name)} yüzölçümü ${formatNumber(p.areaKm2)} km²'dir. ${
        r.area === 1
          ? "Türkiye'nin yüzölçümü en büyük ilidir."
          : `Yüzölçümü bakımından 81 il arasında ${r.area}. sıradadır.`
      }`,
    });
  }
  if (neighbors.length) {
    faqs.push({
      question: `${genitive(p.name)} komşu illeri hangileridir?`,
      answer: `${p.name}, ${neighbors.length} ille komşudur: ${withAnd(neighbors.map((x) => x.name))}.`,
    });
  }
  const top = [...districts].filter((d) => d.population).sort((a, b) => b.population! - a.population!)[0];
  if (top && districts.length > 1) {
    faqs.push({
      question: `${genitive(p.name)} en kalabalık ilçesi hangisidir?`,
      answer: `${genitive(p.name)} en kalabalık ilçesi ${formatNumber(top.population!)} nüfuslu ${copula(top.name)}.`,
    });
  }
  const ankara = capitalProvince();
  if (p.coordinates && ankara?.coordinates && p.slug !== "ankara") {
    faqs.push({
      question: `${p.name} Ankara arası kaç km?`,
      answer: `${p.name} ile Ankara il merkezleri arasındaki kuş uçuşu mesafe yaklaşık ${n(haversineDistanceKm(p.coordinates, ankara.coordinates))} km'dir. Karayolu mesafesi güzergâha göre bunun yaklaşık 1,2–1,4 katıdır.`,
    });
  }
  return [...faqs, ...editorialExtras(p.faqs)];
}

/** One-paragraph, quotable answer that opens every district page. */
export function districtLead(d: District, p: Province): string {
  const r = districtRanks(d);
  const parts: string[] = [`${d.name}, ${p.name} iline bağlı bir ilçedir.`];
  if (p.administrativeCenter && p.administrativeCenter === d.name) {
    parts[0] = `${d.name}, ${genitive(p.name)} merkez ilçesidir.`;
  }
  if (d.population) {
    parts.push(
      `TÜİK ${d.populationYear ?? POPULATION_YEAR} verilerine göre nüfusu ${formatNumber(d.population)} kişidir; ${
        r.siblings > 1
          ? r.provincePopulation === 1
            ? `${genitive(p.name)} en kalabalık ilçesidir`
            : `${genitive(p.name)} ${r.siblings} ilçesi arasında nüfusta ${r.provincePopulation}. sıradadır`
          : `${genitive(p.name)} tek ilçesidir`
      }.`,
    );
  }
  if (d.areaKm2 && d.neighborhoodCount) {
    parts.push(
      `İlçenin yüzölçümü ${formatNumber(d.areaKm2)} km², mahalle sayısı ${copula(String(d.neighborhoodCount))}.`,
    );
  } else if (d.areaKm2) {
    parts.push(`İlçenin yüzölçümü ${formatNumber(d.areaKm2)} km²'dir.`);
  } else if (d.neighborhoodCount) {
    parts.push(`İlçede ${d.neighborhoodCount} mahalle bulunur.`);
  }
  return parts.join(" ");
}

export function districtParagraphs(d: District, p: Province): string[] {
  const out: string[] = [];
  const r = districtRanks(d);
  const dd = density(d.population, d.areaKm2);
  const pd = density(p.population, p.areaKm2);
  if (dd && pd) {
    out.push(
      `${genitive(d.name)} nüfus yoğunluğu kilometrekare başına yaklaşık ${n(dd)} kişidir. Bu, ${p.name} il ortalamasının (${n(pd)} kişi/km²) ${
        dd > pd * 1.1 ? "üzerinde" : dd < pd * 0.9 ? "altında" : "yakınında"
      } bir değerdir.`,
    );
  }
  if (r.nationalPopulation) {
    out.push(
      `Türkiye'deki ${r.total} ilçe arasında ${d.name}, nüfus bakımından ${r.nationalPopulation}.${r.nationalArea ? `, yüzölçümü bakımından ${r.nationalArea}.` : ""} sıradadır.`,
    );
  }
  out.push(
    `${d.name} ilçesinin bağlı olduğu ${genitive(p.name)} plaka kodu ${copula(p.plateCode)}; ${locative(d.name)} kullanılan sabit telefon alan kodu ${copula(districtAreaCodeText(d, p))}. ${
      p.administrativeCenter && p.administrativeCenter !== d.name
        ? `İl merkezi ${p.administrativeCenter} ilçesindedir.`
        : ""
    }`.trim(),
  );
  return out;
}

export function districtFaqs(d: District, provinceName: string): FAQItem[] {
  const p = getProvinceBySlug(d.provinceSlug);
  const r = districtRanks(d);
  const faqs: FAQItem[] = [
    {
      question: `${d.name} hangi ile bağlıdır?`,
      answer: `${d.name}, ${provinceName} iline bağlı bir ilçedir.`,
    },
  ];
  if (d.population) {
    faqs.push({
      question: `${genitive(d.name)} nüfusu kaçtır?`,
      answer: `TÜİK ${d.populationYear ?? POPULATION_YEAR} verilerine göre ${genitive(d.name)} nüfusu ${formatNumber(d.population)} kişidir${
        r.provincePopulation ? `; ${provinceName} ilçeleri arasında ${r.provincePopulation}. sıradadır` : ""
      }.`,
    });
  }
  if (d.neighborhoodCount) {
    faqs.push({
      question: `${d.name} kaç mahalleden oluşur?`,
      answer: `${d.name} ilçesinde ${d.neighborhoodCount} mahalle bulunur.`,
    });
  }
  if (d.areaKm2) {
    faqs.push({
      question: `${genitive(d.name)} yüzölçümü ne kadardır?`,
      answer: `${genitive(d.name)} yüzölçümü ${formatNumber(d.areaKm2)} km²'dir.`,
    });
  }
  if (p) {
    faqs.push({
      question: `${genitive(d.name)} plaka kodu kaçtır?`,
      answer: `${d.name}, ${provinceName} iline bağlı olduğu için plaka kodu ${copula(p.plateCode)}.`,
    });
    faqs.push({
      question: `${genitive(d.name)} telefon alan kodu kaçtır?`,
      answer: `${locative(d.name)} kullanılan sabit telefon alan kodu ${copula(districtAreaCodeText(d, p))}.`,
    });
  }
  return [...faqs, ...editorialExtras(d.faqs)];
}

