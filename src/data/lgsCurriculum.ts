import { SubjectInfo, TopicItem } from '../types';

export const LGS_SUBJECTS: SubjectInfo[] = [
  {
    key: 'matematik',
    name: 'Matematik',
    questionCount: 20,
    weight: 4,
    progressPercent: 72,
    growth: '+6%',
    color: '#ef4444',
    accentBg: 'bg-rose-50 text-rose-600',
    icon: 'Calculator',
    session: 'sayisal',
  },
  {
    key: 'turkce',
    name: 'Türkçe',
    questionCount: 20,
    weight: 4,
    progressPercent: 81,
    growth: '+3%',
    color: '#3b82f6',
    accentBg: 'bg-blue-50 text-blue-600',
    icon: 'BookOpen',
    session: 'sozel',
  },
  {
    key: 'fen',
    name: 'Fen Bilimleri',
    questionCount: 20,
    weight: 4,
    progressPercent: 64,
    growth: '+12%',
    color: '#10b981',
    accentBg: 'bg-emerald-50 text-emerald-600',
    icon: 'FlaskConical',
    session: 'sayisal',
  },
  {
    key: 'ingilizce',
    name: 'İngilizce',
    questionCount: 10,
    weight: 1,
    progressPercent: 78,
    growth: '+4%',
    color: '#8b5cf6',
    accentBg: 'bg-purple-50 text-purple-600',
    icon: 'Languages',
    session: 'sozel',
  },
  {
    key: 'inkilap',
    name: 'T.C. İnkılap Tarihi',
    questionCount: 10,
    weight: 1,
    progressPercent: 85,
    growth: '+8%',
    color: '#f97316',
    accentBg: 'bg-orange-50 text-orange-600',
    icon: 'Landmark',
    session: 'sozel',
  },
  {
    key: 'din',
    name: 'Din Kültürü ve Ahlak',
    questionCount: 10,
    weight: 1,
    progressPercent: 90,
    growth: '+2%',
    color: '#06b6d4',
    accentBg: 'bg-cyan-50 text-cyan-600',
    icon: 'Compass',
    session: 'sozel',
  },
];

export const INITIAL_TOPICS: TopicItem[] = [
  // Türkçe
  { id: 'tr-1', subjectKey: 'turkce', title: 'Fiilimsiler (Eylemsiler)', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: true, solvedCount: 120 },
  { id: 'tr-2', subjectKey: 'turkce', title: 'Sözcükte ve Cümlede Anlam', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 3, completed: true, solvedCount: 150 },
  { id: 'tr-3', subjectKey: 'turkce', title: 'Paragrafta Anlam & Sözel Mantık', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 8, completed: false, solvedCount: 240 },
  { id: 'tr-4', subjectKey: 'turkce', title: 'Cümlenin Ögeleri', term: 1, importance: 'Yüksek', estimatedQuestions: 2, completed: false, solvedCount: 80 },
  { id: 'tr-5', subjectKey: 'turkce', title: 'Yazım Kuralları ve Noktalama İşaretleri', term: 2, importance: 'Yüksek', estimatedQuestions: 2, completed: false, solvedCount: 95 },
  { id: 'tr-6', subjectKey: 'turkce', title: 'Metin Türleri ve Söz Sanatları', term: 2, importance: 'Orta', estimatedQuestions: 1, completed: false, solvedCount: 60 },

  // Matematik
  { id: 'mat-1', subjectKey: 'matematik', title: 'Çarpanlar ve Katlar (EBOB - EKOK)', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: true, solvedCount: 180 },
  { id: 'mat-2', subjectKey: 'matematik', title: 'Üslü İfadeler', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: true, solvedCount: 160 },
  { id: 'mat-3', subjectKey: 'matematik', title: 'Kareköklü İfadeler', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 3, completed: false, solvedCount: 140 },
  { id: 'mat-4', subjectKey: 'matematik', title: 'Veri Analizi (Grafik Dönüşümleri)', term: 1, importance: 'Yüksek', estimatedQuestions: 1, completed: true, solvedCount: 90 },
  { id: 'mat-5', subjectKey: 'matematik', title: 'Basit Olayların Olma Olasılığı', term: 1, importance: 'Yüksek', estimatedQuestions: 1, completed: false, solvedCount: 75 },
  { id: 'mat-6', subjectKey: 'matematik', title: 'Cebirsel İfadeler ve Özdeşlikler', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: false, solvedCount: 110 },
  { id: 'mat-7', subjectKey: 'matematik', title: 'Doğrusal Denklemler ve Eğim', term: 2, importance: 'Çok Yüksek', estimatedQuestions: 3, completed: false, solvedCount: 85 },
  { id: 'mat-8', subjectKey: 'matematik', title: 'Eşitsizlikler', term: 2, importance: 'Yüksek', estimatedQuestions: 1, completed: false, solvedCount: 60 },
  { id: 'mat-9', subjectKey: 'matematik', title: 'Üçgenler ve Pisagor Bağıntısı', term: 2, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: false, solvedCount: 70 },

  // Fen Bilimleri
  { id: 'fen-1', subjectKey: 'fen', title: 'Mevsimler ve İklim', term: 1, importance: 'Yüksek', estimatedQuestions: 2, completed: true, solvedCount: 110 },
  { id: 'fen-2', subjectKey: 'fen', title: 'DNA ve Genetik Kod (Kalıtım, Mutasyon)', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 4, completed: true, solvedCount: 170 },
  { id: 'fen-3', subjectKey: 'fen', title: 'Basınç (Katı, Sıvı ve Gaz Basıncı Deneyleri)', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 3, completed: false, solvedCount: 130 },
  { id: 'fen-4', subjectKey: 'fen', title: 'Madde ve Endüstri (Periyodik Sistem, Asit-Baz)', term: 2, importance: 'Çok Yüksek', estimatedQuestions: 4, completed: false, solvedCount: 125 },
  { id: 'fen-5', subjectKey: 'fen', title: 'Basit Makineler (Kaldıraç, Makaralar, Eğik Düzlem)', term: 2, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: false, solvedCount: 65 },

  // İnkılap
  { id: 'ink-1', subjectKey: 'inkilap', title: 'Bir Kahraman Doğuyor (Atatürk\'ün Hayatı)', term: 1, importance: 'Yüksek', estimatedQuestions: 1, completed: true, solvedCount: 80 },
  { id: 'ink-2', subjectKey: 'inkilap', title: 'Milli Uyanış: Bağımsızlık Yolunda Adımlar', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 3, completed: true, solvedCount: 110 },
  { id: 'ink-3', subjectKey: 'inkilap', title: 'Milli Bir Destan: Ya İstiklal Ya Ölüm', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 3, completed: false, solvedCount: 95 },

  // Din Kültürü
  { id: 'din-1', subjectKey: 'din', title: 'Kader İnancı ve Evrenin Yasaları', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: true, solvedCount: 90 },
  { id: 'din-2', subjectKey: 'din', title: 'Zekat ve Sadaka İbadeti', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: true, solvedCount: 85 },

  // İngilizce
  { id: 'ing-1', subjectKey: 'ingilizce', title: 'Unit 1: Friendship', term: 1, importance: 'Yüksek', estimatedQuestions: 1, completed: true, solvedCount: 90 },
  { id: 'ing-2', subjectKey: 'ingilizce', title: 'Unit 2: Teen Life', term: 1, importance: 'Yüksek', estimatedQuestions: 1, completed: true, solvedCount: 80 },
  { id: 'ing-3', subjectKey: 'ingilizce', title: 'Unit 3: In The Kitchen', term: 1, importance: 'Çok Yüksek', estimatedQuestions: 2, completed: false, solvedCount: 85 },
];
