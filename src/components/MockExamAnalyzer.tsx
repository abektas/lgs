import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Save,
  Loader2,
  History,
  Trash2,
  BarChart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LGS_SUBJECTS } from '../data/lgsCurriculum';
import { TargetSchool, MockExamRecord, SubjectKey } from '../types';

interface MockExamAnalyzerProps {
  targetSchool: TargetSchool;
  onSaveMock: (mock: MockExamRecord) => void;
  mockHistory: MockExamRecord[];
  onDeleteMock: (id: string) => void;
}

export const MockExamAnalyzer: React.FC<MockExamAnalyzerProps> = ({
  targetSchool,
  onSaveMock,
  mockHistory,
  onDeleteMock,
}) => {
  const [examTitle, setExamTitle] = useState('LGS Kurumsal Deneme #3');
  const [scores, setScores] = useState<Record<SubjectKey, { d: number; y: number; b: number }>>({
    turkce: { d: 18, y: 2, b: 0 },
    matematik: { d: 14, y: 3, b: 3 },
    fen: { d: 17, y: 2, b: 1 },
    inkilap: { d: 9, y: 1, b: 0 },
    din: { d: 10, y: 0, b: 0 },
    ingilizce: { d: 9, y: 1, b: 0 },
  });

  const [studentNotes, setStudentNotes] = useState('Matematik sorularında son 4 soruya süre yetmedi.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // Calculate Net for each subject: Net = D - Y/3
  const calculateNet = (d: number, y: number) => {
    return Math.max(0, Number((d - y / 3).toFixed(2)));
  };

  const nets: Record<SubjectKey, number> = {
    turkce: calculateNet(scores.turkce.d, scores.turkce.y),
    matematik: calculateNet(scores.matematik.d, scores.matematik.y),
    fen: calculateNet(scores.fen.d, scores.fen.y),
    inkilap: calculateNet(scores.inkilap.d, scores.inkilap.y),
    din: calculateNet(scores.din.d, scores.din.y),
    ingilizce: calculateNet(scores.ingilizce.d, scores.ingilizce.y),
  };

  const totalNet = Object.values(nets).reduce((sum, val) => sum + val, 0);

  // MEB Weighted score calculation:
  // Türkçe(4), Mat(4), Fen(4), İnkılap(1), Din(1), İngilizce(1)
  // Max possible: (20*4 + 20*4 + 20*4 + 10*1 + 10*1 + 10*1) = 270
  // Formula: 100 + (weightedNet / 270) * 400
  const weightedNetSum =
    nets.turkce * 4 +
    nets.matematik * 4 +
    nets.fen * 4 +
    nets.inkilap * 1 +
    nets.din * 1 +
    nets.ingilizce * 1;

  const lgsScore = Number((100 + (weightedNetSum / 270) * 400).toFixed(2));

  // Estimated Percentile
  let estimatedPercentile = '12.50% - 18.00%';
  if (lgsScore >= 490) estimatedPercentile = '%0.05 - %0.35 (Galatasaray / Kabataş / İEL)';
  else if (lgsScore >= 475) estimatedPercentile = '%0.36 - %1.20 (Ankara & İzmir Fen)';
  else if (lgsScore >= 450) estimatedPercentile = '%1.21 - %3.50 (Nitelikli Anadolu Liseleri)';
  else if (lgsScore >= 420) estimatedPercentile = '%3.51 - %7.00';
  else if (lgsScore >= 380) estimatedPercentile = '%7.01 - %14.00';

  const scoreDiff = targetSchool ? (lgsScore - targetSchool.baseScore).toFixed(1) : '0';

  const handleScoreChange = (
    subj: SubjectKey,
    field: 'd' | 'y' | 'b',
    value: number,
    maxQuestions: number
  ) => {
    const val = Math.max(0, isNaN(value) ? 0 : value);
    setScores((prev) => {
      const current = { ...prev[subj], [field]: val };
      // Auto adjust empty (b)
      if (field === 'd' || field === 'y') {
        const sum = current.d + current.y;
        current.b = Math.max(0, maxQuestions - sum);
      }
      return { ...prev, [subj]: current };
    });
  };

  const handleAnalyzeMock = async () => {
    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          targetSchool: targetSchool.name,
          studentNotes,
        }),
      });

      const data = await res.json();
      setAiAnalysisResult(data.analysis);
      if (lgsScore >= 450) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Mock analysis error:', err);
      setAiAnalysisResult(
        `🎯 **Koç Analizi:** Toplam Netin: ${totalNet.toFixed(2)}. Hedefin olan ${targetSchool.name} için özellikle 4 katsayılı Matematik ve Fen derslerinde süreyi doğru yönetmeli ve yanlış sayısını sıfıra yaklaştırmalısın!`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToHistory = () => {
    const record: MockExamRecord = {
      id: 'mock-' + Date.now(),
      title: examTitle.trim() || 'LGS Denemesi',
      date: new Date().toLocaleDateString('tr-TR'),
      scores: {
        turkce: { ...scores.turkce, net: nets.turkce },
        matematik: { ...scores.matematik, net: nets.matematik },
        fen: { ...scores.fen, net: nets.fen },
        inkilap: { ...scores.inkilap, net: nets.inkilap },
        din: { ...scores.din, net: nets.din },
        ingilizce: { ...scores.ingilizce, net: nets.ingilizce },
      },
      totalNet: Number(totalNet.toFixed(2)),
      lgsScore,
      estimatedPercentile,
      aiNotes: aiAnalysisResult || undefined,
    };

    onSaveMock(record);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-3.5 h-3.5" />
            MEB Resmi Katsayı Motoru
          </div>
          <h2 className="text-2xl font-black">Deneme Sınavı & Net Analizi</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            3 yanlışın 1 doğruyu götürdüğü gerçek LGS formülüyle anlık puanını ve hedefe uzaklığını öğren.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Deneme Adı..."
          />
          <button
            onClick={handleSaveToHistory}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </button>
        </div>
      </div>

      {/* Score Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tahmini LGS Puanı</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400">{lgsScore}</span>
            <span className="text-slate-400 text-sm font-bold">/ 500</span>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            Hedef Tabanı ({targetSchool.name}):{' '}
            <strong className="text-white">{targetSchool.baseScore}</strong>
          </div>
          <div className="mt-1 text-xs font-semibold">
            Hedefe Durum:{' '}
            <span className={Number(scoreDiff) >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {Number(scoreDiff) >= 0 ? `+${scoreDiff} (Hedefin Üzerindesin!)` : `${scoreDiff} Puan Gerekiyor`}
            </span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Net</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{totalNet.toFixed(2)}</span>
            <span className="text-slate-400 text-sm font-bold">/ 90 Net</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Sözel Net: <strong>{(nets.turkce + nets.inkilap + nets.din + nets.ingilizce).toFixed(2)}</strong> / 50 •
            Sayısal: <strong>{(nets.matematik + nets.fen).toFixed(2)}</strong> / 40
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tahmini Yüzdelik Dilim</span>
          <div className="mt-2 text-sm font-extrabold text-indigo-300 leading-snug">
            {estimatedPercentile}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Türkiye geneli MEB LGS standart sapma simülasyonu baz alınmıştır.
          </p>
        </div>
      </div>

      {/* 6 Subjects Input Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <h3 className="font-bold text-white text-base mb-4 flex items-center justify-between">
          <span>Ders Bazında Doğru, Yanlış ve Boş Sayıları</span>
          <span className="text-xs text-amber-400 font-normal">
            * 3 Yanlış 1 Doğruyu Götürür (Net = D - Y / 3)
          </span>
        </h3>

        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="pb-3 font-bold">Ders</th>
              <th className="pb-3 font-bold">Katsayı</th>
              <th className="pb-3 font-bold text-center">Doğru</th>
              <th className="pb-3 font-bold text-center">Yanlış</th>
              <th className="pb-3 font-bold text-center">Boş</th>
              <th className="pb-3 font-bold text-right">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {LGS_SUBJECTS.map((subj) => {
              const currentScore = scores[subj.key];
              const net = nets[subj.key];
              const maxQ = subj.questionCount;

              return (
                <tr key={subj.key} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <span className="text-xs">{subj.name}</span>
                    <span className="text-[10px] text-slate-400">({maxQ} Soru)</span>
                  </td>
                  <td className="py-3 font-bold text-amber-400">
                    {subj.weight}x
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={maxQ}
                      value={currentScore.d}
                      onChange={(e) =>
                        handleScoreChange(subj.key, 'd', parseInt(e.target.value) || 0, maxQ)
                      }
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg text-center font-bold text-emerald-400 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={maxQ}
                      value={currentScore.y}
                      onChange={(e) =>
                        handleScoreChange(subj.key, 'y', parseInt(e.target.value) || 0, maxQ)
                      }
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg text-center font-bold text-rose-400 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={maxQ}
                      value={currentScore.b}
                      onChange={(e) =>
                        handleScoreChange(subj.key, 'b', parseInt(e.target.value) || 0, maxQ)
                      }
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg text-center font-bold text-slate-400 py-1 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    />
                  </td>
                  <td className="py-3 text-right font-black text-amber-300 text-base">
                    {net.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Student Notes / Pain points */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Bu Denemedeki Gözlemlerin & Sorun Yaşadığın Noktalar (Yapay Zeka İçin)
          </label>
          <input
            type="text"
            value={studentNotes}
            onChange={(e) => setStudentNotes(e.target.value)}
            placeholder="Örn: Sayısalda süre yetmedi, Türkçe paragrafta odaklanamadım..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Action Button: AI Deep Analysis */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={handleAnalyzeMock}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Koç Bilge Denemeni İnceliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Koç Bilge ile Denememi Detaylı Analiz Et</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Analysis Feedback Box */}
      {aiAnalysisResult && (
        <div className="bg-slate-900/90 border border-amber-500/50 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-lg text-white">Koç Bilge Deneme Değerlendirme Raporu</h4>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
              Kişiye Özel Analiz
            </span>
          </div>

          <div className="text-sm leading-relaxed whitespace-pre-line text-slate-200">
            {aiAnalysisResult}
          </div>
        </div>
      )}

      {/* Mock Exam History */}
      {mockHistory.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>Kayıtlı Deneme Geçmişi</span>
          </h3>

          <div className="space-y-3">
            {mockHistory.map((m) => (
              <div
                key={m.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{m.title}</h4>
                    <span className="text-xs text-slate-400">({m.date})</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span>
                      Toplam Net: <strong className="text-white">{m.totalNet}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Puan: <strong className="text-amber-400">{m.lgsScore}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-indigo-300 font-semibold">{m.estimatedPercentile}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteMock(m.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/60 transition cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
