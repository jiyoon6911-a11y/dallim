
import React, { useState } from 'react';
import { MessageCircle, Volume2, Sparkles, Star, Send, Loader2, Languages } from 'lucide-react';
import { PHRASES, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { translateText, TranslationResult } from '../services/geminiService';

interface Props { lang: Language; }

const PhrasesTab: React.FC<Props> = ({ lang }) => {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const result = await translateText(inputText, lang);
      setTranslation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 bg-white border-b border-slate-100 sticky top-0 z-10 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-4 h-4 fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Translator</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.phrasesTitle}</h1>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Languages /></div>
        </div>

        {/* Translation Box */}
        <div className="relative group">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
            placeholder={t.translatePlaceholder}
            className="w-full p-5 pr-14 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
          />
          <button 
            onClick={handleTranslate}
            disabled={isTranslating || !inputText}
            className="absolute right-2 top-2 p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl transition-all shadow-lg active:scale-90"
          >
            {isTranslating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

        {/* Translation Result Area */}
        {translation && (
          <div className="mt-4 p-5 bg-indigo-600 rounded-3xl text-white animate-in slide-in-from-top-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Result</p>
                <h3 className="text-2xl font-black tracking-tight leading-tight">{translation.translatedText}</h3>
                {translation.phonetic && (
                  <p className="text-indigo-100/70 text-sm font-medium italic">"{translation.phonetic}"</p>
                )}
              </div>
              <button className="p-2 bg-white/20 rounded-xl"><Volume2 className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Phrase List */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto pb-32">
        <div className="flex items-center gap-2 px-2">
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Essentials List</span>
        </div>
        
        {PHRASES.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group active:scale-95 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full">{p.category}</span>
              <h3 className="text-lg font-black text-slate-900">{p.ko}</h3>
              <p className="text-indigo-600 font-black text-xl tracking-tight">{p.vn}</p>
              <p className="text-slate-400 text-sm italic font-medium">"{p.phonetic}"</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Volume2 className="w-6 h-6" />
            </div>
          </div>
        ))}
        
        <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden">
          <Star className="absolute -top-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
          <h4 className="font-black text-lg">💡 작은 팁</h4>
          <p className="text-indigo-100 text-sm leading-relaxed font-medium">
            베트남어는 성조가 중요하지만, 자신 있게 말하면 상인들도 대부분 알아듣습니다! 웃는 얼굴로 인사해 보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhrasesTab;
