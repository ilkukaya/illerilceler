/**
 * Turkish suffix helpers (ünlü uyumu + ünsüz benzeşmesi) for generated copy.
 *
 * Every province/district sentence on the site is built from data, so suffixes
 * must follow vowel harmony: "Ankara'nın", "İzmir'in", "Muş'un", "Ürgüp'ün",
 * "34'tür", "06'dır". Numbers are harmonised by how they are read aloud
 * ("34" → "otuz dört" → "34'tür").
 */

const BACK_VOWELS = "aıou";
const FRONT_VOWELS = "eiöü";
const VOWELS = BACK_VOWELS + FRONT_VOWELS;
const VOICELESS = "fstkçşhp";

const ONES = ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const TENS = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];

/** The last spoken word of a number, which is what the suffix harmonises with. */
function spokenTail(raw: string): string {
  const n = Number(raw.replace(/\D/g, ""));
  if (!Number.isFinite(n) || n === 0) return "sıfır";
  if (n % 1_000_000_000 === 0) return "milyar";
  if (n % 1_000_000 === 0) return "milyon";
  if (n % 1000 === 0) return "bin";
  if (n % 100 === 0) return "yüz";
  if (n % 10 === 0) return TENS[(n % 100) / 10];
  return ONES[n % 10];
}

function phonetic(word: string): string {
  const trimmed = word.trim();
  const lastToken = trimmed.split(/\s+/).pop() ?? trimmed;
  // "2,5" is read "iki virgül beş" → harmonise with the decimal part.
  const numeric = lastToken.includes(",") ? lastToken.split(",").pop()! : lastToken;
  const base = /\d$/.test(numeric) ? spokenTail(numeric) : lastToken;
  return base.toLocaleLowerCase("tr-TR");
}

function lastVowel(word: string): string {
  for (let i = word.length - 1; i >= 0; i--) {
    if (VOWELS.includes(word[i])) return word[i];
  }
  return "e";
}

function endsWithVowel(word: string): boolean {
  return VOWELS.includes(word[word.length - 1]);
}

function endsVoiceless(word: string): boolean {
  return VOICELESS.includes(word[word.length - 1]);
}

/** Two-way harmony: a / e */
function a2(word: string): "a" | "e" {
  return BACK_VOWELS.includes(lastVowel(word)) ? "a" : "e";
}

/** Four-way harmony: ı / i / u / ü */
function i4(word: string): "ı" | "i" | "u" | "ü" {
  const v = lastVowel(word);
  if (v === "a" || v === "ı") return "ı";
  if (v === "e" || v === "i") return "i";
  if (v === "o" || v === "u") return "u";
  return "ü";
}

function join(word: string, suffix: string, apostrophe: boolean): string {
  return apostrophe ? `${word}'${suffix}` : `${word}${suffix}`;
}

/** İlgi hâli: Ankara'nın, İzmir'in, 34'ün */
export function genitive(word: string, apostrophe = true): string {
  const p = phonetic(word);
  const suffix = (endsWithVowel(p) ? "n" : "") + i4(p) + "n";
  return join(word, suffix, apostrophe);
}

/** Bulunma hâli: Ankara'da, Kars'ta, Van'da */
export function locative(word: string, apostrophe = true): string {
  const p = phonetic(word);
  return join(word, (endsVoiceless(p) ? "t" : "d") + a2(p), apostrophe);
}

/** Ayrılma hâli: Ankara'dan, Kars'tan */
export function ablative(word: string, apostrophe = true): string {
  const p = phonetic(word);
  return join(word, (endsVoiceless(p) ? "t" : "d") + a2(p) + "n", apostrophe);
}

/** Yönelme hâli: Ankara'ya, İzmir'e */
export function dative(word: string, apostrophe = true): string {
  const p = phonetic(word);
  return join(word, (endsWithVowel(p) ? "y" : "") + a2(p), apostrophe);
}

/** Belirtme hâli: Ankara'yı, İzmir'i */
export function accusative(word: string, apostrophe = true): string {
  const p = phonetic(word);
  return join(word, (endsWithVowel(p) ? "y" : "") + i4(p), apostrophe);
}

/** Ek-fiil: 06'dır, 34'tür, Ankara'dır */
export function copula(word: string, apostrophe = true): string {
  const p = phonetic(word);
  return join(word, (endsVoiceless(p) ? "t" : "d") + i4(p) + "r", apostrophe);
}

/** 3. tekil iyelik: %6'sı, %30'u, Ankara'sı */
export function possessive(word: string, apostrophe = true): string {
  const p = phonetic(word);
  return join(word, (endsWithVowel(p) ? "s" : "") + i4(p), apostrophe);
}

/** "A, B ve C" list joiner. */
export function withAnd(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ve ${items[items.length - 1]}`;
}

/** Turkish ordinal as text: 1 → "1.", used as "en kalabalık 3. il". */
export function ordinal(n: number): string {
  return `${n}.`;
}
