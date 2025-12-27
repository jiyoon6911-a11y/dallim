
import React, { useState, useEffect } from 'react';
import { Scan, MessageCircle, Book, Globe, Battery, Wifi, Signal, Loader2, Sparkles } from 'lucide-react';
import ScannerTab from './components/ScannerTab';
import PhrasesTab from './components/PhrasesTab';
import SurvivalGuideTab from './components/SurvivalGuideTab';
import { Tab, Language } from './types';
import { TRANSLATIONS } from './constants';

const DalatLogo = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <circle cx="50" cy="50" r="48" fill="#312e81" />
      <path d="M20 35 L80 35 L85 45 L15 45 Z" fill="white" />
      <path d="M20 35 L35 35 L35 45 L27 45 Z" fill="#e2e8f0" />
      <path d="M50 35 L65 35 L65 45 L57 45 Z" fill="#e2e8f0" />
      <text x="22" y="78" fontFamily="Arial Black, sans-serif" fontSize="38" fill="white">DL</text>
      <circle cx="75" cy="65" r="10" fill="#fef3c7" />
      <circle cx="75" cy="65" r="7" fill="white" />
      <rect x="74" y="45" width="2" height="12" fill="white" />
      <rect x="71" y="75" width="8" height="3" fill="white" />
      <circle cx="75" cy="65" r="15" fill="white" fillOpacity="0.2" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SCANNER);
  const [lang, setLang] = useState<Language>('KO');
  const [isLaunched, setIsLaunched] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLaunch = () => {
    setIsLaunching(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        setLaunchProgress(100);
        setTimeout(() => {
          setIsLaunched(true);
          setIsLaunching(false);
        }, 300);
      } else {
        setLaunchProgress(progress);
      }
    }, 150);
  };

  // Launching Splash Screen
  if (isLaunching) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 relative overflow-hidden font-sans items-center justify-center animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center space-y-12 w-full px-12">
          <div className="w-32 h-32 animate-in zoom-in-50 duration-700">
            <DalatLogo className="w-full h-full shadow-[0_0_50px_rgba(99,102,241,0.3)]" />
          </div>
          
          <div className="space-y-6 w-full text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter italic">
                {lang === 'KO' ? "달니마" : "Dal Ni Ma"}
              </h2>
              <p className="text-indigo-300/60 text-[10px] font-black tracking-[0.3em] uppercase">
                Dalat Night Market Master
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300" 
                  style={{ width: `${launchProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                <p className="text-white/40 text-[11px] font-bold">
                  {lang === 'KO' ? "야시장 데이터를 불러오는 중..." : "Đang tải dữ liệu chợ đêm..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLaunched) {
    const appName = lang === 'KO' ? "달니마" : "Dal Ni Ma";
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 relative overflow-hidden font-sans select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
        <div className="relative z-10 flex justify-between items-center px-6 pt-3 text-white">
          <span className="text-sm font-bold tracking-tight">{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10 flex-1 px-8 pt-12">
          <div className="grid grid-cols-4 gap-y-10">
            <button 
              onClick={handleLaunch}
              className="flex flex-col items-center gap-2 group active:scale-90 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                <DalatLogo className="w-full h-full" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight drop-shadow-md">{appName}</span>
            </button>
            <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                <div className="w-10 h-10 bg-green-400 rounded-full" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight">{lang === 'KO' ? '전화' : 'Điện thoại'}</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 mb-8 mx-4 p-4 bg-white/20 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 flex justify-around items-center">
           {[1,2,3,4].map(i => (
             <div key={i} className="w-14 h-14 bg-white/20 rounded-2xl border border-white/10 opacity-30" />
           ))}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.SCANNER: return <ScannerTab lang={lang} />;
      case Tab.PHRASES: return <PhrasesTab lang={lang} />;
      case Tab.GUIDE: return <SurvivalGuideTab lang={lang} />;
      default: return <ScannerTab lang={lang} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden font-sans animate-in zoom-in-95 duration-500">
      <div className="fixed top-4 right-4 z-[100] flex justify-end items-center pointer-events-none">
        <button 
          onClick={() => setLang(lang === 'KO' ? 'VN' : 'KO')}
          className="bg-white/80 backdrop-blur-xl border border-slate-100 p-2 pl-4 pr-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-white transition-all active:scale-90 pointer-events-auto"
        >
          <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{t.lang}</span>
          <Globe className="w-4 h-4 text-indigo-400" />
        </button>
      </div>

      <main className="flex-1 overflow-hidden">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-50 flex flex-col items-center pt-4 pb-2 px-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center w-full mb-2">
          {[
            { id: Tab.SCANNER, icon: Scan, label: t.aiScanner },
            { id: Tab.PHRASES, icon: MessageCircle, label: t.phrasesTitle },
            { id: Tab.GUIDE, icon: Book, label: t.guideTitle }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 min-w-[70px] ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-1' : ''
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest text-center ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="w-full text-center pb-1">
          <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            © 2025 Team Dallym
          </span>
        </div>
      </nav>
    </div>
  );
};

export default App;
