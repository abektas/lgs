import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Trash2,
  Compass,
  Zap,
  Flame,
  User,
  Bot,
  Loader2,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import { ChatMessage, TargetSchool } from '../types';

interface AiCoachChatProps {
  targetSchool: TargetSchool;
  dailyGoal: number;
}

export const AiCoachChat: React.FC<AiCoachChatProps> = ({ targetSchool, dailyGoal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: `Selam geleceğin şampiyonu! 🚀 Ben senin **LGS Yapay Zeka Koçun Bilge**.

Hedefin olan **${targetSchool.name}** için her gün bir adım daha ileri gidiyoruz! Bugün sana nasıl yardımcı olabilirim?

- 💡 **Yeni Nesil Soru Çözümü:** Takıldığın bir soru veya kavram var mı?
- ⏱️ **Zaman Yönetimi:** Denemelerde süre yetiştirme ve turlama taktikleri.
- 🎯 **Konu Eksiği:** Matematik, Fen, Türkçe veya diğer derslerde strateji.
- 🔥 **Moral & Motivasyon:** Kaygı, yorgunluk ve çalışma isteksizliği.`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      mode: 'socratic',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCoachMode, setActiveCoachMode] = useState<'socratic' | 'strategy' | 'motivation'>('socratic');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const modeInstruction =
        activeCoachMode === 'socratic'
          ? 'Sokratik Koç modundasın. Öğrenciye direkt cevap vermek yerine sorunun kritik kavramını hatırlat ve onu doğru mantığa yönlendir.'
          : activeCoachMode === 'strategy'
          ? 'Sınav Stratejisti modundasın. LGS sınav süresi, optik işaretleme, turlama taktiği ve şık eleme odaklı taktikler ver.'
          : 'Motivasyon ve Zihin Koçu modundasın. Öğrencinin stresini azalt, kendine güvenini tazele ve çalışma azmini canlandır.';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[Mod: ${activeCoachMode} - ${modeInstruction}] ${messageContent}`,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          studentContext: {
            targetSchool: targetSchool.name,
            targetScore: targetSchool.baseScore,
            dailyTarget: dailyGoal,
          },
        }),
      });

      const data = await res.json();
      const coachReply: ChatMessage = {
        id: 'coach-' + Date.now(),
        sender: 'coach',
        text: data.reply || 'Harika bir soru! Adım adım inceleyelim.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        mode: activeCoachMode,
      };

      setMessages((prev) => [...prev, coachReply]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: 'coach-' + Date.now(),
        sender: 'coach',
        text: `Harika bir konu açtın! LGS'de ${targetSchool.name} hedefine ulaşmak için en önemli kural disiplinli soru analizi yapmaktır. Bu soruyu parçalara ayıralım: Soru kökünü ve verilen ipuçlarını tek tek listelemek ilk adımındır!`,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        mode: activeCoachMode,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown symbols for cleaner speech
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'coach',
        text: `Sohbet temizlendi! 🌟 Yeni bir soruyla veya takıldığın konuyla devam edelim. Sana nasıl yardımcı olabilirim?`,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        mode: activeCoachMode,
      },
    ]);
  };

  const quickPrompts = [
    'Matematik yeni nesil soruları nasıl daha hızlı çözebilirim?',
    'Sayısal bölümde sürem yetmiyor, turlama taktiği nasıl uygulanır?',
    'Fen Bilimleri basınç sorularında en çok yapılan hata nedir?',
    'Türkçe paragrafta iki şık arasında kalınca ne yapmalıyım?',
    'Bugün çalışma hevesim yok, bana biraz motivasyon ver!',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-12">
      {/* Top Banner / Mode Select */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-white">Koç Bilge</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Çevrimiçi Mentor
              </span>
            </div>
            <p className="text-xs text-slate-400">
              MEB LGS 8. Sınıf Uzmanı • Hedef Lise: <strong className="text-amber-300">{targetSchool.name}</strong>
            </p>
          </div>
        </div>

        {/* Coach Mode Pills */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveCoachMode('socratic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeCoachMode === 'socratic'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Sokratik Eğitmen</span>
          </button>
          <button
            onClick={() => setActiveCoachMode('strategy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeCoachMode === 'strategy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Sınav Stratejisti</span>
          </button>
          <button
            onClick={() => setActiveCoachMode('motivation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeCoachMode === 'motivation'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Zihin & Motivasyon</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-xl overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isCoach ? 'justify-start' : 'justify-end'}`}
              >
                {isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                    isCoach
                      ? 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tl-sm'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-tr-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 text-[11px] opacity-75 pb-1 border-b border-white/10">
                    <span className="font-bold">{isCoach ? 'Koç Bilge' : 'Sen'}</span>
                    <span className="text-[10px]">{msg.timestamp}</span>
                  </div>

                  {/* Message Body with simple markdown-like rendering */}
                  <div className="space-y-2 whitespace-pre-line break-words text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {/* Audio Playback for Coach */}
                  {isCoach && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-end">
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-rose-400">Sesi Durdur</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Sesli Dinle</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-200 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Koç Bilge LGS müfredatını ve pedagojik stratejiyi değerlendiriyor...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Hızlı Konular:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700 whitespace-nowrap transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer"
            title="Sohbeti Temizle"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Sorunu yaz, takıldığın konuyu sor veya moral desteği iste..."
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <span>Gönder</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
