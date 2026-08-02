import type { SearchIndexEntry, SearchResultType } from "@/types";

const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");
const DOTTED_I = new RegExp("i\\u0307", "g");

function normalize(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(DOTTED_I, "i")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .trim();
}

export interface SearchOptions {
  limit?: number;
  type?: SearchResultType | "all";
}

export interface ScoredResult {
  entry: SearchIndexEntry;
  score: number;
}

export function searchAll(
  query: string,
  index: SearchIndexEntry[],
  options: SearchOptions = {},
): SearchIndexEntry[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const { limit = 20, type = "all" } = options;

  const scored: ScoredResult[] = [];

  for (const entry of index) {
    if (type !== "all" && entry.type !== type) continue;

    const title = normalize(entry.title);
    let best = -1;

    if (title === q) best = 100;
    else if (title.startsWith(q)) best = 80;
    else if (title.includes(q)) best = 60;

    for (const kw of entry.keywords) {
      const nk = normalize(kw);
      if (nk === q) best = Math.max(best, 95);
      else if (nk.startsWith(q)) best = Math.max(best, 70);
      else if (nk.includes(q)) best = Math.max(best, 45);
    }

    if (entry.subtitle && normalize(entry.subtitle).includes(q))
      best = Math.max(best, 30);

    if (best > 0) scored.push({ entry, score: best });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score || a.entry.title.localeCompare(b.entry.title, "tr"),
  );
  return scored.slice(0, limit).map((s) => s.entry);
}

export function countByType(
  results: SearchIndexEntry[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of results) {
    counts[r.type] = (counts[r.type] ?? 0) + 1;
  }
  return counts;
}
