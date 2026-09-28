import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Shirt,
  Scissors,
  Headphones,
  Glasses,
  HardHat,
  Save,
  Trophy,
  Armchair,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import { ASSETS } from '../assets/images';

interface ProfileCustomizerViewProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

export const ProfileCustomizerView: React.FC<ProfileCustomizerViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'karakter' | 'oda' | 'aksesuarlar' | 'rozetler'>('karakter');
  const [selectedOutfit, setSelectedOutfit] = useState(profile.outfit || 'pink_lgs_hoodie');
  const [selectedHair, setSelectedHair] = useState(profile.hairstyle || 'ponytail');
  const [selectedAccessory, setSelectedAccessory] = useState(profile.accessory || 'none');
  const [isSaved, setIsSaved] = useState(false);

  const fullBodyImg =
    profile.gender === 'kiz' ? ASSETS.girlFullBody : ASSETS.boyFullBody;

  const outfits = [
    { id: 'pink_lgs_hoodie', name: 'Pembe LGS Hoodie', colorBg: 'bg-pink-100 border-pink-300 text-pink-700' },
    { id: 'blue_jacket', name: 'Mavi Üniversite Ceketi', colorBg: 'bg-blue-100 border-blue-300 text-blue-700' },
    { id: 'dark_coat', name: 'Siyah Spor Mont', colorBg: 'bg-slate-800 border-slate-700 text-white' },
    { id: 'red_sweatshirt', name: 'Kırmızı Şampiyon Kazak', colorBg: 'bg-rose-100 border-rose-300 text-rose-700' },
    { id: 'emerald_vest', name: 'Yeşil Fen Yeleği', colorBg: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
    { id: 'purple_hoodie', name: 'Mor Gece Çalışma Hoodie', colorBg: 'bg-purple-100 border-purple-300 text-purple-700' },
  ];

  const hairstyles = [
    { id: 'ponytail', name: 'Klasik Atkuyruğu', tag: 'Trend' },
    { id: 'wavy_brown', name: 'Dalgalı Kahverengi', tag: 'Rahat' },
    { id: 'short_bob', name: 'Kısa Modern Kesim', tag: 'Dinamik' },
    { id: 'curly_dark', name: 'Kıvırcık Hacimli', tag: 'Enerjik' },
  ];

  const accessories = [
    { id: 'headphones', name: 'Gürültü Önleyici Kulaklık', icon: Headphones },
    { id: 'glasses', name: 'Mavi Işık Filtreli Gözlük', icon: Glasses },
    { id: 'cap', name: 'LGS Şampiyon Şapkası', icon: HardHat },
    { id: 'none', name: 'Aksesuar Yok', icon: Sparkles },
  ];

  const handleSave = () => {
    onUpdateProfile({
      outfit: selectedOutfit,
      hairstyle: selectedHair,
      accessory: selectedAccessory,
    });
    setIsSaved(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Title & Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Profil & Karakter Özelleştirme
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            LGS yolculuğunda seni temsil eden avatarını ve çalışma alanını dilediğin gibi kişiselleştir.
          </p>
        </div>

        {/* Top 4 Segmented Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('karakter')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'karakter'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Karakter
          </button>
          <button
            onClick={() => setActiveTab('oda')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'oda'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Oda
          </button>
          <button
            onClick={() => setActiveTab('aksesuarlar')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'aksesuarlar'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aksesuarlar
          </button>
          <button
            onClick={() => setActiveTab('rozetler')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'rozetler'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rozetler
          </button>
        </div>
      </div>

      {/* Main Grid: Full Body Character Preview on Left, Customizer Options on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Full Body Avatar Studio */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl flex flex-col items-center justify-center relative overflow-hidden h-[540px]">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white pointer-events-none" />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
              <div className="w-full flex justify-between items-center text-xs font-bold px-2 text-slate-500">
                <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  {profile.name} • Seviye {profile.level}
                </span>
                <span className="text-blue-600">3D Önizleme</span>
              </div>

              {/* Full Body Character Image */}
              <div className="relative h-[400px] w-full max-w-[280px] rounded-2xl overflow-hidden shadow-md my-auto">
                <img
                  src={fullBodyImg}
                  alt="Karakter Görünümü"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Active Item Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-slate-600">
                <span className="bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  {outfits.find((o) => o.id === selectedOutfit)?.name}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  {hairstyles.find((h) => h.id === selectedHair)?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl space-y-6">
            {/* Kıyafetler */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shirt className="w-4 h-4 text-blue-600" />
                <h4 className="font-extrabold text-slate-800 text-sm">Kıyafetler</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {outfits.map((outfit) => {
                  const isSelected = selectedOutfit === outfit.id;
                  return (
                    <button
                      key={outfit.id}
                      onClick={() => setSelectedOutfit(outfit.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${outfit.colorBg} flex items-center justify-center font-black text-xs mb-2 border shadow-sm`}>
                        LGS
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">{outfit.name}</p>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saç Modelleri */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Scissors className="w-4 h-4 text-blue-600" />
                <h4 className="font-extrabold text-slate-800 text-sm">Saç Modelleri</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {hairstyles.map((hair) => {
                  const isSelected = selectedHair === hair.id;
                  return (
                    <button
                      key={hair.id}
                      onClick={() => setSelectedHair(hair.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 font-semibold block">{hair.tag}</span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{hair.name}</p>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aksesuarlar */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="font-extrabold text-slate-800 text-sm">Aksesuarlar</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {accessories.map((acc) => {
                  const Icon = acc.icon;
                  const isSelected = selectedAccessory === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccessory(acc.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-blue-600 mb-1.5" />
                      <p className="text-xs font-bold text-slate-800 truncate">{acc.name}</p>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {isSaved ? '✅ Başarıyla kaydedildi!' : 'Değişikliklerin profilinde hemen güncellenir.'}
              </span>
              <button
                onClick={handleSave}
                className="px-8 py-3.5 rounded-2xl bg-[#1a6ef5] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition"
              >
                <Save className="w-4 h-4" />
                <span>Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
