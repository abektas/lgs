import React from 'react';
import {
  GraduationCap,
  Home,
  FileEdit,
  Bot,
  BookOpen,
  Target,
  FolderOpen,
  Gamepad2,
  Star,
  User,
  Trophy,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenOnboarding: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenOnboarding,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
    { id: 'practice', label: 'Çalış', icon: FileEdit },
    { id: 'coach', label: 'AI Koç', icon: Bot },
    { id: 'courses', label: 'Dersler', icon: BookOpen },
    { id: 'exams', label: 'Sınavlar', icon: Target },
    { id: 'resources', label: 'Kaynaklar', icon: FolderOpen },
    { id: 'games', label: 'Oyunlar', icon: Gamepad2 },
    { id: 'progress', label: 'İlerleme', icon: Star },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0d1527] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800/80 select-none z-30">
      {/* Brand Logo Header */}
      <div>
        <div className="p-5 pb-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>LGS AI COACH</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Senin Yol Arkadaşın</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#1a6ef5] text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Motivation Card */}
      <div className="p-4">
        <div className="bg-[#131d36] border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="text-slate-200 font-semibold leading-tight">
              Bugün harika gidiyorsun!
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Hedefine bir adım daha yaklaştın.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="mt-3 w-full text-center text-[11px] font-semibold text-slate-400 hover:text-blue-400 py-1 transition cursor-pointer"
        >
          ⚙️ Karakter veya Profil Değiştir
        </button>
      </div>
    </aside>
  );
};
