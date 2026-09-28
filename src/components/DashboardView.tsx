import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  ClipboardList,
  Star,
  Flame,
  Trophy,
  Gamepad2,
  Armchair,
  Bot,
  ChevronRight,
  TrendingUp,
  Calculator,
  FlaskConical,
  Languages,
  CheckCircle2,
  Play,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { StudentProfile, DailyTask } from '../types';
import { ASSETS } from '../assets/images';

interface DashboardViewProps {
  profile: StudentProfile;
  onNavigate: (tab: string) => void;
  onOpenCharacterSelect: () => void;
  onOpenMockProgram: () => void;
  onStartTask: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  onNavigate,
  onOpenCharacterSelect,
  onOpenMockProgram,
  onStartTask,
}) => {
  const [selectedSubjectChart, setSelectedSubjectChart] = useState('Matematik');

  const studyRoomImage =
    profile.gender === 'kiz' ? ASSETS.girlStudyRoom : ASSETS.boyStudyRoom;

  // Chart data for selected subject
  const chartPoints = [
    { week: '1. Hafta', value: 28 },
    { week: '2. Hafta', value: 48 },
    { week: '3. Hafta', value: 62 },
    { week: '4. Hafta', value: 72 },
    { week: '5. Hafta', value: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Main Section: Hero and Right Sidebar Column */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Columns: Hero + Subject Cards + Quick Highlights */}
        <div className="xl:col-span-8 space-y-6">
          {/* Hero Banner with 3D Study Room & Daily Tasks */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-slate-200/50">
            {/* Background Image of Study Room */}
            <div className="relative h-[340px] sm:h-[380px] w-full overflow-hidden">
              <img
                src={studyRoomImage}
                alt="LGS AI Koçu Çalışma Odası"
                className="w-full h-full object-cover object-center filter brightness-95"
              />

              {/* Character Speech Bubble */}
              <div className="absolute top-12 left-6 sm:left-14 z-10 animate-bounce duration-1000">
                <div className="relative bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-xl border border-white/80 max-w-xs">
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5 leading-snug">
                    <span>Bugün 3 görevimiz var! Birlikte başaracağız!</span>
                    <span>🚀</span>
                  </p>
                  {/* Bubble Pointer */}
                  <div className="absolute -bottom-2 left-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
                </div>
              </div>

              {/* Overlay: "Bugünün Görevleri" Card docked on right */}
              <div className="absolute top-4 bottom-4 right-4 w-full sm:w-[380px] z-10">
                <div className="h-full bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-blue-600" />
                        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                          Bugünün Görevleri
                        </h3>
                      </div>
                      <button
                        onClick={() => onNavigate('practice')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        Tümünü Gör
                      </button>
                    </div>

                    {/* Task 1 */}
                    <div className="space-y-3 mt-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition border border-slate-200/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <h4 className="font-bold text-slate-800 text-xs truncate">
                              Matematik - Üslü ifadeler
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              <span>10 soru + hata analizi</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-bold">4 / 10 tamamlandı</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            +10 XP
                          </span>
                          <button
                            onClick={() => onStartTask('task-1')}
                            className="px-3 py-1.5 rounded-lg bg-[#1a6ef5] hover:bg-blue-600 text-white text-[11px] font-bold shadow-md shadow-blue-500/20 cursor-pointer transition"
                          >
                            Devam Et
                          </button>
                        </div>
                      </div>

                      {/* Task 2 */}
                      <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition border border-slate-200/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <h4 className="font-bold text-slate-800 text-xs truncate">
                              Konu Tekrarı
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              <span>Üslü ifadeler</span>
                              <span>•</span>
                              <span>+ Video + Mini test</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            +15 XP
                          </span>
                          <button
                            onClick={() => onStartTask('task-2')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-md shadow-emerald-500/20 cursor-pointer transition"
                          >
                            Başla
                          </button>
                        </div>
                      </div>

                      {/* Task 3 */}
                      <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition border border-slate-200/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                            <ClipboardList className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <h4 className="font-bold text-slate-800 text-xs truncate">
                              Haftalık Mini Test
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              <span>20 soru</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            +20 XP
                          </span>
                          <button
                            onClick={() => onStartTask('task-3')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-md shadow-emerald-500/20 cursor-pointer transition"
                          >
                            Başla
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Tamamlanan: 1 / 3 Görev</span>
                    <span className="font-bold text-blue-600">Toplam +45 XP Kazanabilirsin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Subject Progress Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Matematik */}
            <div
              onClick={() => onNavigate('courses')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-105 transition">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Matematik</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">%72</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    +6%
                  </span>
                </div>
              </div>
            </div>

            {/* Türkçe */}
            <div
              onClick={() => onNavigate('courses')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-105 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Türkçe</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">%81</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    +3%
                  </span>
                </div>
              </div>
            </div>

            {/* Fen Bilimleri */}
            <div
              onClick={() => onNavigate('courses')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Fen Bilimleri</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">%64</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    +12%
                  </span>
                </div>
              </div>
            </div>

            {/* İngilizce */}
            <div
              onClick={() => onNavigate('courses')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-105 transition">
                <Languages className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">İngilizce</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">%78</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    +4%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Quick Highlights Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Streak */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">5 günlük</h4>
                <p className="text-[11px] text-slate-500">çalışma serisi</p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">12 rozet</h4>
                <p className="text-[11px] text-slate-500">kazandın</p>
              </div>
            </div>

            {/* Game tokens */}
            <div
              onClick={() => onNavigate('games')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3 hover:border-cyan-300 transition cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">2 oyun hakkı</h4>
                <p className="text-[11px] text-slate-500">kullanabilirsin</p>
              </div>
            </div>

            {/* Room items */}
            <div
              onClick={onOpenCharacterSelect}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3 hover:border-amber-300 transition cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Armchair className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">Çalışma Odası</h4>
                <p className="text-[11px] text-slate-500">4 öge açıldı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: AI Koçum Card + Charts & Error Analysis */}
        <div className="xl:col-span-4 space-y-6">
          {/* AI Koçum Recommendation Card */}
          <div
            onClick={() => onNavigate('coach')}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1 group-hover:text-blue-600 transition">
                    <span>AI Koçum</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                  </h4>
                  <p className="text-[10px] text-slate-400">Bugünkü analizine göre önerim:</p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 leading-relaxed">
              <p>
                "Üslü ifadelerdeki soru tiplerinde güzel bir ilerleme var, Şimdi cebirsel ifadeleri birlikte tekrar edelim."
              </p>
            </div>
          </div>

          {/* İlerleme Grafiği */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">İlerleme Grafiğin</h4>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedSubjectChart}
                  onChange={(e) => setSelectedSubjectChart(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Matematik">Matematik</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="Fen">Fen Bilimleri</option>
                  <option value="İngilizce">İngilizce</option>
                </select>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  %72 Bu hafta
                </span>
              </div>
            </div>

            {/* Custom SVG Line Chart matching screenshot */}
            <div className="relative h-44 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 320 130">
                {/* Horizontal gridlines */}
                {[100, 75, 50, 25, 0].map((val, idx) => {
                  const y = 10 + (idx * 25);
                  return (
                    <g key={val}>
                      <line
                        x1="25"
                        y1={y}
                        x2="310"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                      />
                      <text x="5" y={y + 3} fontSize="9" fill="#94a3b8" fontWeight="600">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Smooth Curve Area */}
                <path
                  d="M 45 102 Q 100 80 155 60 T 265 44 T 300 25 L 300 110 L 45 110 Z"
                  fill="url(#chartGradient)"
                  opacity="0.2"
                />

                {/* Line Path */}
                <path
                  d="M 45 102 Q 100 80 155 60 T 265 44 T 300 25"
                  fill="none"
                  stroke="#1a6ef5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {[
                  { cx: 45, cy: 102, label: '1.Hafta' },
                  { cx: 100, cy: 82, label: '2.Hafta' },
                  { cx: 160, cy: 62, label: '3.Hafta' },
                  { cx: 230, cy: 44, label: '4.Hafta' },
                  { cx: 300, cy: 25, label: '5.Hafta' },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.cx} cy={pt.cy} r="4.5" fill="#1a6ef5" stroke="#ffffff" strokeWidth="2" />
                    <text x={pt.cx} y="125" fontSize="8.5" fill="#94a3b8" textAnchor="middle" fontWeight="500">
                      {pt.label}
                    </text>
                  </g>
                ))}

                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a6ef5" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Son Çalışmaların */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-800 text-sm">Son Çalışmaların</h4>
              <button
                onClick={() => onNavigate('progress')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Tümünü Gör
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {/* Item 1 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">Üslü ifadeler – 10 soru</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      <strong className="text-slate-600">%70</strong> • 2 hata • Bugün 14:32
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">Cebirsel ifadeler – 15 soru</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      <strong className="text-slate-600">%60</strong> • 6 hata • Dün 16:14
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">Fen – Madde ve Değişim</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      <strong className="text-slate-600">%80</strong> • 3 hata • Dün 11:20
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hata Analiz Özeti */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
            <h4 className="font-extrabold text-slate-800 text-sm mb-4">Hata Analiz Özeti</h4>

            <div className="flex items-center justify-between gap-4">
              {/* Donut Chart SVG */}
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  {/* Segment 1: İşlem hatası 32% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray="76.4 238.7"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Kavram yanılgısı 28% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="12"
                    strokeDasharray="66.8 238.7"
                    strokeDashoffset="-76.4"
                  />
                  {/* Segment 3: Dikkat hatası 18% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="42.9 238.7"
                    strokeDashoffset="-143.2"
                  />
                  {/* Segment 4: Bilgi eksikliği 12% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray="28.6 238.7"
                    strokeDashoffset="-186.1"
                  />
                  {/* Segment 5: Diğer 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="12"
                    strokeDasharray="23.8 238.7"
                    strokeDashoffset="-214.7"
                  />
                </svg>

                {/* Donut Center Count */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-800 leading-none">52</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Toplam Hata</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <span className="text-slate-600 text-[11px]">İşlem hatası</span>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px]">%32</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-slate-600 text-[11px]">H2 Kavram yanılgısı</span>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px]">%28</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-slate-600 text-[11px]">H3 Dikkat hatası</span>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px]">%18</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-slate-600 text-[11px]">H4 Bilgi eksikliği</span>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px]">%12</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span className="text-slate-600 text-[11px]">Diğer</span>
                  </div>
                  <span className="font-bold text-slate-800 text-[11px]">%10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scenic Banner: 5 Haftalık Deneme Programı */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg min-h-[140px] flex items-center">
        {/* Background Scenic Image */}
        <img
          src={ASSETS.scenicBanner}
          alt="5 Haftalık Deneme Programı"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-4 text-white">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl shrink-0">
              <Calendar className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>5 Haftalık Deneme Programı</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                devam ediyor • MEB LGS Standartlarında Kurumsal Sınavlar
              </p>
            </div>
          </div>

          <button
            onClick={onOpenMockProgram}
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-[#1a6ef5] font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition self-start sm:self-auto shrink-0"
          >
            <span>İlerlemeni Gör</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
