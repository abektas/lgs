import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { ASSETS } from '../assets/images';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentGender: 'kiz' | 'erkek';
  onSave: (name: string, gender: 'kiz' | 'erkek') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentGender,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentName || 'Elif');
  const [gender, setGender] = useState<'kiz' | 'erkek'>(currentGender || 'kiz');
  const [step, setStep] = useState(2); // 2: Öğrenci as in image

  const handleNext = () => {
    onSave(name, gender);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
            LGS
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 leading-none">LGS AI COACH</h3>
            <p className="text-[10px] text-slate-400 font-medium">Senin Yol Arkadaşın</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-6 px-1">
          <div className="flex items-center gap-1.5 text-blue-600">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">1</span>
            <span>Hesap</span>
          </div>
          <span className="w-4 h-0.5 bg-blue-500" />
          <div className="flex items-center gap-1.5 text-blue-600 font-black">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">2</span>
            <span>Öğrenci</span>
          </div>
          <span className="w-4 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px]">3</span>
            <span>Veli</span>
          </div>
          <span className="w-4 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px]">4</span>
            <span>Başla</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-800">Merhaba!</h2>
          <p className="text-xs text-slate-500 font-medium">
            Seni daha iyi tanımak istiyoruz.
          </p>
        </div>

        {/* Student Name */}
        <div className="space-y-1.5 mb-5">
          <label className="block text-xs font-bold text-slate-700">
            Öğrenci adı
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Elif veya Ali"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Gender Selection Cards */}
        <div className="space-y-1.5 mb-6">
          <label className="block text-xs font-bold text-slate-700">
            Cinsiyet
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Erkek Card */}
            <div
              onClick={() => setGender('erkek')}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-center relative ${
                gender === 'erkek'
                  ? 'border-blue-500 bg-blue-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <img
                src={ASSETS.boyAvatar1}
                alt="Erkek"
                className="w-14 h-14 rounded-full object-cover shadow-sm mb-2"
              />
              <span className="text-xs font-bold text-slate-800">Erkek</span>
              {gender === 'erkek' && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
              )}
            </div>

            {/* Kız Card */}
            <div
              onClick={() => setGender('kiz')}
              className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-center relative ${
                gender === 'kiz'
                  ? 'border-pink-500 bg-pink-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <img
                src={ASSETS.girlAvatar1}
                alt="Kız"
                className="w-14 h-14 rounded-full object-cover shadow-sm mb-2"
              />
              <span className="text-xs font-bold text-slate-800">Kız</span>
              {gender === 'kiz' && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl bg-[#1a6ef5] hover:bg-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition"
        >
          <span>Devam Et</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
