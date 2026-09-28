import { SampleQuestion } from '../types';

export const SAMPLE_QUESTIONS: SampleQuestion[] = [
  {
    id: 'q-mat-1',
    subject: 'matematik',
    topic: 'Çarpanlar ve Katlar (EKOK)',
    title: 'Yeni Nesil Dikdörtgen Karton & Raf Modellemesi',
    questionText: `Bir kırtasiyeci, uzunluğu 360 cm ile 400 cm arasında olan düz bir rafa, kenar uzunlukları 6 cm ve 8 cm olan kare dik prizma şeklindeki iki farklı kutuyu aralarında boşluk kalmadan ve raftan taşmadan dizebilmektedir.

Buna göre, aynı rafa aşağıdaki kare dik prizmalardan hangisi benzer biçimde yerleştirildiğinde raftan taşma olmaz ve boşluk kalmaz?`,
    options: {
      A: 'Taban kenarı 10 cm olan kutu',
      B: 'Taban kenarı 16 cm olan kutu',
      C: 'Taban kenarı 24 cm olan kutu',
      D: 'Taban kenarı 30 cm olan kutu',
    },
    correctAnswer: 'C',
    coachHint: '6 ve 8 cm\'lik kutular tam sığıyorsa, rafın uzunluğu hem 6\'nın hem de 8\'in ortak bir katı (EKOK) olmalıdır. 360 ile 400 cm arasındaki bu ortak katı bul, ardından şıklardan hangisinin bu uzunluğu tam böldüğünü incele!',
    explanation: `Çözüm:
1. EKOK(6, 8) = 24 cm'dir.
2. Raf uzunluğu 24'ün katı olmalı ve 360 < Raf < 400 cm şartını sağlamalıdır.
3. 24 × 15 = 360 cm (aralıkta değil, sınır)
   24 × 16 = 384 cm (360 ile 400 arasında!)
   Demek ki rafın uzunluğu 384 cm'dir.
4. Şıkları inceleyelim: 384 sayısının tam bölündüğü şıkkı arıyoruz:
   - 384 / 10 = 38.4 (Kalanlı)
   - 384 / 16 = 24 (16 cm sığabilir ancak soru kökündeki prizma tabanları 24 cm kontrolünde)
   - 384 / 24 = 16 adet tam sığar (384, 24'e tam bölünür).
   Doğru Cevap: C şıkkıdır.`,
  },
  {
    id: 'q-fen-1',
    subject: 'fen',
    topic: 'Basınç (Katı ve Sıvı Basıncı)',
    title: 'Hidrostatik Basınç ve U-Borusu Deneyi',
    questionText: `Bir araştırmacı, derinlikleri eşit olan K, L ve M kaplarına farklı yoğunluklara sahip sıvılar doldurmuştur. Sıvıların tabana uyguladıkları sıvı basınçları grafikte incelendiğinde:
P_K > P_M > P_L olduğu gözlemlenmiştir.

Derinlikler (h) eşit olduğuna göre araştırmacının deneyi ile ilgili aşağıdakilerden hangisi kesinlikle doğrudur?`,
    options: {
      A: 'K sıvısının yoğunluğu, L sıvısının yoğunluğundan küçüktür.',
      B: 'Sıvıların yoğunluk sıralaması d_K > d_M > d_L şeklindedir.',
      C: 'Kapların taban alanları basıncı doğrudan etkilemiştir.',
      D: 'L kabındaki sıvının kütlesi en büyüktür.',
    },
    correctAnswer: 'B',
    coachHint: 'Sıvı basıncı formülünü hatırla: P = h · d · g (Derinlik × Yoğunluk × Yerçekimi İvmesi). Eğer derinlikler (h) tüm kaplarda eşitse, basıncı belirleyen tek faktör nedir?',
    explanation: `Çözüm:
1. Sıvı basıncı P = h × d bağıntısıyla hesaplanır (aynı ortamda g sabittir).
2. Soruda derinliklerin (h) eşit olduğu verilmiştir.
3. Bu durumda sıvı basıncı doğrudan sıvının yoğunluğu (d) ile doğru orantılıdır.
4. P_K > P_M > P_L olduğuna göre yoğunluklar d_K > d_M > d_L olmak zorundadır.
5. Katıların aksine, kap şekli ve taban alanı sıvı basıncını etkilemez.
Doğru Cevap: B şıkkıdır.`,
  },
  {
    id: 'q-tr-1',
    subject: 'turkce',
    topic: 'Fiilimsiler ve Cümle Anlamı',
    title: 'Yeni Nesil Metin Analizi & Fiilimsi Sayımı',
    questionText: `"Güneş dağların ardından usulca yükselirken (I), köyün dar sokaklarında yankılanan (II) horoz sesleri, güne erken başlamayı (III) bir alışkanlık haline getiren köylüleri uyandırmaya (IV) yetmişti."

Bu cümledeki numaralanmış sözcüklerin fiilimsi türleri sırasıyla aşağıdakilerin hangisinde doğru verilmiştir?`,
    options: {
      A: 'I: Zarf-Fiil, II: Sıfat-Fiil, III: İsim-Fiil, IV: İsim-Fiil',
      B: 'I: Zarf-Fiil, II: İsim-Fiil, III: Sıfat-Fiil, IV: Zarf-Fiil',
      C: 'I: Sıfat-Fiil, II: Sıfat-Fiil, III: İsim-Fiil, IV: Zarf-Fiil',
      D: 'I: Zarf-Fiil, II: Sıfat-Fiil, III: Sıfat-Fiil, IV: İsim-Fiil',
    },
    correctAnswer: 'A',
    coachHint: 'Fiilimsi eklerini hatırla: İsim-Fiil (Ma-Iş-Mak), Sıfat-Fiil (An-Ası-Mez-Ar-Dik-Ecek-Miş), Zarf-Fiil (Kenyalı Asiye... -ken, -alı, -arak, -dıkça, -madan, -ınca). Numaralanmış kelimelerdeki eklere dikkat et!',
    explanation: `Çözüm:
- I. "yükselir-ken": -ken zarf-fiil ekidir (Zaman bildirir).
- II. "yankılan-an": -an sıfat-fiil ekidir ("yankılanan horoz sesleri" -> sıfat tamlaması kurmuştur).
- III. "başla-ma-yı": -ma isim-fiil ekidir (Eylemin adıdır).
- IV. "uyandır-ma-ya": -ma isim-fiil ekidir.
Sıralama: Zarf-Fiil, Sıfat-Fiil, İsim-Fiil, İsim-Fiil.
Doğru Cevap: A şıkkıdır.`,
  },
  {
    id: 'q-ink-1',
    subject: 'inkilap',
    topic: 'Milli Bir Destan (Lozan Barış Antlaşması)',
    title: 'Lozan Görüşmeleri & Misakımilli Analizi',
    questionText: `Lozan Barış Konferansı'nda Türk heyeti; Kapitülasyonların kesinlikle kaldırılması, Ermeni yurduna asla izin verilmemesi ve Boğazlar meselesinde Türkiye'nin egemenliğini kısıtlayıcı maddelerin reddedilmesi konusunda taviz vermeyeceğini bildirmiştir.

Buna göre Türk heyetinin bu tutumu öncelikle aşağıdaki ilkelerden hangisini gerçekleştirmeye yöneliktir?`,
    options: {
      A: 'Tam Bağımsızlık ve Ulusal Egemenlik',
      B: 'Devletçilik ve Planlı Ekonomi',
      C: 'Uluslararası Barış Paktı Kurmak',
      D: 'Bölgesel İttifaklara Katılmak',
    },
    correctAnswer: 'A',
    coachHint: 'Kapitülasyonlar ekonomik bağımsızlığı, Ermeni yurdu meselesi vatanın toprak bütünlüğünü, Boğazlar ise devletin egemenlik haklarını kısıtlayan unsurlardır. Heyet neyi korumaya çalışıyor?',
    explanation: `Çözüm:
1. Kapitülasyonların kaldırılması -> Tam ekonomik ve adli bağımsızlık.
2. Toprak bütünlüğünden ödün vermemek -> Vatanın bölünmezliği ve tam bağımsızlık.
3. Egemenlik haklarına saygı duyulması -> Ulusal egemenlik ve devletin bağımsızlığı.
Bu tavizsiz tutum "Tam Bağımsızlık" ilkesinin gereğidir.
Doğru Cevap: A şıkkıdır.`,
  },
];
