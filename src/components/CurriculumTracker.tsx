import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Award,
  Filter,
  Check,
  Search,
} from 'lucide-react';
import { LGS_SUBJECTS } from '../data/lgsCurriculum';
import { TopicItem, SubjectKey } from '../types';

interface CurriculumTrackerProps {
  topics: TopicItem[];
  onToggleTopic: (id: string) => void;
  onAddQuestionToTopic: (id: string, count: number) => void;
}

export const CurriculumTracker: React.FC<CurriculumTrackerProps> = ({
  topics,
  onToggleTopic,
  onAddQuestionToTopic,
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectKey | 'all'>('matematik');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTerm, setFilterTerm] = useState<'all' | 1 | 2>('all');

  const filteredTopics = topics.filter((t) => {
    const matchesSubject = activeSubject === 'all' || t.subjectKey === activeSubject;
    const matchesTerm = filterTerm === 'all' || t.term === filterTerm;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesTerm && matchesSearch;
  });

  const totalTopics = topics.length;
  const completedCount = topics.filter((t) => t.completed).length;
  const totalSolved = topics.reduce((sum, t) => sum + (t.solvedCount || 0), 0);
  const overallPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            MEB Müfredat Kazanımları
          </div>
          <h2 className="text-2xl font-black">LGS Konu & Eksik Takip Sistemi</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            8. sınıf tüm MEB LGS konularını adım adım tamamla, çözdüğün soru sayılarını kaydet.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 min-w-[220px]">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Müfredat İlerlemesi</span>
            <span className="text-sm font-black text-amber-400">%{overallPercent}</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>{completedCount} / {totalTopics} Tamamlandı</span>
            <span>{totalSolved} Soru Çözüldü</span>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSubject('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubject === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
          }`}
        >
          Tüm Dersler
        </button>

        {LGS_SUBJECTS.map((subj) => (
          <button
            key={subj.key}
            onClick={() => setActiveSubject(subj.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubject === subj.key
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <span>{subj.name}</span>
            <span className="text-[10px] opacity-75">({subj.weight}x)</span>
          </button>
        ))}
      </div>

      {/* Search and Term Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Konu adı ara (örn: Üslü İfadeler, Fiilimsiler, Basınç)..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 1, 2] as const).map((term) => (
            <button
              key={term}
              onClick={() => setFilterTerm(term)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                filterTerm === term
                  ? 'bg-slate-700 border-amber-500 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {term === 'all' ? 'Tüm Dönemler' : `${term}. Dönem`}
            </button>
          ))}
        </div>
      </div>

      {/* Topics List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTopics.map((topic) => {
          const subject = LGS_SUBJECTS.find((s) => s.key === topic.subjectKey);
          return (
            <div
              key={topic.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                topic.completed
                  ? 'bg-slate-800/40 border-slate-700/60 opacity-90'
                  : 'bg-slate-900/80 border-slate-700/80 shadow-sm hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleTopic(topic.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer shrink-0 ${
                        topic.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800 border border-slate-600 text-transparent hover:border-emerald-400'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          topic.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {topic.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-amber-400">
                          {subject?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {topic.term}. Dönem
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${
                            topic.importance === 'Çok Yüksek'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : topic.importance === 'Yüksek'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}
                        >
                          {topic.importance} Öncelik
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ~{topic.estimatedQuestions} Soru
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Question Counter */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Çözülen: <strong className="text-white">{topic.solvedCount || 0}</strong> Soru
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAddQuestionToTopic(topic.id, 10)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
                  >
                    +10 Soru
                  </button>
                  <button
                    onClick={() => onAddQuestionToTopic(topic.id, 25)}
                    className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition cursor-pointer"
                  >
                    +25 Soru
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
