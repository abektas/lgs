import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  onAddFocusMinutes: (mins: number) => void;
  onAddSolvedQuestions: (count: number) => void;
}

type TimerMode = 'pomodoro' | 'deep_focus' | 'lgs_sozel' | 'lgs_sayisal';

const TIMER_CONFIGS: Record<TimerMode, { label: string; minutes: number; desc: string }> = {
  pomodoro: {
    label: '25 Dk Klasik Pomodoro',
    minutes: 25,
    desc: '25 dk odaklanma + 5 dk mola. Soru çözüm tekrarları için ideal.',
  },
  deep_focus: {
    label: '40 Dk Sayısal Blok',
    minutes: 40,
    desc: 'Matematik ve Fen yeni nesil soru blokları için derin odaklanma.',
  },
  lgs_sozel: {
    label: '75 Dk LGS Sözel Deneme',
    minutes: 75,
    desc: 'Gerçek sınav süresi: 50 Soru (Türkçe, İnkılap, Din, İngilizce).',
  },
  lgs_sayisal: {
    label: '80 Dk LGS Sayısal Deneme',
    minutes: 80,
    desc: 'Gerçek sınav süresi: 40 Soru (Matematik & Fen Bilimleri). Soru başına 2 dk!',
  },
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onAddFocusMinutes,
  onAddSolvedQuestions,
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIGS.pomodoro.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Speed reading exercise state
  const [readingActive, setReadingActive] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [readingWpm, setReadingWpm] = useState<number | null>(null);

  const sampleParagraph = `Gelişen yapay zekâ ve uzay teknolojileri, insanlığın evrene bakışını kökten değiştirmektedir. Geleceğin bilim insanları sadece Dünya üzerindeki problemleri çözmekle kalmayacak, aynı zamanda diğer gezegenlerdeki yaşam şartlarını modelleyebileceklerdir. Liselere Geçiş Sistemi'nde (LGS) öğrencilerden beklenen temel beceri de tam olarak budur: Bilgiyi sadece ezberlemek değil, metindeki neden-sonuç ilişkilerini kurabilmek, değişkenleri analiz etmek ve mantık çerçevesinde sonuca ulaşmaktır. Başarı, her gün kararlılıkla atılan küçük adımların birikimidir.`;

  // Sound chime via Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio API unavailable');
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      const minutesSpent = TIMER_CONFIGS[mode].minutes;
      onAddFocusMinutes(minutesSpent);
      setCompletedSessions((prev) => prev + 1);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_CONFIGS[newMode].minutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIGS[mode].minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = TIMER_CONFIGS[mode].minutes * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  // Speed reading logic
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
    onAddSolvedQuestions(2); // reward student
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Timer className="w-3.5 h-3.5" />
            LGS Zaman Simülatörü
          </div>
          <h2 className="text-2xl font-black">Odaklanma Sayacı & Sınav Simülatörü</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Sınavda zaman kaygısını yenmenin yolu, soru çözerken süre baskısını antrene etmektir.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto ${
            soundEnabled
              ? 'bg-slate-800 text-amber-300 border-slate-700'
              : 'bg-slate-800/40 text-slate-500 border-slate-800'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Ses Açık' : 'Sessiz'}</span>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {(Object.keys(TIMER_CONFIGS) as TimerMode[]).map((key) => {
          const cfg = TIMER_CONFIGS[key];
          const isSelected = mode === key;
          return (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className="text-xs font-black">{cfg.label}</span>
              <span className={`text-[10px] mt-1 ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                {cfg.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timer Display Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
            {TIMER_CONFIGS[mode].label}
          </div>

          {/* Huge Timer Digits */}
          <div className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-white drop-shadow-md">
            {formatTime(timeLeft)}
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-4 rounded-2xl font-black text-base shadow-xl flex items-center gap-2 cursor-pointer transition transform active:scale-95 ${
                isRunning
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Başlat</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Sıfırla"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {completedSessions > 0 && (
            <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bugün {completedSessions} oturum başarıyla tamamlandı! Harika gidiyorsun.</span>
            </div>
          )}
        </div>
      </div>

      {/* Speed Reading / Paragraf Hızı Laboratuvarı */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">LGS Paragraf & Hızlı Okuma Laboratuvarı</h3>
          </div>
          <span className="text-xs text-slate-400">
            Türkçe ve Sözel bölümde zaman kazanmanın anahtarı!
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Metni okumaya başladığında "Okumayı Başlat" butonuna tıkla. Bittiğinde "Bitirdim" de; dakikadaki kelime hızını (WPM) hesaplayalım.
        </p>

        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {sampleParagraph}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {!readingActive ? (
            <button
              onClick={handleStartReading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Okuma Süresini Başlat</span>
            </button>
          ) : (
            <button
              onClick={handleFinishReading}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 animate-pulse"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Okumayı Bitirdim!</span>
            </button>
          )}

          {readingWpm !== null && (
            <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-700 text-indigo-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>
                Okuma Hızın: <strong className="text-white text-sm">{readingWpm} Kelime / Dk</strong>
                {readingWpm >= 200 ? ' (🔥 LGS İçin Mükemmel Seviye!)' : ' (Günde 20 sayfa kitapla 200+ yapabilirsin!)'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
