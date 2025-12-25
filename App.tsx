
import React, { useState } from 'react';
import { Scan, MessageCircle, Book, Globe } from 'lucide-react';
import ScannerTab from './components/ScannerTab';
import PhrasesTab from './components/PhrasesTab';
import SurvivalGuideTab from './components/SurvivalGuideTab';
import { Tab, Language } from './types';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SCANNER);
  const [lang, setLang] = useState<Language>('KO');

  const t = TRANSLATIONS[lang];

  const renderContent = () => {
    switch (activeTab) {
      case Tab.SCANNER: return <ScannerTab lang={lang} />;
      case Tab.PHRASES: return <PhrasesTab lang={lang} />;
      case Tab.GUIDE: return <SurvivalGuideTab lang={lang} />;
      default: return <ScannerTab lang={lang} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden font-sans">
      {/* Floating Language Toggle */}
      <button 
        onClick={() => setLang(lang === 'KO' ? 'VN' : 'KO')}
        className="fixed top-4 right-4 z-[100] bg-white/80 backdrop-blur-xl border border-slate-100 p-2 pl-4 pr-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-white transition-all active:scale-90"
      >
        <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{t.lang}</span>
        <Globe className="w-4 h-4 text-indigo-400" />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{renderContent()}</main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-50 flex justify-around items-center h-24 pb-6 px-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {[
          { id: Tab.SCANNER, icon: Scan, label: t.scannerTitle },
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
            <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
