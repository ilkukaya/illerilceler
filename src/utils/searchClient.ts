import type { SearchIndexEntry } from "@/types";

let cached: Promise<SearchIndexEntry[]> | null = null;

/** Loads /search-index.json once per page view (browser/CDN cache does the rest). */
export function loadSearchIndex(): Promise<SearchIndexEntry[]> {
  cached ??= fetch("/search-index.json")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      cached = null;
      return [];
    });
  return cached;
}

export const typeLabels: Record<string, string> = {
  province: "İl",
  district: "İlçe",
  neighborhood: "Mahalle",
  plate: "Plaka",
  "area-code": "Alan kodu",
  "postal-code": "Posta kodu",
  page: "Sayfa",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
