import type { FAQItem, Province, District } from "@/types";
import { getRegion } from "@/data/regions";

export function provinceFaqs(province: Province): FAQItem[] {
  if (province.faqs && province.faqs.length > 0) return province.faqs;
  const region = getRegion(province.region);
  const faqs: FAQItem[] = [
    {
      question: `${province.name}'nin plaka kodu kaçtır?`,
      answer: `${province.name} ilinin plaka kodu ${province.plateCode}'dir.`,
    },
    {
      question: `${province.name} hangi bölgededir?`,
      answer: `${province.name}, Türkiye'nin ${region?.name ?? ""} bölgesinde yer alır.`,
    },
  ];
  if (province.districtCount) {
    faqs.push({
      question: `${province.name} kaç ilçeden oluşur?`,
      answer: `${province.name} ${province.districtCount} ilçeden oluşur.`,
    });
  }
  if (province.areaCodes.length > 0) {
    faqs.push({
      question: `${province.name}'nin alan kodu kaçtır?`,
      answer: `${province.name} ilinin sabit telefon alan kodu ${province.areaCodes.map((c) => `0${c}`).join(" / ")}'dir.`,
    });
  }
  return faqs;
}

export function districtFaqs(
  district: District,
  provinceName: string,
): FAQItem[] {
  if (district.faqs && district.faqs.length > 0) return district.faqs;
  const faqs: FAQItem[] = [
    {
      question: `${district.name} hangi ile bağlıdır?`,
      answer: `${district.name}, ${provinceName} iline bağlı bir ilçedir.`,
    },
  ];
  if (district.neighborhoodCount) {
    faqs.push({
      question: `${district.name} kaç mahalleden oluşur?`,
      answer: `${district.name} ${district.neighborhoodCount} mahalleden oluşur.`,
    });
  }
  if (district.population) {
    faqs.push({
      question: `${district.name}'nin nüfusu ne kadardır?`,
      answer: `${district.name} ilçesinin nüfusu ${new Intl.NumberFormat("tr-TR").format(district.population)} kişidir (${district.populationYear ?? 2025} yılı TÜİK verilerine göre).`,
    });
  }
  return faqs;
}
