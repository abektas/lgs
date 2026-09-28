export type SubjectKey = 'turkce' | 'matematik' | 'fen' | 'inkilap' | 'din' | 'ingilizce';

export interface SubjectInfo {
  key: SubjectKey;
  name: string;
  questionCount: number;
  weight: number;
  progressPercent: number;
  growth: string;
  color: string;
  accentBg: string;
  icon: string;
  session: 'sozel' | 'sayisal';
}

export interface StudentProfile {
  name: string;
  gender: 'kiz' | 'erkek';
  level: number;
  currentXp: number;
  maxXp: number;
  streakDays: number;
  badgesCount: number;
  gameTokens: number;
  roomItemsUnlocked: number;
  avatarId: string;
  outfit: string;
  hairstyle: string;
  accessory: string;
  targetSchool: string;
}

export interface DailyTask {
  id: string;
  title: string;
  subtitle: string;
  progressText: string;
  completed: boolean;
  xpReward: number;
  actionText: string;
  actionVariant: 'blue' | 'green';
  category: 'math' | 'review' | 'test';
}

export interface RecentStudy {
  id: string;
  title: string;
  accuracy: number;
  mistakes: number;
  timeAgo: string;
  type: 'math' | 'algebra' | 'science';
}

export interface ErrorCategory {
  id: string;
  label: string;
  percentage: number;
  color: string;
  code: string;
}

export interface TargetSchool {
  id: string;
  name: string;
  city: string;
  type: 'Fen Lisesi' | 'Anadolu Lisesi' | 'Sosyal Bilimler Lisesi' | 'Özel Lise';
  baseScore: number;
  percentile: number;
}

export interface TopicItem {
  id: string;
  subjectKey: SubjectKey;
  title: string;
  term: 1 | 2;
  importance: 'Çok Yüksek' | 'Yüksek' | 'Orta';
  estimatedQuestions: number;
  completed: boolean;
  solvedCount: number;
  notes?: string;
}

export interface MockExamRecord {
  id: string;
  title: string;
  date: string;
  scores: Record<SubjectKey, { d: number; y: number; b: number; net: number }>;
  totalNet: number;
  lgsScore: number;
  estimatedPercentile: string;
  aiNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  mode?: 'socratic' | 'strategy' | 'motivation' | 'general';
}

export interface SampleQuestion {
  id: string;
  subject: SubjectKey;
  topic: string;
  title: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  coachHint: string;
  explanation: string;
}
