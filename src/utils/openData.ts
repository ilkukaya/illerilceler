/** Flat, stable records for the open-data downloads (/veri/*) and llms-full.txt. */
import { provinces, getProvinceBySlug } from "@/data/provinces";
import { districts } from "@/data/districts";
import { getRegion } from "@/data/regions";
import { siteConfig } from "@/config/site";

export function provinceRecords() {
  return provinces.map((p) => ({
    plaka: p.plateCode,
    il: p.name,
    slug: p.slug,
    bolge: getRegion(p.region)?.name ?? "",
    nufus: p.population ?? null,
    nufus_yili: p.populationYear ?? null,
    yuzolcumu_km2: p.areaKm2 ?? null,
    rakim_m: p.elevationM ?? null,
    ilce_sayisi: p.districtCount ?? null,
    mahalle_sayisi: p.neighborhoodCount ?? null,
    alan_kodlari: p.areaCodes.map((c) => `0${c}`).join(" "),
    enlem: p.coordinates?.lat ?? null,
    boylam: p.coordinates?.lng ?? null,
    komsu_iller: (p.neighbors ?? []).map((s) => getProvinceBySlug(s)?.name ?? s).join(", "),
    url: `${siteConfig.url}/iller/${p.slug}/`,
  }));
}

export function districtRecords() {
  return districts.map((d) => {
    const p = getProvinceBySlug(d.provinceSlug);
    return {
      il: p?.name ?? "",
      plaka: p?.plateCode ?? "",
      ilce: d.name,
      slug: d.slug,
      nufus: d.population ?? null,
      nufus_yili: d.populationYear ?? null,
      yuzolcumu_km2: d.areaKm2 ?? null,
      mahalle_sayisi: d.neighborhoodCount ?? null,
      url: `${siteConfig.url}/iller/${d.provinceSlug}/${d.slug}/`,
    };
  });
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // BOM so Excel opens Turkish characters correctly.
  return "﻿" + [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n") + "\n";
}
