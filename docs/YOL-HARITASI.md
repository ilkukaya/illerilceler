# illerilceler.com — Durum, Yapılanlar ve Yol Haritası

_Son güncelleme: 26 Eylül 2026_

Bu belge; sitenin başlangıçtaki durumunu, bu turda yapılan tüm işleri, **sizin yapmanız gereken
(benim yapamadığım) ücretsiz adımları** ve büyüme planını tek yerde toplar. Teknik bilgi
gerektirmeyecek şekilde yazılmıştır.

---

## 1. Başlangıç durumu (tespit)

| Alan | Durum | Sorun |
|---|---|---|
| Teknik altyapı | Astro statik site, Netlify'da `illerilceler.netlify.app` adresinde yayında | `illerilceler.com` alan adı Netlify'a bağlı değil; tüm canonical/sitemap adresleri bağlı olmayan alan adını gösteriyordu |
| Tasarım | Mor/pastel renkler, her yerde renkli ikon kutuları, yapay illüstrasyonlar | "Yapay zekâ şablonu" görünümü; ana sayfadaki şematik harita başka bir kartın üstüne taşıyordu |
| İçerik | 81 il + 973 ilçe için gerçek TÜİK verisi | 69 il ve 928 ilçede neredeyse hiç metin yoktu (Google için "zayıf içerik") |
| Veri doğruluğu | Nüfus/yüzölçümü doğru | 30'dan fazla il komşuluğu hatalıydı (ör. Adıyaman–Mardin); Türkçe ekler bozuktu ("Ankara'nin", "İzmir'nin"); bazı eski SSS'ler 2024 verisi veriyordu |
| Güvenilirlik | — | Olmayan 32.000 mahalle/18.000 köy sayfası vaat ediliyordu; var olmayan sosyal medya hesapları yapısal veride yayınlanıyordu |
| Gelir | Sadece boş "Reklam" kutuları | AdSense, analiz, çerez onayı, ads.txt, affiliate yoktu |
| SEO/AEO/GEO | Temel meta etiketler | Paylaşım görseli SVG (sosyal ağlar göstermez), yapay zekâ botları için llms.txt yok, site haritası tek parça, güvenlik/önbellek başlıkları yok |

## 2. Bu turda yapılanlar

### Tasarım ve kullanıcı deneyimi
- **Yeni görsel kimlik ("Atlas"):** sıcak kâğıt tonu zemin, mürekkep siyahı metin, tek vurgu rengi
  olarak Türk kırmızısı, başlıklarda serif yazı (ansiklopedi hissi), gövdede Inter. Pastel kutular,
  degrade ve sahte illüstrasyonlar kaldırıldı. Açık + koyu tema.
- **Gerçek Türkiye haritası:** 81 ilin gerçek sınırları. Ana sayfada tıklanabilir, bölge / nüfus /
  nüfus yoğunluğu renklendirmeli; her il ve ilçe sayfasında il vurgulu konum haritası.
- **Yeni sayfa düzeni:** her sayfanın en üstünde tek cümlelik "cevap kutusu", yanda Vikipedi tarzı
  künye kutusu (harita + temel bilgiler), sıralanabilir tablolar, içindekiler, SSS.
- **Mobil öncelikli:** 44 px dokunma alanları, yatay kaydırmasız tablolar, mobil menü, `/` ve
  Ctrl/⌘+K ile açılan hızlı arama (klavyeyle gezinme destekli).
- **Hızlı sorgular:** ana sayfada "Plaka → il", "Alan kodu → il" ve "İki il arası km" kutuları.

### İçerik ve veri
- **81 il + 973 ilçenin tamamına** gerçek veriden üretilen, doğru Türkçe ekli paragraflar:
  Türkiye sıralaması, nüfus yoğunluğu karşılaştırması, en kalabalık/en az nüfuslu ilçe, komşular,
  Ankara'ya ve en yakın ile uzaklık. Her sayfada 6–10 soruluk SSS.
- **Komşu iller** harita geometrisinden yeniden hesaplandı (hatalar düzeltildi).
- İstanbul ilçelerinde doğru alan kodu (Anadolu Yakası 0216, Avrupa Yakası 0212).
- Yanlış/uydurma bilgiler temizlendi (olmayan mahalle/köy sayfaları, doğrulanmamış "120+ park" gibi
  ifadeler, yanlış dağ konumu).

### Yeni sayfalar (toplam ~4.700 sayfa)
- **3.240 "X – Y arası kaç km?" sayfası** (her il çifti): kuş uçuşu mesafe, tahmini karayolu ve
  sürüş süresi (açıkça "tahmini" etiketli), yön, iki ilin karşılaştırması, harita, otobüs/otel
  bağlantıları. Türkiye'de en çok aranan sorgu türlerinden biri.
- **81 "İlden tüm illere mesafe"** tablosu (`/iller/ankara/mesafeler/`).
- **Sıralamalar:** nüfus, yüzölçümü, nüfus yoğunluğu, rakım, ilçe sayısı, 973 ilçenin nüfus sıralaması.
- **Açık veri** (`/acik-veri/`): 81 il ve 973 ilçe CSV/JSON indirme — öğrencilerin, geliştiricilerin
  ve blogların bağlantı vermesini (backlink) sağlar.
- **Hakkımızda, yöntem, iletişim** (çalışan form), yenilenmiş gizlilik/çerez/kullanım koşulları.

### SEO / AEO / GEO
- Netlify'daki gerçek adres otomatik olarak canonical, sitemap ve robots.txt'ye yazılır; alan adı
  bağlandığında kendiliğinden ona geçer.
- Zengin yapısal veri (JSON-LD): AdministrativeArea (nüfus, yüzölçümü, plaka, alan kodu, koordinat),
  FAQPage, BreadcrumbList, ItemList, Dataset, WebSite + site içi arama.
- **Yapay zekâ arama motorları (GEO):** `llms.txt` ve `llms-full.txt` (81 ilin tüm verisi),
  robots.txt'de ChatGPT, Claude, Perplexity, Gemini, Copilot botlarına açık izin, her sayfada
  alıntılanabilir cevap cümlesi, kaynak ve tarih bilgisi.
- Bölümlere ayrılmış site haritası (çekirdek / iller / ilçeler / mesafe) + `lastmod`.
- Her il ve ilçe için gerçek haritalı **paylaşım görseli** (WhatsApp, X, Facebook önizlemesi).
- Güvenlik ve önbellek başlıkları, 301 yönlendirmeler, favicon/uygulama ikonları, PWA manifest.

### Gelir altyapısı (anahtarlar girildiğinde kendiliğinden açılır)
- **Google AdSense:** reklam alanları sayfalara yerleştirildi; kimlik girilene kadar canlı sitede
  hiçbir boş kutu görünmez. `ads.txt` otomatik üretilir.
- **Google Analytics 4** ve **KVKK/GDPR çerez onayı** (Google Consent Mode v2).
- **Affiliate (iş ortaklığı):** her il/ilçe ve mesafe sayfasında otel (Booking.com), otobüs
  (oBilet), uçak (Aviasales/Skyscanner) ve araç kiralama bağlantıları; kimlik girildiğinde komisyonlu
  bağlantıya dönüşür ve "Sponsorlu" etiketlenir.
- **İletişim formu:** Netlify Forms (ücretsiz, ayda 100 mesaj).

## 3. Sizin yapmanız gerekenler (hepsi ücretsiz, sırasıyla)

> Anahtar/kimlik gerektiren adımları sizin hesabınızla yapmanız gerekiyor. Her birinin sonunda
> aldığınız kodu **Netlify → Site configuration → Environment variables** bölümüne ekleyip
> "Trigger deploy" demeniz yeterli; kod değişikliği gerekmez. İsterseniz kodları bana verin, ben
> ekleyeyim.

1. **Alan adını bağlayın (en önemli adım).** `illerilceler.com` size aitse: Netlify → Domain
   management → Add a domain → `illerilceler.com`. Alan adı sağlayıcınızda Netlify'ın verdiği DNS
   kayıtlarını girin. HTTPS otomatik gelir. Ardından ortam değişkeni:
   `SITE_URL = https://illerilceler.com`. Alan adınız yoksa bir kayıt firmasından ~yıllık
   200–400 TL'ye alınabilir (tek ücretli kalem).
2. **Google Search Console** (search.google.com/search-console): siteyi ekleyin, "HTML etiketi"
   yöntemindeki kodu `PUBLIC_GOOGLE_SITE_VERIFICATION` olarak girin. Sonra `sitemap.xml`'i gönderin.
3. **Bing Webmaster Tools** (bing.com/webmasters): Search Console'dan içe aktarın (ChatGPT araması
   Bing dizinini de kullanır). Kod: `PUBLIC_BING_SITE_VERIFICATION`.
4. **Yandex Webmaster** (Türkiye'de ikinci büyük arama motoru): `PUBLIC_YANDEX_VERIFICATION`.
5. **Google Analytics 4:** mülk oluşturun, `G-XXXX` kimliğini `PUBLIC_GA_ID` olarak girin.
6. **Google AdSense:** site en az 2–4 hafta yayında kalıp Search Console'da indekslenmeye
   başladıktan sonra başvurun. Onay gelince `PUBLIC_ADSENSE_CLIENT = ca-pub-...` ve bir "Görüntülü
   reklam" biriminin kimliğini `PUBLIC_ADSENSE_SLOT` olarak girin. (AB ziyaretçileri için AdSense
   panelindeki "Gizlilik ve mesajlaşma" bölümünden Google'ın ücretsiz onay mesajını da açın.)
7. **Affiliate programları:**
   - Booking.com Affiliate Partner Programme → `PUBLIC_BOOKING_AID`
   - Travelpayouts (uçak, otel, araç kiralama; Türkiye'ye açık) → `PUBLIC_TRAVELPAYOUTS_MARKER`
   - oBilet iş ortaklığı (başvuru ile) → `PUBLIC_OBILET_PARTNER`
8. **Netlify Forms:** proje ayarlarında "Forms" açık olmalı (bu turda açıldı; kontrol edin).
   Gelen mesajlar için Forms → Notifications'dan e-posta bildirimini açın.
9. **E-posta:** `iletisim@illerilceler.com` adresi sitede yazıyor. Alan adı sağlayıcınızın ücretsiz
   e-posta yönlendirmesiyle bu adresi kendi Gmail'inize yönlendirin (ya da bana başka bir adres verin).

## 4. Büyüme planı (öncelik sırasıyla)

**İlk 30 gün**
- Alan adı + Search Console + Bing + sitemap gönderimi.
- İlk sayfaların indekslenmesini izleyin (Search Console → Sayfalar). 4.700 sayfanın tamamının
  indekslenmesi haftalar–aylar sürer; bu normaldir.
- Açık veri sayfasını öğretmen/öğrenci forumları, Ekşi Sözlük, GitHub, Reddit r/Turkey gibi
  yerlerde paylaşın (doğal backlink).

**1–3 ay**
- AdSense başvurusu ve affiliate hesapları.
- Search Console'da "gösterim çok, tıklama az" sayfaların başlıklarını iyileştirme.
- En çok trafik alan 50 il/ilçe için elle yazılmış, özgün tanıtım paragrafları (tarihçe, turizm,
  yöresel lezzetler) — editöryal derinlik E-E-A-T için önemli.
- Lisanslı gerçek fotoğraflar (Wikimedia Commons, kendi çekimleriniz) → görsel sistemi hazır;
  `src/assets/locations/...` klasörüne eklemek yeterli.

**3–12 ay (içerik genişletme — en büyük trafik potansiyeli)**
- **Mahalle ve posta kodu veritabanı:** PTT'nin resmî posta kodu listesi ile ~50.000 mahalle/köy
  sayfası. Türkiye'de "X mahallesi posta kodu" aramaları çok yüksek hacimlidir.
- **Karayolu mesafeleri:** KGM'nin resmî iller arası mesafe cetveliyle "tahmini" değerlerin
  gerçek karayolu mesafesiyle değiştirilmesi.
- Hava durumu (MGM), eczane, üniversite, hastane, havalimanı gibi il bazlı rehber modülleri.
- Seçim sonuçları, TÜİK yıllık yeni nüfus verisi (her Şubat) ile otomatik güncelleme.

**Gerçekçi beklenti:** "Dünyanın en çok ziyaret edilen sitesi" hedefi yerine, Türkiye'de il/ilçe/
plaka/mesafe sorgularında ilk 3'e girmek gerçekçi ve çok değerli bir hedeftir. Bu niş aylık
milyonlarca aramaya sahiptir. Trafik; alan adı, indeksleme süresi ve backlink'lere bağlı olarak
genellikle 3–9 ayda belirgin şekilde artar. AdSense geliri Türkiye trafiğinde düşük (1.000
görüntüleme başına tipik olarak birkaç dolar) olduğundan, mesafe ve il sayfalarındaki seyahat
affiliate bağlantıları gelirin önemli bir parçası olabilir.

## 5. Teknik notlar

- Her `git push` sonrasında Netlify siteyi otomatik derler ve yayınlar.
- Yerel çalıştırma: `npm install` → `npm run dev`. Tam derleme: `npm run build`.
- Tüm veri `src/data/` altındadır; il/ilçe metinleri `src/utils/content.ts` tarafından veriden
  üretilir. Ayrıntılar README'de.
