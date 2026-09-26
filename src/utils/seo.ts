import { siteConfig } from "@/config/site";

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean}`;
}

export function pageTitle(title: string, includeTemplate = true): string {
  if (!includeTemplate || title === siteConfig.title) return title;
  return siteConfig.titleTemplate.replace("%s", title);
}

export interface BreadcrumbEntry {
  label: string;
  href: string;
}

export function breadcrumbListSchema(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function itemListSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
    })),
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/arama/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icons/icon-512.png"),
      width: 512,
      height: 512,
    },
    email: siteConfig.contactEmail,
    ...(Object.keys(siteConfig.social).length
      ? { sameAs: Object.values(siteConfig.social) }
      : {}),
  };
}

export function administrativeAreaSchema(params: {
  name: string;
  path: string;
  description: string;
  containedIn?: string;
  containedInPath?: string;
  latitude?: number;
  longitude?: number;
  population?: number;
  populationYear?: number;
  areaKm2?: number;
  plateCode?: string;
  areaCodes?: string[];
  image?: string;
}) {
  const extra: Record<string, unknown>[] = [];
  if (params.population)
    extra.push({
      "@type": "PropertyValue",
      name: "Nüfus",
      value: params.population,
      ...(params.populationYear ? { description: `TÜİK ADNKS ${params.populationYear}` } : {}),
    });
  if (params.areaKm2)
    extra.push({ "@type": "PropertyValue", name: "Yüzölçümü", value: params.areaKm2, unitText: "km²" });
  if (params.plateCode)
    extra.push({ "@type": "PropertyValue", name: "Plaka kodu", value: params.plateCode });
  if (params.areaCodes?.length)
    extra.push({
      "@type": "PropertyValue",
      name: "Telefon alan kodu",
      value: params.areaCodes.map((c) => `0${c}`).join(", "),
    });
  return {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    "@id": `${absoluteUrl(params.path)}#place`,
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    ...(params.image ? { image: absoluteUrl(params.image) } : {}),
    ...(extra.length ? { additionalProperty: extra } : {}),
    ...(params.containedIn
      ? {
          containedInPlace: params.containedInPath
            ? {
                "@type": "AdministrativeArea",
                name: params.containedIn,
                url: absoluteUrl(params.containedInPath),
              }
            : { "@type": "Country", name: params.containedIn },
        }
      : {}),
    ...(params.latitude && params.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: params.latitude,
            longitude: params.longitude,
          },
        }
      : {}),
  };
}

export function webPageSchema(params: {
  name: string;
  path: string;
  description: string;
  modified?: string;
  aboutId?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    inLanguage: siteConfig.language,
    ...(params.modified ? { dateModified: params.modified } : {}),
    ...(params.aboutId ? { about: { "@id": params.aboutId } } : {}),
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function datasetSchema(params: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    creator: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    license: absoluteUrl("/kullanim-kosullari/"),
  };
}

export function quizSchema(params: {
  name: string;
  description: string;
  path: string;
  numberOfQuestions: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    about: {
      "@type": "Thing",
      name: "Türkiye Coğrafyası",
    },
    educationalLevel: "Ortaokul, Lise",
    numberOfQuestions: params.numberOfQuestions,
  };
}
