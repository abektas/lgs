import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  Loader2,
  BookOpen,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TargetSchool, SubjectKey } from '../types';
import { LGS_SUBJECTS } from '../data/lgsCurriculum';

interface StudyPlannerProps {
  targetSchool: TargetSchool;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ targetSchool }) => {
  const [dailyHours, setDailyHours] = useState(3);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectKey[]>(['matematik', 'fen', 'turkce']);
  const [pace, setPace] = useState('Dengeli LGS Temposu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  // Interactive Daily Todo List
  const [todos, setTodos] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: '40 Adet LGS Matematik Yeni Nesil Soru Çözümü (Çarpanlar & Katlar)', completed: true },
    { id: '2', text: '25 Adet Türkçe Paragraf Sorusu (Zaman Tutarak)', completed: false },
    { id: '3', text: 'Fen Bilimleri: Basınç Konu Tekrarı ve Deney Analizi (30 Soru)', completed: false },
    { id: '4', text: 'Hata Defteri: Son denemede boş ve yanlış yapılan soruların incelenmesi', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  const toggleSubject = (key: SubjectKey) => {
    setSelectedSubjects((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const subjectNames = selectedSubjects.map(
        (k) => LGS_SUBJECTS.find((s) => s.key === k)?.name || k
      );

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyHours,
          focusSubjects: subjectNames,
          targetSchool: targetSchool.name,
          studyPace: pace,
        }),
      });

      const data = await res.json();
      setGeneratedPlan(data.plan);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Plan generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTodo = () => {
    if (!newTodoText.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newTodoText.trim(), completed: false },
    ]);
    setNewTodoText('');
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Akıllı Haftalık Çizelge
          </div>
          <h2 className="text-2xl font-black">Kişiselleştirilmiş LGS Çalışma Programı</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Günlük ayırabileceğin süreye ve eksik olduğun derslere göre MEB kazanımlarıyla uyumlu haftalık plan.
          </p>
        </div>

        <div className="text-xs text-amber-300 font-bold bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl">
          Hedef Okul: {targetSchool.name}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plan Config */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">Çalışma Tercihlerini Belirle</h3>

            {/* Daily Hours Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Günlük Çalışma Süresi</span>
                <span className="text-amber-400 font-black">{dailyHours} Saat</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Saat (Hafif)</span>
                <span>3.5 Saat (Önerilen)</span>
                <span>6 Saat (Yoğun Kamp)</span>
              </div>
            </div>

            {/* Focus Subjects */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Ağırlık Verilecek Dersler (Eksiklerin)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LGS_SUBJECTS.map((subj) => {
                  const isChecked = selectedSubjects.includes(subj.key);
                  return (
                    <button
                      key={subj.key}
                      onClick={() => toggleSubject(subj.key)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span>{subj.name}</span>
                      <span className="text-[10px] opacity-80">{subj.weight}x</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Study Pace */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Çalışma Modu & Temposu
              </label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Dengeli LGS Temposu">Dengeli LGS Temposu (Konu + Soru)</option>
                <option value="Hızlı Soru Kampı">Hızlı Soru Çözüm Kampı (Günde 150+ Soru)</option>
                <option value="Temel Eksik Kapatma">Temel Eksik Kapatma (Konu Tekrarı Ağırlıklı)</option>
                <option value="Haftasonu Deneme Odaklı">Haftasonu Tam Deneme Odaklı</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Program Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>7 Günlük AI LGS Planı Oluştur</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Daily Tasks Checklist */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Bugünün LGS Görevleri</span>
              <span className="text-xs text-amber-400 font-semibold">
                {todos.filter((t) => t.completed).length} / {todos.length} Tamam
              </span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTodo();
                }}
                placeholder="Yeni görev ekle..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={addTodo}
                className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                    todo.completed
                      ? 'bg-slate-800/30 border-slate-800 opacity-60'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => toggleTodo(todo.id)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        todo.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border border-slate-600 bg-slate-800'
                      }`}
                    >
                      {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs ${
                        todo.completed ? 'line-through text-slate-400' : 'text-slate-200'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Generated Plan Output */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 min-h-[500px] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Haftalık LGS Etüt Programı</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                  MEB 8. Sınıf Müfredatlı
                </span>
              </div>

              {generatedPlan ? (
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-200 space-y-2">
                  {generatedPlan}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold">
                    Henüz bir haftalık program üretilmedi.
                  </p>
                  <p className="text-xs max-w-sm mx-auto text-slate-500">
                    Sol taraftaki tercihlerini belirle ve "7 Günlük AI LGS Planı Oluştur" butonuna basarak kişiselleştirilmiş ders ve soru dağılımını hazırla!
                  </p>
                </div>
              )}
            </div>

            {generatedPlan && (
              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Programı haftalık denemelerine göre düzenli güncelleyebilirsin.</span>
                <button
                  onClick={handleGeneratePlan}
                  className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                >
                  Yeniden Üret &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
