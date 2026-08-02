/**
 * Core domain types for illerilceler.com
 * All page templates read from src/data/*.ts using these shapes.
 */

export type RegionSlug =
  | "marmara"
  | "ege"
  | "akdeniz"
  | "ic-anadolu"
  | "karadeniz"
  | "dogu-anadolu"
  | "guneydogu-anadolu";

export interface Region {
  slug: RegionSlug;
  name: string;
  color: string;
  shortDescription: string;
  provinceCount?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedSearchLink {
  label: string;
  href: string;
}

export interface SourceRef {
  name: string;
  url?: string;
}

export interface PopularContentItem {
  label: string;
  meta?: string;
  icon?: string;
  href?: string;
}

export interface Province {
  id: string;
  slug: string;
  name: string;
  plateCode: string;
  areaCodes: string[];
  region: RegionSlug;
  population?: number;
  populationYear?: number;
  areaKm2?: number;
  elevationM?: number;
  districtCount?: number;
  neighborhoodCount?: number;
  villageCount?: number;
  postalCodePrefix?: string;
  coordinates?: Coordinates;
  neighbors?: string[];
  seas?: string[];
  climate?: string[];
  administrativeCenter?: string;
  heroImage?: string;
  summary?: string;
  overview?: string;
  isBiggestCity?: boolean;
  isCapital?: boolean;
  badge?: string;
  economy?: string;
  tourism?: string;
  transportation?: string;
  education?: string;
  history?: string;
  famousFor?: PopularContentItem[];
  popularPlaces?: PopularContentItem[];
  universities?: string[];
  faqs?: FAQItem[];
  sources?: SourceRef[];
  isDemoData?: boolean;
  lastReviewed?: string;
}

export interface District {
  id: string;
  slug: string;
  name: string;
  provinceSlug: string;
  population?: number;
  populationYear?: number;
  areaKm2?: number;
  elevationM?: number;
  neighborhoodCount?: number;
  postalCodes?: string[];
  neighbors?: string[];
  coastline?: string[];
  climate?: string[];
  distanceToCenterKm?: number;
  heroImage?: string;
  summary?: string;
  overview?: string;
  transportation?: string;
  education?: string;
  health?: string;
  socialLife?: string;
  historicalPlaces?: PopularContentItem[];
  popularPlaces?: PopularContentItem[];
  neighborhoods?: string[];
  faqs?: FAQItem[];
  sources?: SourceRef[];
  isDemoData?: boolean;
  lastReviewed?: string;
}

export interface Neighborhood {
  id: string;
  slug: string;
  name: string;
  districtSlug: string;
  provinceSlug: string;
  postalCode?: string;
  population?: number;
  summary?: string;
  isDemoData?: boolean;
}

export interface PlateCode {
  code: string;
  provinceSlug: string;
}

export type AreaCodeType = "fixed";

export interface AreaCode {
  code: string;
  provinceSlug: string;
  label?: string;
  type: AreaCodeType;
}

export interface PostalCode {
  code: string;
  provinceSlug: string;
  districtSlug?: string;
  neighborhoodSlug?: string;
  isDemoData?: boolean;
}

export interface DailyFact {
  slug: string;
  title: string;
  location: string;
  image?: string;
  excerpt: string;
  body?: string;
  href?: string;
}

export interface StatDefinition {
  key: string;
  label: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "purple" | "orange" | "pink" | "cyan";
  description?: string;
}

export interface CategoryDefinition {
  label: string;
  href: string;
  icon: string;
}

export interface QuickToolDefinition {
  label: string;
  href: string;
  icon: string;
  color?: "blue" | "green" | "purple" | "orange" | "pink" | "cyan";
}

export interface PopularSearchItem {
  rank: number;
  label: string;
  meta: string;
  href: string;
}

export type SearchResultType =
  | "province"
  | "district"
  | "neighborhood"
  | "plate"
  | "area-code"
  | "postal-code"
  | "page";

export interface SearchIndexEntry {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  meta?: string;
  href: string;
  keywords: string[];
}

export interface GradeLevel {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: "blue" | "green" | "purple" | "orange";
}

export interface EducationTopic {
  slug: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface EducationActivity {
  slug: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizDefinition {
  slug: string;
  title: string;
  description: string;
  durationMinutes?: number;
  questions: QuizQuestion[];
}
