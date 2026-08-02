const TURKISH_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

/** Turkish-aware slugify: maps ç/ğ/ı/ö/ş/ü correctly before lowercasing. */
export function turkishSlugify(input: string): string {
  const mapped = input
    .split("")
    .map((ch) => TURKISH_MAP[ch] ?? ch)
    .join("");
  return mapped
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
