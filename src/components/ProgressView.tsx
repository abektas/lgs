import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { LGS_SUBJECTS } from '../data/lgsCurriculum';

export const ProgressView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'genel' | 'hata' | 'denemeler'>('genel');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Haftalık Gelişim Raporu
          </div>
          <h2 className="text-2xl font-black text-slate-800">İlerleme & Hata Analizi</h2>
          <p className="text-xs text-slate-500 font-medium">
            5 haftalık net artış eğrin, konu bazlı başarı yüzdelerin ve en çok hata yaptığın soru tipleri.
          </p>
        </div>

        {/* Segmented Filter */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('genel')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'genel' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            Genel Netler
          </button>
          <button
            onClick={() => setActiveTab('hata')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'hata' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            Hata Dağılımı
          </button>
          <button
            onClick={() => setActiveTab('denemeler')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'denemeler' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            Deneme Geçmişi
          </button>
        </div>
      </div>

      {/* 4 Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Ortalama Net</span>
          <div className="text-3xl font-black text-slate-800 mt-1">74.5</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Son 3 haftada +8.2 net</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Tahmini LGS Puanı</span>
          <div className="text-3xl font-black text-blue-600 mt-1">468.2</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">/ 500 Tam Puan</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Yüzdelik Dilim</span>
          <div className="text-3xl font-black text-purple-600 mt-1">%1.12</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Fen Liseleri Bandı</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Toplam Çözülen Soru</span>
          <div className="text-3xl font-black text-amber-600 mt-1">1,840</div>
          <span className="text-[11px] font-bold text-slate-500 mt-1 block">Bu ay 720 yeni soru</span>
        </div>
      </div>

      {/* Detailed Subject Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-800 mb-4">6 LGS Dersi İlerleme Oranları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LGS_SUBJECTS.map((subj) => (
            <div key={subj.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">{subj.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{subj.questionCount} Soru • Katsayı: {subj.weight}x</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-800">%{subj.progressPercent}</span>
                <span className="text-[10px] font-bold text-emerald-600 ml-1.5">{subj.growth}</span>
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${subj.progressPercent}%`, backgroundColor: subj.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
