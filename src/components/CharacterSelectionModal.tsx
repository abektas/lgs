import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ASSETS } from '../assets/images';

interface CharacterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGender: 'kiz' | 'erkek';
  onSelectCharacter: (gender: 'kiz' | 'erkek', avatarId: string) => void;
}

export const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({
  isOpen,
  onClose,
  currentGender,
  onSelectCharacter,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'kiz' | 'erkek'>(currentGender);
  const [selectedId, setSelectedId] = useState('c-1');

  // Girl avatar variations
  const girlCharacters = [
    { id: 'g-1', title: 'Atkuyruklu Elif', img: ASSETS.girlAvatar1, tag: 'Klasik' },
    { id: 'g-2', title: 'Dalgalı Saçlı Zeynep', img: ASSETS.girlAvatar1, tag: 'Gözlüklü' },
    { id: 'g-3', title: 'Kulaklıklı Duru', img: ASSETS.girlAvatar1, tag: 'Müziksever' },
    { id: 'g-4', title: 'Şapkalı Defne', img: ASSETS.girlAvatar1, tag: 'Sportif' },
    { id: 'g-5', title: 'Kıvırcık Nehir', img: ASSETS.girlAvatar1, tag: 'Çalışkan' },
    { id: 'g-6', title: 'Siyah Saçlı Asya', img: ASSETS.girlAvatar1, tag: 'Lider' },
  ];

  // Boy avatar variations
  const boyCharacters = [
    { id: 'b-1', title: 'Klasik Ali', img: ASSETS.boyAvatar1, tag: 'Klasik' },
    { id: 'b-2', title: 'Gözlüklü Kerem', img: ASSETS.boyAvatar1, tag: 'Akılcı' },
    { id: 'b-3', title: 'Kulaklıklı Mert', img: ASSETS.boyAvatar1, tag: 'Müziksever' },
    { id: 'b-4', title: 'Şapkalı Arda', img: ASSETS.boyAvatar1, tag: 'Sportif' },
    { id: 'b-5', title: 'Kıvırcık Kaan', img: ASSETS.boyAvatar1, tag: 'Araştırmacı' },
    { id: 'b-6', title: 'Hoodie Emre', img: ASSETS.boyAvatar1, tag: 'Hızlı Soru Çözücü' },
  ];

  const currentList = activeTab === 'kiz' ? girlCharacters : boyCharacters;

  const handleConfirm = () => {
    onSelectCharacter(activeTab, selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Description */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-black text-slate-800">Karakterini Seç</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sana en çok benzeyen karakteri seçebilirsin. Daha sonra değiştirebilirsin.
          </p>
        </div>

        {/* Tab Buttons: Kız Karakterler / Erkek Karakterler */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('kiz')}
              className={`px-6 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'kiz'
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kız Karakterler
            </button>
            <button
              onClick={() => setActiveTab('erkek')}
              className={`px-6 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === 'erkek'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Erkek Karakterler
            </button>
          </div>
        </div>

        {/* 6 Avatar Options Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {currentList.map((char) => {
            const isSelected = selectedId === char.id;
            return (
              <div
                key={char.id}
                onClick={() => setSelectedId(char.id)}
                className={`relative rounded-2xl p-2.5 flex flex-col items-center border-2 transition cursor-pointer group ${
                  isSelected
                    ? activeTab === 'kiz'
                      ? 'border-pink-500 bg-pink-50/50 shadow-md ring-2 ring-pink-500/20'
                      : 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                {/* Checked Badge */}
                {isSelected && (
                  <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[11px] shadow-sm ${
                      activeTab === 'kiz' ? 'bg-pink-500' : 'bg-blue-600'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2 shadow-sm bg-white">
                  <img
                    src={char.img}
                    alt={char.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <span className="text-[11px] font-bold text-slate-800 text-center truncate max-w-full">
                  {char.title}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5">{char.tag}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center space-y-2">
          <button
            onClick={handleConfirm}
            className={`w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-xl transition cursor-pointer ${
              activeTab === 'kiz'
                ? 'bg-[#f43f5e] hover:bg-pink-600 shadow-pink-500/30'
                : 'bg-[#1a6ef5] hover:bg-blue-600 shadow-blue-500/30'
            }`}
          >
            Bu Karakteri Seç
          </button>
          <p className="text-[11px] text-slate-400 font-medium">
            Daha sonra da değiştirebilirsin.
          </p>
        </div>
      </div>
    </div>
  );
};
