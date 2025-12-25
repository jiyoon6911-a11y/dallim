
import React from 'react';
import { Shirt, ShieldAlert, Clock, Sparkles, BookOpen, Map, Info, ChevronRight, Utensils, Gift, ShoppingBag, AlertCircle } from 'lucide-react';
import { SURVIVAL_TIPS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

const IconMap: Record<string, React.FC<any>> = { 
  Shirt, 
  ShieldAlert, 
  Clock, 
  Sparkles 
};

interface Props { lang: Language; }

const SurvivalGuideTab: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const zones = [
    { icon: Utensils, name: { KO: '식당 구역', VN: 'Khu đồ ăn' }, desc: { KO: '중앙 계단 & 안쪽 골목', VN: 'Cầu thang & hẻm' }, color: 'bg-orange-100 text-orange-600' },
    { icon: Shirt, name: { KO: '의류/니트 구역', VN: 'Khu đồ len' }, desc: { KO: '야외 매대 & 로터리 주변', VN: 'Xung quanh bùng binh' }, color: 'bg-blue-100 text-blue-600' },
    { icon: Gift, name: { KO: '과일/기념품 구역', VN: 'Khu quà tặng' }, desc: { KO: '입구쪽 고정 매장들', VN: 'Cửa hàng cố định' }, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 bg-white border-b border-slate-100 sticky top-0 z-10 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-4 h-4 fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Market Expert</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.guideTitle}</h1>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><BookOpen /></div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-32">
        {/* Market Map Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Map className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">야시장 구역 가이드</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {zones.map((zone, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${zone.color}`}>
                    <zone.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{zone.name[lang]}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{zone.desc[lang]}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">절대 실패없는 전문 팁</h2>
          </div>
          <div className="space-y-4">
            {SURVIVAL_TIPS.map((tip) => {
              const Icon = IconMap[tip.icon] || Info;
              return (
                <div key={tip.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-5 transition-all active:scale-[0.98]">
                  <div className={`p-4 rounded-2xl h-fit flex-shrink-0 ${tip.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-slate-800 text-base leading-tight">{tip.title[lang]}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{tip.description[lang]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clothing Warning Callout */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-3 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shirt className="w-32 h-32 rotate-12" />
          </div>
          <h4 className="text-xl font-black tracking-tight leading-tight">⚠️ 중국산 재질 주의</h4>
          <p className="text-slate-400 text-xs font-medium leading-relaxed">
            일부 상인들은 중국산 기성품을 달랏 현지 수제 옷이라고 거짓말하며 비싸게 팔기도 합니다. 디자인이 너무 매끈하거나 재질이 비닐 같다면 의심해 보세요!
          </p>
        </div>

        {/* Bottom Callout */}
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white space-y-3 relative overflow-hidden shadow-xl shadow-indigo-100">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShoppingBag className="w-32 h-32 rotate-12" />
          </div>
          <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Shopping Tip</p>
          <h4 className="text-xl font-black tracking-tight leading-tight">현명한 쇼핑은<br/>미소에서 시작됩니다</h4>
          <p className="text-indigo-100/80 text-xs font-medium leading-relaxed">
            "씬 짜오(안녕하세요)"라고 먼저 웃으며 건네보세요. 기분 좋은 첫 마디가 더 큰 할인을 불러올 수도 있습니다!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurvivalGuideTab;
