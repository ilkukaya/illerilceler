# illerilceler.com — Türkiye'nin 81 İli ve 973 İlçesi

Türkiye'nin illeri ve ilçeleri için resmî verilere (TÜİK ADNKS 2025, Harita Genel Müdürlüğü, Türk
Telekom) dayanan, hızlı ve SEO/AEO/GEO odaklı bilgi rehberi. Astro ile statik üretilir (~4.700
sayfa), Netlify'da yayınlanır.

> **Durum, yapılanlar ve yapılacaklar için:** [`docs/YOL-HARITASI.md`](docs/YOL-HARITASI.md)

## Hızlı başlangıç

```bash
npm install
npm run dev      # paylaşım görsellerini üretir + http://localhost:4321
npm run build    # görseller + tip kontrolü + üretim derlemesi → dist/
```

## Sayfalar

| Yol | İçerik |
|---|---|
| `/` | Arama, hızlı sorgular (plaka, alan kodu, mesafe), interaktif harita, 81 il dizini, sıralamalar |
| `/iller/`, `/iller/{il}/` | 81 il tablosu; il sayfası (cevap kutusu, künye, ilçe tablosu, komşular, mesafeler, SSS) |
| `/iller/{il}/ilceler/`, `/iller/{il}/{ilce}/` | İlin ilçeleri; ilçe sayfası |
| `/iller/{il}/mesafeler/` | İlden diğer 80 ile kuş uçuşu mesafeler |
| `/mesafe/`, `/mesafe/{il1}-{il2}/` | 3.240 il çifti (slug'lar alfabetik) |
| `/plaka-kodlari/{kod}/`, `/alan-kodlari/{kod}/`, `/posta-kodlari/{kod}/` | Kod sayfaları |
| `/istatistikler/…` | Nüfus, yüzölçümü, yoğunluk, rakım, ilçe sayısı, ilçe nüfusu sıralamaları |
| `/haritalar/turkiye-haritasi/` | Tam ekran interaktif il haritası |
| `/acik-veri/`, `/veri/*.csv|json` | Açık veri indirmeleri |
| `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`, `/ads.txt` | Tarayıcılar ve yapay zekâ motorları için |

## Mimari

```text
src/
  config/site.ts            Site sabitleri (canonical adres astro.config.mjs'ten gelir)
  config/monetization.ts    AdSense / GA4 / affiliate / doğrulama kodları (ortam değişkenleri)
  data/                     Tüm veri: provinces.ts, districts.ts, regions.ts, turkeyMap.ts (üretilir) …
  utils/content.ts          Veriden il/ilçe paragrafları ve SSS üretir
  utils/turkish.ts          Türkçe ek uyumu (Ankara'nın, İzmir'in, 34'tür, %6'sı)
  utils/rankings.ts         Sıralamalar, yoğunluk, en yakın iller
  utils/sitemap.ts          Bölümlü site haritası
  components/geography/     ProvinceMap (interaktif), LocatorMap (sprite tabanlı küçük harita)
  components/content/       InfoBox, SortableTable, FAQAccordion, TravelLinks, AdSlot …
  components/seo/           SEOHead, StructuredData, ConsentAndAnalytics
  styles/global.css         Tasarım token'ları (açık/koyu tema)
scripts/
  build-map-data.ts         Harita sınırlarını sadeleştirip src/data/turkeyMap.ts üretir (npm run map:build)
  generate-og-images.ts     1.055 paylaşım görseli + ikonlar (prebuild'de çalışır)
  vendor/, fonts/           Harita kaynağı (MIT) ve OG fontları (OFL)
```

### İlkeler
- **Tek veri kaynağı:** sayfalardaki her cümle `src/data`'dan hesaplanır; tablo ile metin çelişmez.
- **Dürüstlük:** tahmini değerler (karayolu mesafesi, süre) her zaman "tahmini" etiketlidir;
  doğrulanmamış veri yayınlanmaz.
- **Hız:** sıfır UI framework, sayfa başına minimal JS; arama indeksi ayrı JSON olarak ilk
  kullanımda yüklenir; küçük haritalar önbelleklenen tek bir SVG sprite kullanır.

## Ortam değişkenleri (Netlify → Site configuration → Environment variables)

| Değişken | Açıklama |
|---|---|
| `SITE_URL` | Canonical adres (ör. `https://illerilceler.com`). Boşsa Netlify'ın adresi kullanılır |
| `PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_BING_SITE_VERIFICATION`, `PUBLIC_YANDEX_VERIFICATION` | Arama motoru doğrulama kodları |
| `PUBLIC_GA_ID` | Google Analytics 4 (`G-…`) |
| `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ADSENSE_SLOT` | AdSense yayıncı ve reklam birimi kimlikleri (`_INARTICLE`, `_SIDEBAR`, `_LEADERBOARD` isteğe bağlı) |
| `PUBLIC_BOOKING_AID`, `PUBLIC_TRAVELPAYOUTS_MARKER`, `PUBLIC_OBILET_PARTNER` | Affiliate kimlikleri |
| `PUBLIC_CONSENT_BANNER=off` | Google'ın kendi onay mesajı kullanılıyorsa yerleşik banner'ı kapatır |

Kimlikler girilmeden hiçbir üçüncü taraf betiği yüklenmez ve canlı sitede boş reklam kutusu görünmez.

## Veri güncelleme
TÜİK her yıl Şubat'ta yeni ADNKS sonuçlarını yayınlar. `src/data/provinces.ts` ve
`src/data/districts.ts` içindeki `population` / `populationYear` alanlarını güncelleyip push etmek
yeterlidir; tüm metinler, sıralamalar, sitemap ve paylaşım görselleri otomatik yenilenir.

## Lisanslar
- İl sınırları: [turkey-map-react](https://github.com/erdigokce/turkey-map-react) (MIT) — `scripts/vendor/`
- Fontlar: Inter, Source Serif 4 (SIL Open Font License) — `scripts/fonts/`
