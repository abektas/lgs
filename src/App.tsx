import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { OnboardingModal } from './components/OnboardingModal';
import { CharacterSelectionModal } from './components/CharacterSelectionModal';
import { ProfileCustomizerView } from './components/ProfileCustomizerView';
import { QuestionSolver } from './components/QuestionSolver';
import { AiCoachChat } from './components/AiCoachChat';
import { MockExamAnalyzer } from './components/MockExamAnalyzer';
import { CurriculumTracker } from './components/CurriculumTracker';
import { ResourcesView } from './components/ResourcesView';
import { GamesView } from './components/GamesView';
import { ProgressView } from './components/ProgressView';
import { TARGET_SCHOOLS } from './data/targetSchools';
import { INITIAL_TOPICS } from './data/lgsCurriculum';
import { StudentProfile, TargetSchool, TopicItem, MockExamRecord } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCharSelectOpen, setIsCharSelectOpen] = useState(false);

  // Student Profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('lgs_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Elif',
      gender: 'kiz',
      level: 14,
      currentXp: 320,
      maxXp: 1000,
      streakDays: 5,
      badgesCount: 12,
      gameTokens: 2,
      roomItemsUnlocked: 4,
      avatarId: 'g-1',
      outfit: 'pink_lgs_hoodie',
      hairstyle: 'ponytail',
      accessory: 'headphones',
      targetSchool: 'Ankara Fen Lisesi',
    };
  });

  // Target School state
  const [targetSchool, setTargetSchool] = useState<TargetSchool>(() => {
    const saved = localStorage.getItem('lgs_target_school');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return TARGET_SCHOOLS[3]; // Ankara Fen
  });

  // Topics
  const [topics, setTopics] = useState<TopicItem[]>(() => {
    const saved = localStorage.getItem('lgs_topics');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TOPICS;
  });

  // Mock Exams History
  const [mockHistory, setMockHistory] = useState<MockExamRecord[]>(() => {
    const saved = localStorage.getItem('lgs_mock_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'mock-1',
        title: 'Özdebir LGS Genel Deneme #1',
        date: '14.09.2026',
        scores: {
          turkce: { d: 18, y: 2, b: 0, net: 17.33 },
          matematik: { d: 15, y: 3, b: 2, net: 14.0 },
          fen: { d: 18, y: 1, b: 1, net: 17.67 },
          inkilap: { d: 10, y: 0, b: 0, net: 10.0 },
          din: { d: 9, y: 1, b: 0, net: 8.67 },
          ingilizce: { d: 10, y: 0, b: 0, net: 10.0 },
        },
        totalNet: 77.67,
        lgsScore: 462.4,
        estimatedPercentile: '%0.85 - %1.40 (Fen Liseleri Bandı)',
        aiNotes: 'Matematik süresi geliştirilirse 480+ puan rahatlıkla gelir.',
      },
    ];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('lgs_student_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('lgs_target_school', JSON.stringify(targetSchool));
  }, [targetSchool]);

  useEffect(() => {
    localStorage.setItem('lgs_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('lgs_mock_history', JSON.stringify(mockHistory));
  }, [mockHistory]);

  const handleEarnXp = (amount: number) => {
    setProfile((prev) => {
      let newXp = prev.currentXp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      if (newXp >= newMaxXp) {
        newLevel += 1;
        newXp = newXp - newMaxXp;
        confetti({ particleCount: 80, spread: 70 });
      }
      return { ...prev, currentXp: newXp, level: newLevel, maxXp: newMaxXp };
    });
  };

  const handleToggleGender = () => {
    const nextGender = profile.gender === 'kiz' ? 'erkek' : 'kiz';
    const nextName = nextGender === 'kiz' ? 'Elif' : 'Ali';
    setProfile((prev) => ({
      ...prev,
      gender: nextGender,
      name: prev.name === 'Ali' || prev.name === 'Elif' ? nextName : prev.name,
    }));
  };

  const handleSelectCharacter = (gender: 'kiz' | 'erkek', avatarId: string) => {
    setProfile((prev) => ({
      ...prev,
      gender,
      avatarId,
      name:
        prev.name === 'Elif' && gender === 'erkek'
          ? 'Ali'
          : prev.name === 'Ali' && gender === 'kiz'
          ? 'Elif'
          : prev.name,
    }));
  };

  const handleOnboardingSave = (name: string, gender: 'kiz' | 'erkek') => {
    setProfile((prev) => ({ ...prev, name, gender }));
  };

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleStartDailyTask = (taskId: string) => {
    handleEarnXp(15);
    setActiveTab('practice');
  };

  const handleToggleTopic = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddQuestionToTopic = (id: string, count: number) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, solvedCount: (t.solvedCount || 0) + count } : t))
    );
    handleEarnXp(count * 2);
  };

  const handleSaveMock = (record: MockExamRecord) => {
    setMockHistory((prev) => [record, ...prev]);
    handleEarnXp(50);
  };

  const handleDeleteMock = (id: string) => {
    setMockHistory((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-slate-800 flex font-sans selection:bg-blue-500 selection:text-white">
      {/* Exact Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Navbar */}
        <TopNavbar
          profile={profile}
          onOpenCharacterSelect={() => setIsCharSelectOpen(true)}
          onToggleGender={handleToggleGender}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* View Routing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              onNavigate={setActiveTab}
              onOpenCharacterSelect={() => setIsCharSelectOpen(true)}
              onOpenMockProgram={() => setActiveTab('exams')}
              onStartTask={handleStartDailyTask}
            />
          )}

          {activeTab === 'practice' && (
            <QuestionSolver onAddSolvedQuestion={(count) => handleEarnXp(count * 10)} />
          )}

          {activeTab === 'coach' && (
            <AiCoachChat targetSchool={targetSchool} dailyGoal={100} />
          )}

          {activeTab === 'courses' && (
            <CurriculumTracker
              topics={topics}
              onToggleTopic={handleToggleTopic}
              onAddQuestionToTopic={handleAddQuestionToTopic}
            />
          )}

          {activeTab === 'exams' && (
            <MockExamAnalyzer
              targetSchool={targetSchool}
              onSaveMock={handleSaveMock}
              mockHistory={mockHistory}
              onDeleteMock={handleDeleteMock}
            />
          )}

          {activeTab === 'resources' && <ResourcesView />}

          {activeTab === 'games' && <GamesView onEarnXp={handleEarnXp} />}

          {activeTab === 'progress' && <ProgressView />}

          {activeTab === 'profile' && (
            <ProfileCustomizerView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentName={profile.name}
        currentGender={profile.gender}
        onSave={handleOnboardingSave}
      />

      {/* Character Selection Modal */}
      <CharacterSelectionModal
        isOpen={isCharSelectOpen}
        onClose={() => setIsCharSelectOpen(false)}
        currentGender={profile.gender}
        onSelectCharacter={handleSelectCharacter}
      />
    </div>
  );
}
