import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Flame,
  Clock,
  Target,
  BookOpen,
  HelpCircle,
  BarChart3,
  ListTodo,
  Timer,
  CalendarDays,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  daysRemaining: number;
  dailyProgress: { current: number; target: number };
  streakDays: number;
  targetSchoolName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  daysRemaining,
  dailyProgress,
  streakDays,
  targetSchoolName,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Panel', icon: BarChart3 },
    { id: 'coach', label: 'AI Koç Bilge', icon: Sparkles, badge: 'Canlı' },
    { id: 'solver', label: 'Soru Çözücü', icon: HelpCircle },
    { id: 'mock', label: 'Deneme & Net Analizi', icon: Target },
    { id: 'curriculum', label: 'Konu Takip', icon: BookOpen },
    { id: 'pomodoro', label: 'Sınav Sayacı & Pomodoro', icon: Timer },
    { id: 'planner', label: 'Haftalık Plan', icon: CalendarDays },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with stats */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-300 bg-clip-text text-transparent">
                  LGS AI KOÇU
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  MEB 8. Sınıf
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Hedef:</span>
                <span className="text-amber-300 font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {targetSchoolName}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-700/40 text-indigo-200 text-xs font-medium">
              <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>LGS'ye:</span>
              <strong className="text-indigo-100 font-bold text-sm">{daysRemaining} Gün</strong>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-950/60 border border-orange-700/40 text-orange-200 text-xs font-medium">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Seri:</span>
              <strong className="text-orange-100 font-bold text-sm">{streakDays} Gün</strong>
            </div>

            {/* Daily Goal */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/40 text-emerald-200 text-xs font-medium">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Soru:</span>
              <strong className="text-emerald-100 font-bold text-sm">
                {dailyProgress.current}/{dailyProgress.target}
              </strong>
              <div className="w-12 h-1.5 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((dailyProgress.current / dailyProgress.target) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
