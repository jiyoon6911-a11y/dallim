
import React from 'react';
import { 
  Shirt, ShieldAlert, Sparkles, BookOpen, Info, 
  Utensils, Gift, Camera, Store, Map as MapIcon,
  Thermometer, Flame, ShoppingBag
} from 'lucide-react';
import { SURVIVAL_TIPS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

const IconMap: Record<string, React.FC<any>> = { 
  Shirt, 
  ShieldAlert, 
  Wallet: ShoppingBag,
  Utensils,
  AlertTriangle: Info,
  Gift,
  AlertCircle: Info
};

interface Props { lang: Language; }

const SurvivalGuideTab: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const MARKET_ZONES = [
    {
      title: lang === 'KO' ? "📍 1구역: 중앙 광장 & 계단" : "📍 Khu 1: Quảng trường & Bậc thang",
      items: lang === 'KO' ? "반짱느엉(베트남 피자), 꼬치구이, 계단 노점 간식, 버스킹" : "Bánh tráng nướng, đồ nướng, ăn vặt bậc thang.",
      color: "border-orange-200 bg-orange-50/30"
    },
    {
      title: lang === 'KO' ? "📍 2구역: 먹거리 골목 (왼쪽)" : "📍 Khu 2: Ngõ Ẩm Thực (Bên trái)",
      items: lang === 'KO' ? "반미, 국수류, 달랏 우유, 과일 요거트, 각종 로컬 음식" : "Bánh mì, bún hủ tiếu, sữa đậu nành, sữa chua phô mai.",
      color: "border-blue-200 bg-blue-50/30"
    },
    {
      title: lang === 'KO' ? "📍 3구역: 의류 & 잡화 (언덕 위)" : "📍 Khu 3: Đồ Len & Thời Trang (Trên đồi)",
      items: lang === 'KO' ? "니트, 스웨터, 털모자, 목도리, 가죽 제품, 세컨핸드 옷" : "Áo len, mũ, khăn choàng, đồ da, quần áo cũ.",
      color: "border-purple-200 bg-purple-50/30"
    },
    {
      title: lang === 'KO' ? "📍 4구역: 특산품 & 기념품 (상단)" : "📍 Khu 4: Đặc Sản & Quà Tặng (Phía trên)",
      items: lang === 'KO' ? "아티초크 차, 말린 과일, 딸기 잼, 생화, 와인, 견과류" : "Trà atiso, mứt trái cây, hoa tươi, rượu vang.",
      color: "border-emerald-200 bg-emerald-50/30"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 sticky top-0 z-10 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="w-4 h-4 fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.survivalLabel}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{t.guideTitle}</h1>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><BookOpen /></div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-40">
        {/* Map Visual Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <MapIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{t.mapTitle}</h2>
          </div>
          
          <div className="bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden aspect-video relative">
            <iframe 
              src="https://maps.google.com/maps?q=11.942475,108.437025&z=17&output=embed"
              className="w-full h-full rounded-[2.1rem]"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
          <p className="text-[9px] text-slate-400 text-center font-medium">{t.mapSub}</p>
        </div>

        {/* Simplified Market Zones Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Store className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{t.zonesTitle}</h2>
          </div>
          <div className="space-y-3">
            {MARKET_ZONES.map((zone, i) => (
              <div key={i} className={`p-5 rounded-[2rem] border ${zone.color} shadow-sm transition-all active:scale-[0.98]`}>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-black text-slate-900 text-[15px]">{zone.title}</h3>
                  <p className="text-slate-600 text-sm font-semibold leading-relaxed">
                    {zone.items}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Survival Tips Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Info className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{t.marketTipsTitle}</h2>
          </div>
          <div className="space-y-4">
            {SURVIVAL_TIPS.map((tip) => {
              const Icon = IconMap[tip.icon] || Info;
              return (
                <div key={tip.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-5 transition-all">
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

        {/* Weather Notification Card */}
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-4 relative overflow-hidden shadow-2xl mb-12">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Thermometer className="w-32 h-32 rotate-12" />
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.weatherTipLabel}</span>
          </div>
          <h4 className="text-2xl font-black tracking-tight leading-tight">{t.weatherTipTitle}</h4>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {t.weatherTipDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurvivalGuideTab;
