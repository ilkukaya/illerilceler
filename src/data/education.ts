import type {
  EducationActivity,
  EducationTopic,
  GradeLevel,
  QuizDefinition,
} from "@/types";

export const gradeLevels: GradeLevel[] = [
  {
    slug: "ilkokul",
    name: "İlkokul",
    description: "Kolay ve eğlenceli anlatımlarla temel coğrafya bilgileri.",
    icon: "backpack",
    color: "blue",
  },
  {
    slug: "ortaokul",
    name: "Ortaokul",
    description:
      "Detaylı konu anlatımları ve alıştırmalarla sosyal bilgiler desteği.",
    icon: "book-open",
    color: "green",
  },
  {
    slug: "lise",
    name: "Lise",
    description: "Akademik içerikler, coğrafya sınavlarına hazırlık notları.",
    icon: "graduation-cap",
    color: "purple",
  },
  {
    slug: "test-quiz",
    name: "Test & Quiz",
    description: "Öğren ve eğlen; bilgini kısa testlerle ölç.",
    icon: "puzzle",
    color: "orange",
  },
];

export const educationTopics: EducationTopic[] = [
  {
    slug: "81-il-ve-plakalari",
    title: "81 İl ve Plakaları",
    description: "81 ilimizi ve plaka kodlarını öğren.",
    icon: "car",
    href: "/egitim/81-il-ve-plakalari/",
  },
  {
    slug: "turkiye-bolgeleri",
    title: "Türkiye Bölgeleri",
    description: "7 coğrafi bölgemizi keşfedin.",
    icon: "map",
    href: "/haritalar/turkiye-haritasi/",
  },
  {
    slug: "daglar-ve-ovalar",
    title: "Dağlar ve Ovalar",
    description: "Türkiye'nin önemli dağları ve ovaları.",
    icon: "mountain",
    href: "/istatistikler/",
  },
  {
    slug: "nehirler-ve-goller",
    title: "Nehirler ve Göller",
    description: "Nehirlerimiz, göllerimiz hakkında bilgiler.",
    icon: "waves",
    href: "/istatistikler/",
  },
  {
    slug: "iklim-tipleri",
    title: "İklim Tipleri",
    description: "Türkiye'de görülen iklim çeşitleri.",
    icon: "cloud-sun",
    href: "/rehber/",
  },
  {
    slug: "komsu-ulkeler",
    title: "Komşu Ülkeler",
    description: "Türkiye'nin sınır komşuları.",
    icon: "flag",
    href: "/rehber/",
  },
];

export const educationActivities: EducationActivity[] = [
  {
    slug: "il-bulmaca",
    title: "İl Bulmaca",
    description: "Hangi ipucu hangi ile ait, bul bakalım.",
    icon: "help-circle",
    href: "/egitim/quiz/",
  },
  {
    slug: "harita-testi",
    title: "Harita Testi",
    description: "Haritada iller ne kadar iyi biliyorsun?",
    icon: "map-pinned",
    href: "/haritalar/turkiye-haritasi/",
  },
  {
    slug: "kelime-oyunu",
    title: "Kelime Oyunu",
    description: "Şehir isimleriyle kelime oyunu oyna.",
    icon: "gamepad-2",
    href: "/egitim/quiz/",
  },
  {
    slug: "eslestirme",
    title: "Eşleştirme",
    description: "İlleri plaka kodlarıyla eşleştir.",
    icon: "shuffle",
    href: "/egitim/81-il-ve-plakalari/",
  },
  {
    slug: "dogru-yanlis",
    title: "Doğru Yanlış",
    description: "Türkiye coğrafyası hakkında doğru mu yanlış mı?",
    icon: "check-circle-2",
    href: "/egitim/quiz/",
  },
  {
    slug: "rastgele-soru",
    title: "Rastgele Soru",
    description: "Şansını dene, rastgele bir soru cevapla.",
    icon: "dices",
    href: "/egitim/quiz/",
  },
];

export const quizzes: QuizDefinition[] = [
  {
    slug: "genel-kultur",
    title: "Türkiye Coğrafyası Quiz",
    description: "İller, plakalar ve coğrafya bilgini test et.",
    durationMinutes: 3,
    questions: [
      {
        id: "q1",
        question: "47 plaka kodu hangi ile aittir?",
        options: ["Mardin", "Muğla", "Malatya", "Manisa"],
        correctIndex: 0,
        explanation: "47 plaka kodu Mardin iline aittir.",
      },
      {
        id: "q2",
        question: "Türkiye'nin en yüksek dağı hangisidir?",
        options: ["Erciyes Dağı", "Ağrı Dağı", "Kaçkar Dağı", "Uludağ"],
        correctIndex: 1,
        explanation:
          "Ağrı Dağı, 5.137 metre ile Türkiye'nin en yüksek dağıdır.",
      },
      {
        id: "q3",
        question: "İstanbul'da Anadolu Yakası'nın alan kodu kaçtır?",
        options: ["0212", "0216", "0312", "0232"],
        correctIndex: 1,
        explanation: "İstanbul Anadolu Yakası'nın alan kodu 0216'dır.",
      },
      {
        id: "q4",
        question:
          "Aşağıdakilerden hangisi Türkiye'nin 7 coğrafi bölgesinden biri değildir?",
        options: [
          "Karadeniz Bölgesi",
          "Ege Bölgesi",
          "Kuzeydoğu Anadolu Bölgesi",
          "Marmara Bölgesi",
        ],
        correctIndex: 2,
        explanation:
          "Türkiye'nin 7 coğrafi bölgesi: Marmara, Ege, Akdeniz, İç Anadolu, Karadeniz, Doğu Anadolu ve Güneydoğu Anadolu'dur.",
      },
      {
        id: "q5",
        question: "Türkiye'nin yüzölçümü bakımından en büyük ili hangisidir?",
        options: ["Ankara", "Konya", "Şanlıurfa", "Sivas"],
        correctIndex: 1,
        explanation:
          "Konya, 40.838 km² ile Türkiye'nin yüzölçümü bakımından en büyük ilidir.",
      },
      {
        id: "q6",
        question: "Türkiye'nin en büyük gölü hangisidir?",
        options: ["Tuz Gölü", "Beyşehir Gölü", "Van Gölü", "Eğirdir Gölü"],
        correctIndex: 2,
        explanation:
          "Van Gölü, yaklaşık 3.755 km² ile Türkiye'nin en büyük gölüdür.",
      },
      {
        id: "q7",
        question: "İstanbul'un kaç ilçesi vardır?",
        options: ["30", "39", "25", "45"],
        correctIndex: 1,
        explanation: "İstanbul'un 39 ilçesi vardır.",
      },
      {
        id: "q8",
        question: "312 alan kodu hangi ile aittir?",
        options: ["İzmir", "Bursa", "Ankara", "Konya"],
        correctIndex: 2,
        explanation: "312 alan kodu Ankara iline aittir.",
      },
    ],
  },
];
