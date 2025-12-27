
import React, { useState } from 'react';
import { MessageCircle, Sparkles, Star, Send, Loader2, Languages, AlertCircle, Key, Quote } from 'lucide-react';
import { PHRASES, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { translateText, TranslationResult } from '../services/geminiService';

interface Props { lang: Language; }

const PhrasesTab: React.FC<Props> = ({ lang }) => {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setError(null);
    try {
      const result = await translateText(inputText, lang);
      setTranslation(result);
    } catch (e: any) {
      handleApiError(e, lang === 'KO' ? "번역 실패" : "Lỗi dịch");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleApiError = async (e: any, defaultMsg: string) => {
    const errorMsg = e.message || "";
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("API_KEY")) {
      setError(lang === 'KO' ? "연결 설정이 필요합니다." : "Cần thiết lập kết nối.");
      if (window.aistudio) setTimeout(() => window.aistudio.openSelectKey(), 500);
    } else {
      setError(`${defaultMsg}: ${lang === 'KO' ? '다시 시도해주세요.' : 'Hãy thử lại.'}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in overflow-hidden">
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 sticky top-0 z-20 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-4 h-4 fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.smartTranslate}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.phrasesTitle}</h1>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Languages /></div>
        </div>

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

        {error && (
          <div className="mt-4 flex items-center justify-between gap-2 text-rose-600 text-[11px] font-bold px-4 py-2 bg-rose-50 rounded-xl border border-rose-100 animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{error}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-40">
        {translation && (
          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white animate-in zoom-in-95 duration-300 shadow-xl shadow-indigo-100">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest opacity-80">{t.transResult}</p>
                <h3 className="text-3xl font-black tracking-tight leading-tight break-words">{translation.translatedText}</h3>
              </div>
              {translation.phonetic && (
                <div className="bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-black text-indigo-100 uppercase mb-2">{t.readKorean}</p>
                  <p className="text-2xl font-black text-white tracking-wide">
                    {translation.phonetic.replace(/["]/g, '')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-2 pt-2">
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{t.essentialTalk}</span>
        </div>
        
        <div className="space-y-4">
          {PHRASES.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all active:scale-[0.98]">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{p.category}</span>
                <Quote className="w-4 h-4 text-slate-100" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 mb-1">{p.ko}</h3>
                  <p className="text-slate-900 font-black text-2xl tracking-tight leading-tight">{p.vn}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{t.pronounceInfo}</p>
                  <p className="text-xl font-black text-indigo-600 tracking-wider">
                    {p.phonetic.replace(/["]/g, '')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden shadow-2xl">
          <Star className="absolute -top-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
          <h4 className="font-black text-lg">💡 {t.pronounceGuide}</h4>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {t.pronounceDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhrasesTab;
