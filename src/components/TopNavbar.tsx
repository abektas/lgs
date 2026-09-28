import React from 'react';
import {
  Search,
  Flame,
  Star,
  Bell,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { ASSETS } from '../assets/images';

interface TopNavbarProps {
  profile: StudentProfile;
  onOpenCharacterSelect: () => void;
  onToggleGender: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  profile,
  onOpenCharacterSelect,
  onToggleGender,
  searchQuery,
  setSearchQuery,
}) => {
  const currentAvatar =
    profile.gender === 'kiz' ? ASSETS.girlAvatar1 : ASSETS.boyAvatar1;

  const xpPercent = Math.min(
    100,
    Math.round((profile.currentXp / profile.maxXp) * 100)
  );

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Greeting */}
      <div className="shrink-0">
        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
          <span>Merhaba {profile.name}</span>
          <span className="text-xl">👋</span>
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Bugün hedeflerine birlikte devam edelim!
        </p>
      </div>

      {/* Center: Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Konu, soru veya video ara..."
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 rounded-full pl-10 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-inner"
          />
        </div>
      </div>

      {/* Right Stats & Profile Pills */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Gender Preview Quick Toggle (Kız / Erkek Arayüzü as in bottom of screenshot) */}
        <button
          onClick={onToggleGender}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border shadow-sm ${
            profile.gender === 'kiz'
              ? 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
              : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
          }`}
          title="Kız ve Erkek arayüz teması arasında geçiş yap"
        >
          <span>{profile.gender === 'kiz' ? '♀ Kız Arayüzü' : '♂ Erkek Arayüzü'}</span>
        </button>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-700 text-xs font-bold shadow-sm">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{profile.streakDays} gün seri</span>
        </div>

        {/* XP Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200/70 text-yellow-800 text-xs font-bold shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
          <span>{profile.currentXp} XP</span>
        </div>

        {/* Level and XP Progress Bar Pill */}
        <div
          onClick={onOpenCharacterSelect}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition cursor-pointer shadow-sm group"
          title="Karakterini özelleştir"
        >
          <img
            src={currentAvatar}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:scale-105 transition"
          />
          <div className="text-left hidden sm:block">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-800 gap-3">
              <span>Seviye {profile.level}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {profile.currentXp} / {profile.maxXp} XP
              </span>
            </div>
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer relative"
            title="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              1
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
