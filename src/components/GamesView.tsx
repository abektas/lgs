import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Zap,
  Timer,
  Play,
  RotateCcw,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamesViewProps {
  onEarnXp: (amount: number) => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ onEarnXp }) => {
  // Speed reading exercise
  const [readingActive, setReadingActive] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [readingWpm, setReadingWpm] = useState<number | null>(null);

  // Quick Math Duel mini-game
  const [mathSprintScore, setMathSprintScore] = useState(0);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const mathQuestions = [
    { q: '2⁵ ifadesinin değeri kaçtır?', a: 32, options: [16, 32, 64, 25] },
    { q: '√144 sayısının karekökü kaçtır?', a: 12, options: [11, 12, 14, 16] },
    { q: 'EBOB(12, 18) kaçtır?', a: 6, options: [3, 6, 9, 36] },
    { q: '3² + 4² toplamının karekökü kaçtır? (Pisagor)', a: 5, options: [5, 7, 10, 25] },
  ];

  const sampleParagraph = `Gelişen yapay zekâ ve uzay teknolojileri, insanlığın evrene bakışını kökten değiştirmektedir. Geleceğin bilim insanları sadece Dünya üzerindeki problemleri çözmekle kalmayacak, aynı zamanda diğer gezegenlerdeki yaşam şartlarını modelleyebileceklerdir. Liselere Geçiş Sistemi'nde (LGS) öğrencilerden beklenen temel beceri de tam olarak budur: Bilgiyi sadece ezberlemek değil, metindeki neden-sonuç ilişkilerini kurabilmek, değişkenleri analiz etmek ve mantık çerçevesinde sonuca ulaşmaktır. Başarı, her gün kararlılıkla atılan küçük adımların birikimidir.`;

  const handleStartReading = () => {
    setReadingActive(true);
    setReadingStartTime(Date.now());
    setReadingWpm(null);
  };

  const handleFinishReading = () => {
    if (!readingStartTime) return;
    const durationMinutes = (Date.now() - readingStartTime) / 1000 / 60;
    const wordCount = sampleParagraph.trim().split(/\s+/).length;
    const wpm = Math.round(wordCount / Math.max(0.05, durationMinutes));
    setReadingWpm(wpm);
    setReadingActive(false);
    onEarnXp(20);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleAnswerMath = (val: number) => {
    if (val === mathQuestions[activeQuestionIdx].a) {
      setMathSprintScore((s) => s + 1);
      confetti({ particleCount: 30, spread: 45 });
      onEarnXp(10);
    }
    if (activeQuestionIdx < mathQuestions.length - 1) {
      setActiveQuestionIdx((i) => i + 1);
    } else {
      setActiveQuestionIdx(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            Eğlenerek Öğren
          </div>
          <h2 className="text-2xl font-black text-slate-800">LGS Zihin ve Hız Oyunları</h2>
          <p className="text-xs text-slate-500 font-medium">
            Soru çözme hızını, odaklanmanı ve reflekslerini geliştiren eğitici mini oyunlar.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-sm">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Oyun Hakkı: 2 / 2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game 1: Hızlı Okuma Laboratuvarı */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Hızlı Okuma & WPM Testi</h3>
                  <p className="text-[10px] text-slate-400">Türkçe Paragraf Süre Kazancı</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                ⭐ +20 XP
              </span>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
              {sampleParagraph}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            {!readingActive ? (
              <button
                onClick={handleStartReading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Metni Okumaya Başla</span>
              </button>
            ) : (
              <button
                onClick={handleFinishReading}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Okumayı Bitirdim!</span>
              </button>
            )}

            {readingWpm !== null && (
              <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>{readingWpm} Kelime / Dk (LGS İdeal: 200+)</span>
              </div>
            )}
          </div>
        </div>

        {/* Game 2: Matematik Hız Sprinti */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Matematik Hız Sprinti</h3>
                  <p className="text-[10px] text-slate-400">Refleksleri ve Temel İşlemleri Hızlandır</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Skor: {mathSprintScore}
              </span>
            </div>

            <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-xs text-slate-400 font-bold mb-1">Soru {activeQuestionIdx + 1} / {mathQuestions.length}</p>
              <h4 className="text-base sm:text-lg font-black text-slate-800">
                {mathQuestions[activeQuestionIdx].q}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {mathQuestions[activeQuestionIdx].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswerMath(opt)}
                  className="py-3 px-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 font-extrabold text-sm text-slate-800 shadow-sm transition cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Doğru cevaplar Seviye XP'si kazandırır.</span>
            <button
              onClick={() => {
                setMathSprintScore(0);
                setActiveQuestionIdx(0);
              }}
              className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
