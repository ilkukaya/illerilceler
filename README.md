# illerilceler.com — Türkiye Bilgi Merkezi

Türkiye'nin illeri, ilçeleri, mahalleleri, plaka kodları, alan kodları, posta kodları ve coğrafi bilgileri için
tasarlanmış, hızlı, erişilebilir ve SEO/AEO odaklı bir bilgi platformu. Astro ile statik olarak üretilir,
minimal JavaScript kullanır ve on binlerce sayfaya ölçeklenebilecek bir veri/komponent mimarisiyle kurulmuştur.

## İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Klasör Yapısı](#klasör-yapısı)
- [Yerel Geliştirme](#yerel-geliştirme)
- [Build Komutları](#build-komutları)
- [Veri Modeli](#veri-modeli)
- [Yeni İçerik Ekleme](#yeni-i̇çerik-ekleme)
- [SEO / AEO Mimarisi](#seo--aeo-mimarisi)
- [Erişilebilirlik ve Performans](#erişilebilirlik-ve-performans)
- [Reklam Alanları](#reklam-alanları)
- [Deployment](#deployment)
- [Gerçek Veri Kaynağına Geçiş](#gerçek-veri-kaynağına-geçiş)

## Özellikler

- **Anasayfa** — arama, popüler aramalar, kategori menüsü, şematik Türkiye haritası, ulusal istatistikler, günün
  bilgisi, eğitim köşesi ve hızlı araçlar.
- **İl / ilçe sayfaları** — her il ve (12 öncelikli il için) her ilçe için özet kartlar, sekmeli/anchor tabanlı
  bölümler, konum haritası, SSS ve ilgili aramalar.
- **Kod sayfaları** — plaka kodu, alan kodu ve posta kodu için "kısa cevap" bloklu, AEO'ya uygun sayfalar
  (`/plaka-kodlari/47/`, `/alan-kodlari/312/`, `/posta-kodlari/34718/`).
- **Arama** — istemci tarafında çalışan, Türkçe karakter normalizasyonlu fuzzy arama; hem üst çubuktaki
  komut-paleti (⌘K/Ctrl+K) hem de `/arama/` sonuç sayfası aynı indeksi kullanır.
- **Türkiye Haritası** — 7 coğrafi bölgeyi gösteren, tıklanabilir/yakınlaştırılabilir şematik CSS-grid harita
  (dış harita servisi kullanılmaz).
- **Eğitim Köşesi** — çalışan çoktan seçmeli quiz, "81 İl ve Plakaları" flashcard çalışma aracı.
- **Araçlar** — Haversine formülüyle gerçek koordinat hesaplaması yapan şehirler arası mesafe hesaplayıcı ve
  NOAA güneş açısı denklemleriyle çalışan güneş doğuşu/batışı hesaplayıcı.
- **Karanlık mod**, tam duyarlı (responsive) tasarım, erişilebilir bileşenler (native `<details>` accordion,
  odak halkaları, `aria-*` etiketleri, atla-bağlantısı).

## Teknoloji Yığını

- [Astro](https://astro.build) (statik çıktı, `output: "static"`)
- TypeScript (strict mode)
- Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first tema tanımı)
- Sıfır UI framework — etkileşimler vanilla TypeScript `<script>` adacıklarıyla yazılmıştır (React/Vue/Svelte
  yoktur; bu ölçekte gerekmediği için bilinçli olarak eklenmemiştir)
- [lucide-static](https://lucide.dev) ikon seti (build-time'da inline SVG olarak gömülür)
- `@fontsource-variable/plus-jakarta-sans` (self-hosted değişken font)

## Klasör Yapısı

```text
src/
  components/
    brand/        Logo, marka işareti
    layout/        Header, Footer, Breadcrumbs, PageContainer, MobileMenu...
    search/        Arama kutusu, komut paleti, sonuç kartı
    cards/         StatCard, CategoryCard, CityCard, DistrictCard...
    geography/      TurkeyMap, LocationMapCard, SceneArt (illüstrasyon)
    content/        FAQAccordion, InfoTable, RelatedSearches, AdSlot...
    education/      Quiz motoru, eğitim illüstrasyonu, sınıf kartları
    code-pages/     Plaka görseli, büyük kod hero'su, özet kartı
    seo/            SEOHead, StructuredData (JSON-LD)
  data/            Tüm demo veri kaynağı (bkz. Veri Modeli)
  layouts/         BaseLayout.astro (tek layout, tüm sayfalar bunu kullanır)
  pages/           Dosya tabanlı route'lar (bkz. aşağıdaki route haritası)
  styles/          global.css (tasarım token'ları + Tailwind tema eşlemesi)
  utils/           format, search, slugify, seo, distance, sunTimes, content...
  types/           Paylaşılan TypeScript tipleri
  config/          site.ts (site geneli sabitler)
public/
  icons/, images/, maps/, fonts/   statik varlıklar
```

### Route haritası (özet)

```text
/                                                  Anasayfa
/iller/                                            İl listesi (filtre + arama)
/iller/[il]/                                        İl detay sayfası (81 il)
/iller/[il]/ilceler/                                 İlçe listesi (12 öncelikli il)
/iller/[il]/[ilce]/                                  İlçe detay sayfası
/ilceler/  /mahalleler/  /koyler/                    Ulusal kapsam merkez sayfaları
/plaka-kodlari/  /plaka-kodlari/[kod]/                Plaka kodu index + detay (01–81)
/alan-kodlari/  /alan-kodlari/[kod]/                  Alan kodu index + detay
/posta-kodlari/  /posta-kodlari/[kod]/                Posta kodu index + detay
/haritalar/  /haritalar/turkiye-haritasi/             Harita sayfaları
/istatistikler/  /istatistikler/en-kalabalik-iller/  /istatistikler/yuzolcumune-gore-en-buyuk-iller/
/egitim/  /egitim/quiz/  /egitim/81-il-ve-plakalari/  Eğitim köşesi
/araclar/  /araclar/iki-sehir-arasi-mesafe/  /araclar/gunes-dogusu-batisi/
/arama/                                              Arama sonuçları (istemci taraflı)
/rehber/  /gizlilik/  /cerez-politikasi/  /kullanim-kosullari/  /iletisim/
/sitemap.xml  /robots.txt  /404
```

## Yerel Geliştirme

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build Komutları

```bash
npm run check       # astro check (TypeScript + Astro şablon doğrulama)
npm run build        # check + production build -> dist/
npm run preview       # üretim build'ini yerelde servis eder
npm run format        # Prettier (+ prettier-plugin-astro)
```

`npm run build` her zaman önce `astro check` çalıştırır; tip hatası varsa build durur.

## Veri Modeli

Tüm içerik `src/data/*.ts` dosyalarında saklanır; sayfalar bu dosyalardan okur, veri şablonlarda
**tekrarlanmaz** (bkz. proje talimatı "no duplicate data across templates").

| Dosya | İçerik |
|---|---|
| `provinces.ts` | 81 ilin tamamı (plaka, alan kodu, bölge, temel istatistikler); 12 öncelikli il için tam
  içerik (özet, tarihçe, ekonomi, turizm, SSS, kaynaklar) |
| `districts.ts` | İstanbul'un 39 ilçesi + diğer öncelikli illerden seçili ilçeler tam kayıt; geri kalan
  ilçeler `districtNamesByProvince` üzerinden isim listesinden **otomatik üretilen** (stub) kayıtlardır — bu
  sayede her ilçe adı gerçek, kırık olmayan bir sayfaya bağlanır |
| `neighborhoods.ts` | Kadıköy'ün 21 mahallesi (posta koduyla birlikte) |
| `plateCodes.ts`, `areaCodes.ts` | `provinces.ts`'den **türetilir** (elle kopyalanmaz) |
| `postalCodes.ts` | `neighborhoods.ts`'den türetilen + birkaç ek örnek kayıt |
| `regions.ts` | 7 coğrafi bölge |
| `geography.ts` | Ulusal istatistikler, "Günün Bilgisi" kayıtları, dağ/nehir/göl listeleri |
| `education.ts` | Sınıf seviyeleri, konular, etkinlikler, quiz soru bankası |
| `searchIndex.ts` | Yukarıdaki tüm kaynaklardan **build-time'da** derlenen tekleştirilmiş arama indeksi |
| `sources.ts` | Kurumsal kaynak listesi (TÜİK, PTT, BTK vb.) ve veri sorumluluk reddi metni |

Demo/örnek olan sayısal alanlar `isDemoData: true` ile işaretlenmiştir. Her il/ilçe sayfasında bir
**Kaynaklar** kartı ve sitenin altbilgisinde sabit bir uyarı metni bulunur.

### Tipler

Bakınız `src/types/index.ts` — `Province`, `District`, `Neighborhood`, `PlateCode`, `AreaCode`, `PostalCode`,
`Region`, `FAQItem`, `QuizDefinition` vb.

## Yeni İçerik Ekleme

### Yeni bir il için detaylı içerik eklemek

1. `src/data/provinces.ts` içinde ilgili ilin objesine `summary`, `overview`, `economy`, `tourism`,
   `transportation`, `education`, `famousFor`, `popularPlaces`, `faqs`, `sources` alanlarını ekleyin.
2. İlçe listesi göstermek istiyorsanız `src/data/districts.ts` içindeki `districtNamesByProvince` sözlüğüne
   ilin tüm ilçe adlarını ekleyin — sayfalar otomatik olarak üretilir (`getStaticPaths`).
3. Daha zengin ilçe kartları için `districts` dizisine tam `District` kayıtları ekleyebilirsiniz (opsiyonel;
   eklenmeyen ilçeler isim listesinden stub sayfa olarak üretilmeye devam eder).

### Yeni bir ilçe için tam içerik eklemek

`src/data/districts.ts` → `districts` dizisine yeni bir obje ekleyin (bkz. `kadikoy` kaydı örnek olarak en
kapsamlı olanıdır). `provinceSlug` ve `slug` alanları, `districtNamesByProvince` listesindeki adın
`turkishSlugify()` ile ürettiği slug'la eşleşmelidir.

### Yeni bir kod sayfası eklemek

- **Plaka kodu:** `provinces.ts`'e yeni il eklemek yeterlidir; `plateCodes.ts` otomatik türetir.
- **Alan kodu:** İlin `areaCodes` dizisine kodu ekleyin; `areaCodes.ts` otomatik türetir.
- **Posta kodu:** `postalCodes.ts` içindeki `extra` dizisine `{ code, provinceSlug, districtSlug }` ekleyin
  ya da `neighborhoods.ts`'e mahalle + posta kodu ekleyin (otomatik olarak posta kodu listesine dahil olur).

### Demo verinin gerçek veriyle değiştirilmesi

Tüm sayısal/istatistiksel alanlar `src/data/*.ts` dosyalarında merkezi olarak tutulur. Gerçek bir veri
kaynağına (TÜİK, PTT, BTK API'leri gibi) geçerken sadece bu dosyaların içeriğini güncellemeniz yeterlidir;
bileşenler ve sayfalar değişmeden çalışmaya devam eder. Bkz.
[Gerçek Veri Kaynağına Geçiş](#gerçek-veri-kaynağına-geçiş).

## SEO / AEO Mimarisi

- `src/components/seo/SEOHead.astro` — başlık, meta açıklama, canonical, Open Graph, Twitter Card.
- `src/components/seo/StructuredData.astro` — herhangi bir JSON-LD objesini/dizisini `<script type="application/ld+json">`
  olarak basar.
- `src/utils/seo.ts` — `websiteSchema`, `organizationSchema`, `breadcrumbListSchema`, `faqPageSchema`,
  `administrativeAreaSchema`, `webPageSchema`, `itemListSchema`, `quizSchema` üretici fonksiyonları.
- Her kod/il/ilçe sayfası, sayfanın en üstünde alıntılanabilir bir **"kısa cevap"** bloğu içerir (ör. "47
  plaka kodu Mardin iline aittir.") — AI cevap motorları ve öne çıkan snippet'ler için optimize edilmiştir.
- `src/pages/sitemap.xml.ts` — tüm statik ve dinamik route'ları veri katmanından programatik olarak üretir.
- `public/robots.txt` — sitemap referansı içerir.
- Breadcrumb şeması **yalnızca** `Breadcrumbs.astro` bileşeni tarafından üretilir; sayfa seviyesinde tekrar
  eklenmemelidir (çift şema önlemek için).

## Erişilebilirlik ve Performans

- Tüm ikonlar decorative kabul edilip varsayılan olarak `aria-hidden="true"` ile render edilir; interaktif
  butonlarda anlamlı `aria-label` bulunur.
- Tek `<h1>`, sıralı başlık hiyerarşisi, semantik `<header>/<main>/<footer>/<nav>` landmark'ları her sayfada
  doğrulanmıştır.
- Atla-bağlantısı (`Skip to content`), görünür odak halkaları, `prefers-reduced-motion` desteği.
- FAQ akordeonları native `<details>/<summary>` ile, JS gerektirmeden çalışır.
- Sayfa başına JS minimaldir; arama indeksi (~76 KB) yalnızca arama açıldığında lazy-load edilir.
- Renkler CSS custom property'leri üzerinden tanımlıdır; karanlık mod bileşen başına `dark:` varyantı
  gerektirmeden otomatik uyarlanır.

## Reklam Alanları

`src/components/content/AdSlot.astro` — sabit yükseklikli (CLS'siz), "Reklam" etiketli placeholder. Gerçek bir
reklam ağına bağlanırken bu bileşenin içini ilgili ağın slot kodu ile değiştirin. Eğitim Köşesi'nde bilinçli
olarak sınırlı sayıda kullanılmıştır.

## Deployment

Proje tamamen statiktir (`output: "static"`); `dist/` klasörü herhangi bir statik hosting'e
(Netlify, Vercel, Cloudflare Pages, GitHub Pages vb.) doğrudan yüklenebilir.

```bash
npm run build
# dist/ klasörünü hosting sağlayıcınıza deploy edin
```

`astro.config.mjs` içindeki `site` alanını (şu an `https://illerilceler.com`) kendi alan adınızla
güncellemeyi unutmayın — canonical URL'ler ve sitemap bu değeri kullanır.

## Gerçek Veri Kaynağına Geçiş

Bu proje demo/gösterim verisiyle gelir. Prodüksiyona geçerken:

1. **Nüfus/yüzölçümü/rakım** — TÜİK ADNKS ve Harita Genel Müdürlüğü verileriyle `provinces.ts` /
   `districts.ts` güncellenmeli, `isDemoData` bayrakları kaldırılmalı.
2. **Posta kodları** — PTT'nin resmi posta kodu veri setiyle `postalCodes.ts` ve `neighborhoods.ts`
   genişletilmeli (973 ilçe / 32.000+ mahalle kapsamı için).
3. **Alan kodları** — BTK yayınlarıyla doğrulanmalı.
4. **Görseller** — `SceneArt.astro` ile üretilen soyut illüstrasyonların yerine lisanslı/özgün fotoğraflar
   `public/images/provinces/` ve `public/images/districts/` altına eklenip `heroImage` alanları
   güncellenerek kullanılabilir.
5. **Mesafe/güneş hesaplayıcıları** — şu an yalnızca koordinatı tanımlı 12 il için çalışır
   (`provinces.ts` → `coordinates`); tüm illere koordinat eklenmesi yeterlidir, sayfa kodu değişmez.

---

_Bu README, projenin mevcut (demo) durumunu yansıtır. Sorularınız için [/iletisim/](/iletisim/) sayfasını
kullanabilirsiniz._
