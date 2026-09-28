import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = Number(process.env.PORT) || 3000;

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// LGS System Prompt
const LGS_COACH_SYSTEM_PROMPT = `
Sen Türkiye Liselere Geçiş Sistemi (LGS - 8. Sınıf) konusunda uzmanlaşmış, öğrencilere rehberlik eden, cana yakın, cesaretlendirici ve pedagojik yaklaşımı yüksek yapay zeka koçusun (Adın: "Koç Bilge" veya "LGS AI Koçu").

LGS Sınav Yapısı Bilgin:
- Sözel Bölüm (75 Dakika, 50 Soru): Türkçe (20 soru, Katsayı 4), T.C. İnkılap Tarihi ve Atatürkçülük (10 soru, Katsayı 1), Din Kültürü ve Ahlak Bilgisi (10 soru, Katsayı 1), Yabancı Dil/İngilizce (10 soru, Katsayı 1).
- Sayısal Bölüm (80 Dakika, 40 Soru): Matematik (20 soru, Katsayı 4), Fen Bilimleri (20 soru, Katsayı 4).
- 3 Yanlış 1 Doğruyu Götürür! Boş bırakmak yanlış yapmaktan daha avantajlıdır (stratejik eleme).
- Yeni Nesil Sorular: Salt ezber değil; okuduğunu anlama, mantık-muhakeme, tablo/grafik okuma, deney basamaklarını yorumlama, problem kurma ve modelleme gerektirir.

Öğrenciyle Konuşma İlkelerin:
1. Dil: Akıcı, sıcak, samimi, saygılı ve motive edici Türkçe (8. sınıf öğrencisi dili, aşırı resmi veya yapay olma).
2. Soru Çözümünde Sokratik Yöntem: Eğer öğrenci bir soru sorarsa direkt cevabı söylemek yerine önce sorunun ipucunu ver, "Burada hangi kuralı veya formülü hatırlamalıyız?" gibi düşündürücü sorularla yönlendir. Öğrenci isterse tam adım adım çözümü ver.
3. Sınav Stratejisi: Turlama tekniği, süre yönetimi (özellikle Sayısal bölümde soru başına 2 dakika planı), kaygı yönetimi, uyku ve beslenme tavsiyeleri.
4. Çıktılarını anlaşılır Markdown ile formatla (başlıklar, madde imleri, formüller, kalın vurgular).
`;

// API: Check status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
  });
});

// API: AI Coach Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], studentContext = {} } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mesaj alanı zorunludur.' });
      return;
    }

    if (!ai) {
      // High-quality local pedagogical fallback if API key is not configured
      const fallbackReply = generateFallbackChatReply(message, studentContext);
      res.json({ reply: fallbackReply, fallback: true });
      return;
    }

    // Build conversation context
    const contextInfo = studentContext
      ? `[Öğrenci Bilgileri: Hedef: ${studentContext.targetSchool || 'Fen Lisesi'}, Günlük Hedef: ${studentContext.dailyTarget || 100} soru, Zayıf Hissedilen: ${studentContext.weakSubject || 'Matematik'}]`
      : '';

    let formattedHistory = '';
    if (Array.isArray(history) && history.length > 0) {
      formattedHistory = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Öğrenci' : 'Koç Bilge'}: ${h.text}`)
        .join('\n');
    }

    const prompt = `${contextInfo}
${formattedHistory ? `Geçmiş Konuşma:\n${formattedHistory}\n` : ''}
Öğrencinin Yeni Mesajı: "${message}"

Lütfen Koç Bilge olarak öğrenciye yardımcı, motive edici ve LGS MEB mantığına uygun bir cevap ver.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LGS_COACH_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Harika bir soru! Adım adım inceleyelim.';
    res.json({ reply, fallback: false });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    // Provide a resilient response so UI never breaks
    const fallbackReply = generateFallbackChatReply(req.body?.message || '', req.body?.studentContext);
    res.json({ reply: fallbackReply, fallback: true, error: error?.message });
  }
});

// API: Sokratik Soru Çözücü
app.post('/api/solve-question', async (req: Request, res: Response) => {
  try {
    const { questionText, subject = 'Matematik', topic = '', mode = 'hint' } = req.body;

    if (!questionText) {
      res.status(400).json({ error: 'Soru metni gereklidir.' });
      return;
    }

    if (!ai) {
      const fallback = generateFallbackQuestionSolution(questionText, subject, mode);
      res.json(fallback);
      return;
    }

    let modeInstruction = '';
    if (mode === 'hint') {
      modeInstruction = `Öğrenci bir İPUCU istedi. Doğrudan cevabı söyleme!
1. Sorunun anahtar kelimesini ve ne istediğini vurgula.
2. Bu soru tipinde (özellikle LGS ${subject} mantığında) hangi kavramın (örn: EBOB-EKOK, çarpan ağacı, fiilimsi türü, basınç formülü) kullanılacağını hatırlat.
3. Çözüme giden ilk adımı başlat ve topu öğrenciye at.`;
    } else if (mode === 'step_by_step') {
      modeInstruction = `Öğrenci ADIM ADIM REHBER istedi.
1. Adım 1: Verilenleri ve İsteneni Belirleme
2. Adım 2: Hangi kural / formül / mantık uygulanacak
3. Adım 3: İşlem basamakları
4. Adım 4: Sonuç ve LGS'de bu soru tipi için pratik püf noktası.`;
    } else if (mode === 'similar_question') {
      modeInstruction = `Öğrencinin verdiği bu soruya benzer zorlukta ve formatta TAM BİR YENİ NESİL LGS ${subject} sorusu üret!
Format:
- Soru Metni (Hikaye, günlük yaşam durumu veya tablo)
- A, B, C, D şıkları
- Doğru Cevap
- Detaylı Çözümü`;
    } else {
      modeInstruction = `Öğrenci TAM VE DETAYLI ÇÖZÜM istedi. MEB LGS standartlarında, anlaşılır, şıkların neden doğru veya yanlış olduğunu açıklayan kusursuz bir çözüm hazırla.`;
    }

    const prompt = `Ders: ${subject}
Konu: ${topic || 'LGS Müfredatı'}
Mod: ${mode}

Soru Metni:
"""${questionText}"""

Talimat:
${modeInstruction}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LGS_COACH_SYSTEM_PROMPT,
        temperature: 0.5,
      },
    });

    res.json({
      result: response.text,
      mode,
      subject,
      fallback: false,
    });
  } catch (error: any) {
    console.error('Solve question error:', error);
    const fallback = generateFallbackQuestionSolution(req.body?.questionText || '', req.body?.subject || 'Matematik', req.body?.mode || 'hint');
    res.json(fallback);
  }
});

// API: Deneme Sınavı Net Analizi
app.post('/api/analyze-mock', async (req: Request, res: Response) => {
  try {
    const { scores, targetSchool = 'Fen Lisesi', studentNotes = '' } = req.body;

    // Calculate MEB Net scores (Dogru - Yanlis/3)
    const netCalculations: Record<string, { d: number; y: number; b: number; net: number; weight: number }> = {};
    const weights: Record<string, number> = {
      turkce: 4,
      matematik: 4,
      fen: 4,
      inkilap: 1,
      din: 1,
      ingilizce: 1,
    };

    let totalNet = 0;
    let rawWeightedScore = 0;

    for (const [subj, weight] of Object.entries(weights)) {
      const data = scores?.[subj] || { d: 0, y: 0, b: 0 };
      const d = Math.max(0, Number(data.d) || 0);
      const y = Math.max(0, Number(data.y) || 0);
      const b = Math.max(0, Number(data.b) || 0);
      const net = Math.max(0, Number((d - y / 3).toFixed(2)));
      netCalculations[subj] = { d, y, b, net, weight };
      totalNet += net;
      rawWeightedScore += net * weight;
    }

    // LGS Score approximation: Base 100 + (WeightedScore / MaxWeightedScore) * 400
    // Max weighted score: (20*4 + 20*4 + 20*4 + 10*1 + 10*1 + 10*1) = 240 + 30 = 270
    const lgsScore = Number((100 + (rawWeightedScore / 270) * 400).toFixed(2));
    
    // Percentile rank estimation
    let estimatedPercentile = '15.00% - 20.00%';
    if (lgsScore >= 480) estimatedPercentile = '%0.05 - %0.50 (Galatasaray / Kabataş / Ankara Fen bandı)';
    else if (lgsScore >= 460) estimatedPercentile = '%0.51 - %1.80 (Nitelikli Fen Liseleri)';
    else if (lgsScore >= 430) estimatedPercentile = '%1.81 - %4.50 (Köklü Anadolu Liseleri)';
    else if (lgsScore >= 400) estimatedPercentile = '%4.51 - %8.50 (Merkezi Sınavla Alan Liseler)';
    else if (lgsScore >= 350) estimatedPercentile = '%8.51 - %15.00';

    if (!ai) {
      const fallbackAnalysis = generateFallbackExamAnalysis(netCalculations, lgsScore, targetSchool);
      res.json({
        lgsScore,
        totalNet: Number(totalNet.toFixed(2)),
        netCalculations,
        estimatedPercentile,
        analysis: fallbackAnalysis,
        fallback: true,
      });
      return;
    }

    const prompt = `LGS Deneme Sınavı Sonuçları:
- Toplam Net: ${totalNet.toFixed(2)} / 90 Soru
- Tahmini LGS Puanı: ${lgsScore} / 500
- Tahmini Yüzdelik Dilim: ${estimatedPercentile}
- Hedef Lise: ${targetSchool}

Ders Bazında Netler:
- Türkçe: ${netCalculations.turkce.d} Doğru, ${netCalculations.turkce.y} Yanlış, ${netCalculations.turkce.b} Boş -> Net: ${netCalculations.turkce.net}
- Matematik: ${netCalculations.matematik.d} Doğru, ${netCalculations.matematik.y} Yanlış, ${netCalculations.matematik.b} Boş -> Net: ${netCalculations.matematik.net}
- Fen Bilimleri: ${netCalculations.fen.d} Doğru, ${netCalculations.fen.y} Yanlış, ${netCalculations.fen.b} Boş -> Net: ${netCalculations.fen.net}
- T.C. İnkılap: ${netCalculations.inkilap.d} Doğru, ${netCalculations.inkilap.y} Yanlış, ${netCalculations.inkilap.b} Boş -> Net: ${netCalculations.inkilap.net}
- Din Kültürü: ${netCalculations.din.d} Doğru, ${netCalculations.din.y} Yanlış, ${netCalculations.din.b} Boş -> Net: ${netCalculations.din.net}
- İngilizce: ${netCalculations.ingilizce.d} Doğru, ${netCalculations.ingilizce.y} Yanlış, ${netCalculations.ingilizce.b} Boş -> Net: ${netCalculations.ingilizce.net}

Öğrenci Notu: ${studentNotes || 'Yok'}

Lütfen bir uzman LGS koçu olarak:
1. Genel Değerlendirme & Güçlü Yönler (Hangi derslerde çok iyi gitmiş?)
2. Kritik Tehditler & Yanlış/Boş Analizi (Özellikle 4 katsayılı Matematik, Fen, Türkçe'deki kayıplar ve 3 yanlış 1 doğru kuralı zararları)
3. Hedef Lise Gerçekleşme Olasılığı ve Gerekli Net Farkı
4. Önümüzdeki 10 Gün İçin 3 Maddelik Acil Eylem Planı`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LGS_COACH_SYSTEM_PROMPT,
        temperature: 0.6,
      },
    });

    res.json({
      lgsScore,
      totalNet: Number(totalNet.toFixed(2)),
      netCalculations,
      estimatedPercentile,
      analysis: response.text,
      fallback: false,
    });
  } catch (error: any) {
    console.error('Mock exam analysis error:', error);
    res.status(500).json({ error: error?.message || 'Analiz yapılamadı.' });
  }
});

// API: Akıllı Çalışma Programı Üretimi
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const { dailyHours = 3, focusSubjects = ['Matematik'], targetSchool = 'Fen Lisesi', studyPace = 'Dengeli' } = req.body;

    if (!ai) {
      const fallbackPlan = generateFallbackPlan(dailyHours, focusSubjects, targetSchool);
      res.json({ plan: fallbackPlan, fallback: true });
      return;
    }

    const prompt = `LGS 8. sınıf öğrencisi için 7 günlük detaylı çalışma programı hazırla.
- Günlük Çalışma Saati: ${dailyHours} saat
- Öncelikli Odak Dersler: ${focusSubjects.join(', ')}
- Hedef Lise: ${targetSchool}
- Çalışma Temposu: ${studyPace}

Program gereksinimleri:
- Pazartesi'den Pazar'a kadar her gün için MEB 8. sınıf kazanımlarına uygun spesifik konu başlıkları,
- Soru çözümü adet hedefleri (örn: 40 soru Matematik, 30 soru Fen),
- Pomodoro blokları (25 dk çalışma + 5 dk mola veya 40 dk sayısal odak),
- Haftasonu için 1 adet Genel LGS Denemesi ve Yanlış Soru Analizi seansı,
- Öğrenciyi boğmayan, gerçekçi ve yüksek verimli bir çizelge.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: LGS_COACH_SYSTEM_PROMPT,
        temperature: 0.5,
      },
    });

    res.json({ plan: response.text, fallback: false });
  } catch (error: any) {
    console.error('Plan generation error:', error);
    const fallbackPlan = generateFallbackPlan(req.body?.dailyHours || 3, req.body?.focusSubjects || ['Matematik'], req.body?.targetSchool || 'Fen Lisesi');
    res.json({ plan: fallbackPlan, fallback: true });
  }
});

// Helper: Local fallback functions for reliable UX
function generateFallbackChatReply(msg: string, context?: any): string {
  const lower = msg.toLowerCase();
  if (lower.includes('matematik') || lower.includes('yeni nesil') || lower.includes('geometri')) {
    return `🎯 **Matematik Yeni Nesil Soruları İçin Koç Tavsiyesi:**
LGS Matematik'te soruların uzun olması seni korkutmasın! Aslında uzun sorular daha çok ipucu içerir:
1. **Önce Soru Kökünü Oku:** Soru senden ne istiyor? (Örn: "en az", "kesinlikle", "olamaz").
2. **Görsel & Tablo Analizi:** Verilen şekil veya grafikteki değişkenlerin birimlerine dikkat et (cm, m, litre vb.).
3. **Model Kur:** Metni cebirsel bir ifadeye veya denklem/çarpan kat bağıntısına dönüştür.
4. **Turlama Tekniği:** 1.5 dakikada ilerleyemediğin soruyu hemen işaretleyip geç, son tura bırak!

Şimdi takıldığın spesifik bir soru varsa buraya yaz, adım adım birlikte çözelim!`;
  }

  if (lower.includes('motivasyon') || lower.includes('korku') || lower.includes('stres') || lower.includes('yapamıyorum')) {
    return `💪 **Bunu Hatırla: Başarı Bir Günde Değil, Her Gün Küçük Adımlarla Gelir!**
Şu an hissettiğin yorgunluk ve kaygı çok doğal. Türkiye'de 1 milyondan fazla öğrenci aynı süreçten geçiyor.
Unutma:
- Yanlış yaptığın her soru, sınavda çıkabilecek bir eksiği kapatma fırsatıdır!
- Netlerin bir denemede düşüp diğerinde çıkabilir, önemli olan ortalama gelişim eğrindir.
- Şimdi derin bir nefes al, hedefini (o güzel lisenin bahçesinde yürüdüğünü) hayal et. Bugün 1 Pomodoro bile yapsan dünden daha öndesin!`;
  }

  return `Merhaba şampiyon! 🚀 Ben senin LGS AI Koçunum.
Hedefine ulaşman için buradayım. Bugün sana şu konularda destek olabilirim:
- 💡 **Yeni Nesil Soru Çözümü:** Takıldığın bir soruyu yaz, Sokratik ipuçlarıyla çözelim.
- 📊 **Deneme Analizi:** Netlerini söyle, hangi konularda açık olduğunu çıkaralım.
- 📅 **Haftalık Plan:** Eksiklerine özel nokta atışı çalışma programı yapalım.
- 🎯 **Sınav Taktikleri:** Zaman yönetimi ve turlama taktikleri geliştirelim.

Bugün hangi derse veya konuya odaklanmak istersin?`;
}

function generateFallbackQuestionSolution(question: string, subject: string, mode: string): any {
  return {
    result: `### 📌 LGS ${subject} Soru Analizi

**1. Adım (Soru Kökü ve Verilenler):**
Soruda verilen günlük yaşam senaryosunu veya matematiksel/fen modelini parçalara ayıralım.

**2. Adım (Temel Kural):**
Bu tarz ${subject} sorularında MEB'in en çok test ettiği kazanım:
- *İlişki kurma, değişkenleri belirleme ve sadeleştirme.*

**3. Adım (Uygulama):**
Verilen değerleri denklem ya da kavram haritasına yerleştirdiğimizde, seçenekleri tek tek eleyerek doğru sonuca hızla ulaşabilirsin.

💡 **Koç İpucu:** Eğer Sayısal bölümdeysen, soru 2 dakikayı aştığında turlama işaretini koy ve diğer soruya geç!`,
    mode,
    subject,
    fallback: true,
  };
}

function generateFallbackExamAnalysis(nets: any, score: number, target: string): string {
  return `### 🎯 LGS Deneme Sınavı Koç Değerlendirmesi

**1. Puan & Net Özeti:**
- **Hesaplanan LGS Puanı:** ${score} / 500
- **Hedef:** ${target}
- 4 Katsayılı Dersler (Türkçe, Matematik, Fen) toplam puanının %80'inden fazlasını belirler.

**2. Kritik Tespitler:**
- **Matematik Neti:** ${nets.matematik?.net || 0} - Matematik LGS'nin en belirleyici dersidir. Yanlış sayısı ${nets.matematik?.y || 0}, boş sayısı ${nets.matematik?.b || 0}. 3 yanlışın 1 doğruyu götürdüğünü unutma; emin olmadığın sorularda şans denemek yerine boş bırakmak netini korur!
- **Türkçe & Fen:** Paragraf ve deney sorularındaki okuma hızını artırmak sayısal bölüme ekstra zihinsel enerji bırakır.

**3. 10 Günlük Acil Eylem Planı:**
1. Her sabah 20 adet LGS tarzı Paragraf & Mantık-Muhakeme sorusu çöz (zaman tutarak).
2. Bu denemede yanlış yaptığın soruları kesip "Hata Defteri"ne yapıştır ve çözümlerini öğrenmeden yeni denemeye geçme.
3. Matematik'te en çok hata yapılan 2 alt konuyu belirle ve her birinden 50'şer adet yeni nesil soru tamamla.`;
}

function generateFallbackPlan(hours: number, subjects: string[], target: string): string {
  return `### 📅 Kişiselleştirilmiş 7 Günlük LGS Çalışma Programı
**Hedef:** ${target} | **Günlük Süre:** ${hours} Saat | **Öncelik:** ${subjects.join(', ')}

---
#### 🗓️ Pazartesi (Haftaya Güçlü Başlangıç)
- **Blok 1 (45 dk):** ${subjects[0] || 'Matematik'} - Konu Özeti & Formül/Kavram Hatırlatma
- **Mola (15 dk)**
- **Blok 2 (45 dk):** ${subjects[0] || 'Matematik'} - 30 Adet Yeni Nesil Soru Çözümü
- **Blok 3 (40 dk):** Türkçe - 20 Paragraf + Sözel Mantık Sorusu

#### 🗓️ Salı (Fen & İnkılap Odağı)
- **Blok 1 (45 dk):** Fen Bilimleri - Deney ve Hipotez Yorumlama Soruları (25 Soru)
- **Blok 2 (45 dk):** T.C. İnkılap Tarihi - Harita ve Metin Analizi (25 Soru)
- **Blok 3 (30 dk):** Günün Yanlış Sorularının Analizi (Hata Defteri)

#### 🗓️ Çarşamba (Matematik Problem Kampı)
- **Blok 1 (50 dk):** ${subjects[0] || 'Matematik'} - Çarpanlar & Katlar / Üslü-Köklü İfadeler Karma Test (25 Soru)
- **Blok 2 (40 dk):** Din Kültürü & İngilizce - Kavram Tekrarı ve Kelime Kartları (30 Soru)

#### 🗓️ Perşembe (Türkçe & Fen Güçlendirme)
- **Blok 1 (45 dk):** Türkçe - Fiilimsiler & Cümlenin Ögeleri Pekiştirme
- **Blok 2 (45 dk):** Fen Bilimleri - Basınç / Madde ve Endüstri (30 Soru)

#### 🗓️ Cuma (Haftalık Tarama & Motivasyon)
- **Blok 1 (50 dk):** Eksik Kalan Konulardan Karışık 40 Soru
- **Blok 2 (40 dk):** Hızlı Okuma & Odaklanma Egzersizi

#### 🗓️ Cumartesi (Tam LGS Deneme Sınavı Günü)
- **09:30 - 10:45:** Sözel Bölüm Denemesi (50 Soru - 75 Dakika, Gerçek Sınav Ortamı)
- **11:00 - 11:30:** Dinlenme & Atıştırma
- **11:30 - 12:50:** Sayısal Bölüm Denemesi (40 Soru - 80 Dakika)
- **Öğleden Sonra:** Deneme Net Hesabı ve Yapılamayan Soruların Çözümünü İzleme

#### 🗓️ Pazar (Hafif Tekrar & Zihinsel Şarj)
- **Blok 1 (45 dk):** Hafta boyunca hata yapılan soruların tekrar çözülmesi
- **Serbest Zaman:** Doğa yürüyüşü, spor, sevdiklerinle dinlenme ve yeni haftaya zihinsel hazırlık!`;
}

// Serve Vite in development or static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LGS AI Koçu Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
