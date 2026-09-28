import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Target,
  Clock,
  BookOpen,
  Calculator,
  FlaskConical,
  Landmark,
  Compass,
  Languages,
  ArrowRight,
  Plus,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { LGS_SUBJECTS } from '../data/lgsCurriculum';
import { TargetSchool, TopicItem, MockExamRecord } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  targetSchool: TargetSchool;
  onSelectTargetSchool: (school: TargetSchool) => void;
  availableSchools: TargetSchool[];
  dailyQuestionGoal: number;
  dailyQuestionsSolved: number;
  onAddSolvedQuestions: (count: number) => void;
  focusMinutesToday: number;
  topics: TopicItem[];
  latestMock: MockExamRecord | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  targetSchool,
  onSelectTargetSchool,
  availableSchools,
  dailyQuestionGoal,
  dailyQuestionsSolved,
  onAddSolvedQuestions,
  focusMinutesToday,
  topics,
  latestMock,
}) => {
  // LGS Date estimation: First Sunday of June (e.g. June 6, 2027)
  const [timeLeft, setTimeLeft] = useState({ days: 248, hours: 14, minutes: 32, seconds: 40 });

  useEffect(() => {
    // Target: Next LGS exam
    const targetDate = new Date('2027-06-06T09:30:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.completed).length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const goalPercentage = Math.min(100, Math.round((dailyQuestionsSolved / dailyQuestionGoal) * 100));

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Languages':
        return <Languages className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const currentScore = latestMock ? latestMock.lgsScore : 442.5;
  const scoreDiff = targetSchool ? (currentScore - targetSchool.baseScore).toFixed(1) : '0';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              LGS 8. Sınıf Başarı Rotası
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Hayalindeki Liseye Adım Adım! 🎓
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Bugün çözdüğün her yeni nesil soru, hedefin olan{' '}
              <span className="text-amber-300 font-bold underline decoration-amber-400/40">
                {targetSchool.name}
              </span>{' '}
              kapısını aralıyor. Sokratik soru çözümü, net analizi ve sınav stratejileriyle yanındayız.
            </p>

            {/* School selector dropdown */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="text-slate-400 font-medium">Hedef Lisen:</span>
              <select
                value={targetSchool.id}
                onChange={(e) => {
                  const found = availableSchools.find((s) => s.id === e.target.value);
                  if (found) onSelectTargetSchool(found);
                }}
                className="bg-slate-800/90 text-amber-200 border border-slate-600 rounded-lg px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {availableSchools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city}) - Taban: {s.baseScore} (%{s.percentile})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LGS Countdown Cards */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 shadow-lg">
            <div className="text-center sm:text-left sm:pr-3 sm:border-r border-slate-700">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                LGS Geri Sayım
              </div>
              <div className="text-xs text-slate-400">MEB Sınav Tarihi</div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-800/90 px-2.5 py-2 rounded-lg border border-slate-700 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black text-amber-400">{timeLeft.days}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Gün</div>
              </div>
              <div className="bg-slate-800/90 px-2.5 py-2 rounded-lg border border-slate-700 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black text-amber-400">{timeLeft.hours}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Saat</div>
              </div>
              <div className="bg-slate-800/90 px-2.5 py-2 rounded-lg border border-slate-700 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black text-amber-400">{timeLeft.minutes}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Dk</div>
              </div>
              <div className="bg-slate-800/90 px-2.5 py-2 rounded-lg border border-slate-700 min-w-[54px]">
                <div className="text-xl sm:text-2xl font-black text-amber-400">{timeLeft.seconds}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Sn</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Goal Card */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Günlük Soru Hedefi</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{dailyQuestionsSolved}</span>
            <span className="text-slate-400 font-semibold text-sm">/ {dailyQuestionGoal} Soru</span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold">%{goalPercentage} Tamamlandı</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAddSolvedQuestions(5)}
                className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-bold cursor-pointer transition"
                title="5 soru ekle"
              >
                +5
              </button>
              <button
                onClick={() => onAddSolvedQuestions(10)}
                className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded font-bold cursor-pointer transition"
                title="10 soru ekle"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* Current Score & Target Gap */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Son LGS Puanı</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300">{currentScore}</span>
            <span className="text-slate-400 font-semibold text-sm">/ 500</span>
          </div>
          <div className="mt-3 text-xs flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">
              Hedefe Fark:{' '}
              <strong className={Number(scoreDiff) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {Number(scoreDiff) >= 0 ? `+${scoreDiff}` : scoreDiff} Puan
              </strong>
            </span>
          </div>
          <button
            onClick={() => onNavigate('mock')}
            className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Deneme netlerini gir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Focus Timer Today */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bugünkü Odaklanma</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{focusMinutesToday}</span>
            <span className="text-slate-400 font-semibold text-sm">Dakika</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {Math.floor(focusMinutesToday / 25)} Pomodoro seansı tamamlandı
          </p>
          <button
            onClick={() => onNavigate('pomodoro')}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>LGS Sayacını Başlat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Curriculum Progress */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 shadow-sm hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Müfredat Kazanımları</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">%{completionPercentage}</span>
            <span className="text-slate-400 font-semibold text-sm">
              ({completedTopics}/{totalTopics} Konu)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <button
            onClick={() => onNavigate('curriculum')}
            className="mt-3 text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Konu listesini incele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Action Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ask AI Coach */}
        <div
          onClick={() => onNavigate('coach')}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-700/40 p-5 hover:border-indigo-500 transition cursor-pointer shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 group-hover:scale-110 transition duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                Koç Bilge'ye Soru Sor
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Turlama tekniği, sınav kaygısı veya ders çalışma taktikleri için yapay zeka mentörünle konuş.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-400">
                <span>Koçla Sohbet Et</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Socratic Question Solver */}
        <div
          onClick={() => onNavigate('solver')}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-700/40 p-5 hover:border-amber-500 transition cursor-pointer shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 group-hover:scale-110 transition duration-300">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition">
                Yeni Nesil Soru Çözücü
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Takıldığın soruyu yapıştır; doğrudan cevap yerine sana ipucu ve adım adım çözüm rehberi versin.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-400">
                <span>Soruyu İncele</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly AI Study Plan */}
        <div
          onClick={() => onNavigate('planner')}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-700/40 p-5 hover:border-emerald-500 transition cursor-pointer shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-110 transition duration-300">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                Haftalık Akıllı Plan
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Zayıf olduğun derslere ve hedefine özel 7 günlük kişiselleştirilmiş LGS etüt çizelgesi üret.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <span>Programı Gör</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 LGS Subjects Overview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>LGS Dersleri & Katsayı Dağılımı</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                90 Soru • 500 Puan
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Türkçe, Matematik ve Fen katsayısı 4x olup sınav sonucunun %88'ini oluşturur!
            </p>
          </div>
          <button
            onClick={() => onNavigate('curriculum')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Tüm Konuları Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LGS_SUBJECTS.map((subject) => {
            const subjectTopics = topics.filter((t) => t.subjectKey === subject.key);
            const comp = subjectTopics.filter((t) => t.completed).length;
            const pct = subjectTopics.length > 0 ? Math.round((comp / subjectTopics.length) * 100) : 0;
            const solvedInSubject = subjectTopics.reduce((acc, t) => acc + (t.solvedCount || 0), 0);

            return (
              <div
                key={subject.key}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4.5 hover:border-slate-600 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-tr ${subject.color} text-white shadow-sm`}>
                        {getSubjectIcon(subject.icon)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{subject.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-slate-400">
                            {subject.questionCount} Soru
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            Katsayı: {subject.weight}x
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {subject.session === 'sayisal' ? 'Sayısal' : 'Sözel'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Kazanım İlerlemesi</span>
                      <span className="font-semibold text-slate-200">%{pct}</span>
                    </div>
                    <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Çözülen: {solvedInSubject} Soru</span>
                  <button
                    onClick={() => onNavigate('solver')}
                    className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Soru Çöz &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LGS Golden Rules & Tips Card */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <span>LGS Sınavı Altın Kuralları (Koç Bilge'den Hatırlatma)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                <strong className="text-amber-300 block mb-1">1. "3 Yanlış 1 Doğruyu Götürür"</strong>
                İki şık arasında kalmadıysan kesinlikle rastgele sallama! Boş bırakılan soru netini düşürmez, ancak yanlış soru 0.33 netini ve ~1.5 puanını siler.
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                <strong className="text-amber-300 block mb-1">2. Sayısalda Turlama Tekniği</strong>
                Matematik sorularına ortalama 2 dakika ayrılır. 1.5 dakikada çözüme gidemediğin sorunun yanına bir işaret koyup hemen diğer soruya geç.
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                <strong className="text-amber-300 block mb-1">3. Uzun Paragraf & Şekil Korkusu</strong>
                Yeni nesil sorularda soru kökü ne kadar uzunsa, içinde sana yardımcı olacak ipucu sayısı o kadar fazladır. Önce soru kökünü oku!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
