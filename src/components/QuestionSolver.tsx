import React, { useState } from 'react';
import {
  HelpCircle,
  Lightbulb,
  ListOrdered,
  CheckCircle2,
  Sparkles,
  Loader2,
  BookOpen,
  ArrowRight,
  Calculator,
  FlaskConical,
  Landmark,
  Image as ImageIcon,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_QUESTIONS } from '../data/sampleQuestions';
import { LGS_SUBJECTS } from '../data/lgsCurriculum';
import { SampleQuestion, SubjectKey } from '../types';

interface QuestionSolverProps {
  onAddSolvedQuestion: (count: number) => void;
}

export const QuestionSolver: React.FC<QuestionSolverProps> = ({ onAddSolvedQuestion }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>('matematik');
  const [topic, setTopic] = useState('Çarpanlar ve Katlar');
  const [questionText, setQuestionText] = useState(SAMPLE_QUESTIONS[0].questionText);
  const [selectedSample, setSelectedSample] = useState<SampleQuestion | null>(SAMPLE_QUESTIONS[0]);
  const [studentChoice, setStudentChoice] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [solutionResult, setSolutionResult] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'hint' | 'step_by_step' | 'full_solution' | 'similar_question'>('hint');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSample = (sample: SampleQuestion) => {
    setSelectedSample(sample);
    setSelectedSubject(sample.subject);
    setTopic(sample.topic);
    setQuestionText(sample.questionText);
    setStudentChoice(null);
    setSolutionResult(null);
  };

  const handleAnswerClick = (option: 'A' | 'B' | 'C' | 'D') => {
    if (!selectedSample) return;
    setStudentChoice(option);
    if (option === selectedSample.correctAnswer) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      onAddSolvedQuestion(1);
    }
  };

  const handleSolve = async (mode: 'hint' | 'step_by_step' | 'full_solution' | 'similar_question') => {
    if (!questionText.trim()) return;
    setActiveMode(mode);
    setIsLoading(true);
    setSolutionResult(null);

    try {
      const res = await fetch('/api/solve-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText,
          subject: LGS_SUBJECTS.find((s) => s.key === selectedSubject)?.name || 'Matematik',
          topic,
          mode,
        }),
      });

      const data = await res.json();
      setSolutionResult(data.result);
    } catch (err) {
      console.error('Solve error:', err);
      if (selectedSample && mode === 'hint') {
        setSolutionResult(`💡 **Koç İpucu:** ${selectedSample.coachHint}`);
      } else if (selectedSample && mode === 'full_solution') {
        setSolutionResult(`🎯 **Detaylı Çözüm:**\n${selectedSample.explanation}`);
      } else {
        setSolutionResult(`Bu LGS sorusunda MEB mantığı: Verilenleri listele, birimleri kontrol et ve formülü yerine koy!`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Sokratik Soru Laboratuvarı
            </div>
            <h2 className="text-2xl font-black">Yeni Nesil Soru Çözücü</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Ezberlemek yok! Sorunun püf noktasını keşfet, ipucu al veya adım adım çözüme ulaş.
            </p>
          </div>

          {/* Subject Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {LGS_SUBJECTS.slice(0, 4).map((subj) => (
              <button
                key={subj.key}
                onClick={() => {
                  setSelectedSubject(subj.key);
                  const matching = SAMPLE_QUESTIONS.find((q) => q.subject === subj.key);
                  if (matching) handleSelectSample(matching);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedSubject === subj.key
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {subj.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Question Input & Sample Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sample Questions Quick Pick */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Örnek LGS Yeni Nesil Soruları</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_QUESTIONS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedSample?.id === sample.id
                      ? 'bg-slate-800 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-amber-400 capitalize">{sample.subject}</span>
                    <span className="text-slate-400">{sample.topic}</span>
                  </div>
                  <h4 className="font-semibold text-white text-xs line-clamp-1">{sample.title}</h4>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 leading-relaxed">
              💡 <em>Kendi sorunu çözdürmek istersen yandaki metin kutusuna doğrudan yazabilirsin!</em>
            </div>
          </div>
        </div>

        {/* Right Column: Question View & Action Solver */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            {/* Subject and Topic Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Ders
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as SubjectKey)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {LGS_SUBJECTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.name} ({s.questionCount} Soru • {s.weight}x Katsayı)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kazanım / Konu Başlığı
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Örn: EBOB-EKOK, Basınç, Fiilimsiler..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Question Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Soru Metni
              </label>
              <textarea
                rows={6}
                value={questionText}
                onChange={(e) => {
                  setQuestionText(e.target.value);
                  setSelectedSample(null);
                }}
                placeholder="Buraya LGS soru metnini yaz veya yapıştır..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Interactive Options if Sample Question selected */}
            {selectedSample && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cevap Seçenekleri (Dene Bakalım!)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                    const isChosen = studentChoice === opt;
                    const isCorrect = selectedSample.correctAnswer === opt;
                    let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500';

                    if (studentChoice) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswerClick(opt)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-md bg-slate-700/80 flex items-center justify-center font-bold shrink-0">
                          {opt}
                        </span>
                        <span className="flex-1 pt-0.5">{selectedSample.options[opt]}</span>
                        {studentChoice && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {studentChoice && isChosen && !isCorrect && (
                          <X className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {studentChoice && (
                  <div
                    className={`mt-2 p-3 rounded-xl text-xs flex items-center gap-2 ${
                      studentChoice === selectedSample.correctAnswer
                        ? 'bg-emerald-900/30 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-900/30 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {studentChoice === selectedSample.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>Tebrikler şampiyon! Doğru cevap ({selectedSample.correctAnswer}). Günlük hedefine +1 eklendi!</span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 text-rose-400 shrink-0" />
                        <span>
                          Farklı bir şık seçtin. Sorun değil! Aşağıdaki butonlardan ipucu veya çözüm alarak hatanı öğren.
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons: 4 Solving Modes */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleSolve('hint')}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>İpucu Ver</span>
              </button>

              <button
                onClick={() => handleSolve('step_by_step')}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
                <span>Adım Adım</span>
              </button>

              <button
                onClick={() => handleSolve('full_solution')}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tam Çözüm</span>
              </button>

              <button
                onClick={() => handleSolve('similar_question')}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Benzer Soru</span>
              </button>
            </div>
          </div>

          {/* Result Output Card */}
          {isLoading && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-300 space-y-3 shadow-lg">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <div className="font-bold text-sm">Koç Bilge Soru Çözüm Analizini Hazırlıyor...</div>
              <p className="text-xs text-slate-400">
                MEB kazanımları, formüller ve yeni nesil soru mantığı kontrol ediliyor.
              </p>
            </div>
          )}

          {solutionResult && !isLoading && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-base text-white">
                    {activeMode === 'hint'
                      ? '💡 Sokratik Koç İpucu'
                      : activeMode === 'step_by_step'
                      ? '🪜 Adım Adım Yol Haritası'
                      : activeMode === 'similar_question'
                      ? '🔄 Yeni Pekiştirme Sorusu'
                      : '🎯 Detaylı LGS Çözümü'}
                  </h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                  MEB 8. Sınıf Uyumlu
                </span>
              </div>

              <div className="text-sm leading-relaxed whitespace-pre-line text-slate-200">
                {solutionResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
