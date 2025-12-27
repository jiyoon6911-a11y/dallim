
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, RotateCcw, Search, Info, 
  ChevronRight, ScanLine, Sparkles, Tag, Lightbulb,
  Keyboard, Edit3, X, Zap, Globe, Database, HelpCircle, 
  ArrowRightLeft, Coins, ArrowLeft, Loader2
} from 'lucide-react';
import { identifyItem, getAveragePrice, PriceResult } from '../services/geminiService';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

enum ScanState { IDLE, CAPTURING, IDENTIFYING, CONFIRMING, SEARCHING, RESULT, MANUAL_INPUT }

interface Props { lang: Language; }

const VND_TO_KRW_RATE = 0.054;

const DalatLogo = ({ className }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
      <circle cx="50" cy="50" r="48" fill="#312e81" />
      <path d="M20 35 L80 35 L85 45 L15 45 Z" fill="white" />
      <path d="M20 35 L35 35 L35 45 L27 45 Z" fill="#e2e8f0" />
      <path d="M50 35 L65 35 L65 45 L57 45 Z" fill="#e2e8f0" />
      <text x="22" y="78" fontFamily="Arial Black, sans-serif" fontSize="38" fill="white">DL</text>
      <circle cx="75" cy="65" r="10" fill="#fef3c7" className="animate-pulse" />
      <circle cx="75" cy="65" r="7" fill="white" />
      <rect x="74" y="45" width="2" height="12" fill="white" />
      <rect x="71" y="75" width="8" height="3" fill="white" />
      <circle cx="75" cy="65" r="15" fill="white" fillOpacity="0.2" />
    </svg>
  </div>
);

const ScannerTab: React.FC<Props> = ({ lang }) => {
  const [state, setState] = useState<ScanState>(ScanState.IDLE);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [itemName, setItemName] = useState<string>('');
  const [priceData, setPriceData] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const t = TRANSLATIONS[lang];

  const loadingMessages = state === ScanState.IDENTIFYING 
    ? t.loadingIdentify
    : t.loadingSearch;

  useEffect(() => {
    let interval: number;
    if (state === ScanState.IDENTIFYING || state === ScanState.SEARCHING) {
      setLoadingStep(0);
      interval = window.setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [state, loadingMessages]);

  const initCamera = async () => {
    setIsCameraLoading(true);
    setError(null);
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { exact: 'environment' } } 
        });
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.onloadedmetadata = () => {
          setIsCameraLoading(false);
          videoRef.current?.play().catch(console.error);
        };
      }
    } catch (err) {
      console.error("Camera Init Error:", err);
      setError(lang === 'KO' ? "카메라를 실행할 수 없습니다." : "Không thể khởi động camera.");
      setIsCameraLoading(false);
      setState(ScanState.IDLE);
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (state === ScanState.CAPTURING) {
      initCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [state]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setImage(dataUrl);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }
        handleIdentify(dataUrl.split(',')[1]);
      }
    }
  };

  const handleIdentify = async (base64: string) => {
    setState(ScanState.IDENTIFYING);
    try {
      const result = await identifyItem(base64, lang);
      setItemName(result.itemName.replace(/\*\*/g, ''));
      setState(ScanState.CONFIRMING);
    } catch (err) {
      setError(t.identifyFailed);
      setState(ScanState.IDLE);
    }
  };

  const handlePriceSearch = async () => {
    if (!itemName.trim()) return;
    setState(ScanState.SEARCHING);
    try {
      const result = await getAveragePrice(itemName, lang);
      setPriceData(result);
      setState(ScanState.RESULT);
    } catch (err) {
      setError(t.priceFailed);
      setState(ScanState.CONFIRMING);
    }
  };

  const reset = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setImage(null); setItemName(''); setPriceData(null); setError(null); setState(ScanState.IDLE);
  };

  const formatPriceAsKrw = (priceStr: string) => {
    let cleaned = priceStr.toLowerCase().replace(/(\d+)\s*k/g, (_, num) => `${num}000`);
    const parts = cleaned.split(/[~\-]/).map(p => p.replace(/[^0-9]/g, ''));
    const convert = (numStr: string) => {
      if (!numStr || isNaN(parseInt(numStr))) return null;
      const vnd = parseInt(numStr);
      const krw = Math.round(vnd * VND_TO_KRW_RATE);
      return new Intl.NumberFormat('ko-KR').format(krw);
    };
    if (parts.length > 1 && parts[1]) {
      const start = convert(parts[0]);
      const end = convert(parts[1]);
      return start && end ? `${start} ~ ${end}${lang === 'KO' ? '원' : ' KRW'}` : null;
    }
    const single = convert(parts[0]);
    return single ? `${single}${lang === 'KO' ? '원' : ' KRW'}` : null;
  };

  const splitVndRange = (priceStr: string) => {
    const parts = priceStr.split(/[~\-]/).map(p => p.trim());
    return { start: parts[0], end: parts[1] || null };
  };

  const renderLoadingOverlay = () => (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-12 animate-in fade-in duration-500 bg-white">
      <div className="relative">
        <div className="absolute inset-0 -m-8 border border-indigo-100 rounded-full animate-ping opacity-20" />
        <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border border-indigo-50">
          <div className="absolute inset-2 border-2 border-dashed border-indigo-200 rounded-full animate-[spin_10s_linear_infinite]" />
          {state === ScanState.IDENTIFYING ? (
            <Zap className="w-12 h-12 text-indigo-600 animate-bounce" />
          ) : (
            <Globe className="w-12 h-12 text-indigo-600 animate-pulse" />
          )}
        </div>
      </div>
      <div className="space-y-4 max-w-xs">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {state === ScanState.IDENTIFYING ? t.analyzing : t.searchingPrice}
        </h2>
        <div className="flex flex-col items-center gap-3">
          <div className="h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
            />
          </div>
          <p className="text-indigo-600 font-black text-xs uppercase tracking-wider animate-pulse">
            {loadingMessages[loadingStep]}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center z-40 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <DalatLogo className="w-8 h-8" />
          <h1 className="font-black text-slate-800 tracking-tight line-clamp-1">{t.scannerTitle}</h1>
        </div>
        {state !== ScanState.IDLE && (
          <button onClick={reset} className="p-2.5 rounded-2xl bg-slate-100 text-slate-500 active:scale-90 transition-transform">
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 relative overflow-y-auto">
        {state === ScanState.IDLE && (
          <div className="h-full flex flex-col items-center justify-start text-center space-y-8 p-6 pt-8 animate-in zoom-in-95">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full text-indigo-600 text-[9px] font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3 h-3 fill-indigo-600" /> POWERED BY GEMINI AI
              </div>
              
              <div className="space-y-2">
                <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{t.startTitle}</h2>
                <p className="text-sm font-bold text-slate-400 tracking-tight">
                  (<span className="text-blue-600">dal</span>at <span className="text-blue-600">ni</span>ght market <span className="text-blue-600">ma</span>ster)
                </p>
              </div>
              
              <p className="text-slate-500 font-medium px-8">{t.startSub}</p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 animate-bounce">
                {error}
              </div>
            )}

            <div className="w-full flex gap-4 px-2">
              <button 
                onClick={() => setState(ScanState.CAPTURING)} 
                className="flex-1 p-6 py-8 bg-indigo-600 rounded-[3rem] flex flex-col items-center justify-center gap-4 group shadow-xl shadow-indigo-100 active:scale-95 transition-all"
              >
                <div className="bg-white/20 p-4 rounded-3xl text-white group-hover:scale-110 transition-transform shadow-inner">
                  <Camera className="w-9 h-9" />
                </div>
                <span className="text-xl font-black text-white tracking-tight leading-tight">{t.byCamera}</span>
              </button>

              <button 
                onClick={() => setState(ScanState.MANUAL_INPUT)} 
                className="flex-1 p-6 py-8 bg-white border-2 border-slate-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 group active:scale-95 transition-all shadow-sm"
              >
                <div className="bg-slate-50 p-4 rounded-3xl text-slate-400 group-hover:scale-110 transition-transform shadow-inner">
                  <Keyboard className="w-9 h-9" />
                </div>
                <span className="text-xl font-black text-slate-800 tracking-tight leading-tight">{t.bySearch}</span>
              </button>
            </div>
          </div>
        )}

        {state === ScanState.CAPTURING && (
          <div className="h-full bg-black relative flex flex-col animate-in fade-in">
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
              {isCameraLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md">
                  <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
                  <p className="text-white font-black text-sm">{t.cameraReady}</p>
                </div>
              )}
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="scan-line" />
                <div className="absolute inset-10 border-2 border-white/20 rounded-3xl" />
              </div>
            </div>
            
            <div className="h-44 bg-slate-950 flex items-center justify-between px-10 relative">
              <button 
                onClick={() => setState(ScanState.IDLE)} 
                className="p-4 bg-white/10 rounded-full text-white active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 -top-12">
                <button 
                  onClick={captureImage} 
                  disabled={isCameraLoading} 
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-[6px] border-indigo-600 active:scale-90 transition-all shadow-[0_0_30px_rgba(99,102,241,0.5)] group disabled:opacity-50"
                >
                  <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                    <Camera className="w-7 h-7 text-indigo-600 opacity-80 group-active:scale-125 transition-transform" />
                  </div>
                </button>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] text-center mt-3 animate-pulse">
                  {t.tapToScan}
                </p>
              </div>

              <div className="w-14" />
            </div>
          </div>
        )}

        {(state === ScanState.IDENTIFYING || state === ScanState.SEARCHING) && renderLoadingOverlay()}

        {state === ScanState.CONFIRMING && (
          <div className="p-6 space-y-6 animate-in slide-in-from-bottom-5">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100">
              {image && <img src={image} className="w-full h-48 object-cover opacity-90" />}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  <p className="text-indigo-600 text-[11px] font-black uppercase tracking-widest">{t.confirmItem}</p>
                </div>
                <div className="relative bg-slate-50 rounded-3xl p-5 border-2 border-indigo-50 focus-within:border-indigo-500 transition-all">
                  <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full bg-transparent text-3xl font-black text-slate-900 outline-none tracking-tight py-1" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"><Edit3 className="w-5 h-5" /></div>
                  <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.editing}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setState(ScanState.CAPTURING)} className="py-5 bg-slate-100 rounded-3xl font-black text-slate-500 active:scale-95 transition-all">{t.retake}</button>
                  <button onClick={handlePriceSearch} className="py-5 bg-indigo-600 text-white rounded-3xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">{t.searchBtn}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === ScanState.RESULT && priceData && (
          <div className="p-6 space-y-6 animate-in slide-in-from-bottom-10 duration-500 pb-32">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">{t.priceResult}</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{itemName}</h2>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm"><Tag className="w-5 h-5 text-indigo-600" /></div>
            </div>
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 space-y-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{t.recommended}</p>
                  <div className="flex flex-col items-center gap-1">
                    {(() => {
                      const { start, end } = splitVndRange(priceData.priceRange);
                      return (
                        <>
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">{start}</span>
                          {end && (
                            <>
                              <span className="text-xl font-bold text-slate-300">~</span>
                              <span className="text-4xl font-black text-slate-900 tracking-tighter">{end}</span>
                            </>
                          )}
                        </>
                      );
                    })()}
                    <div className="mt-3 inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full">
                      <span className="text-sm font-black tracking-widest uppercase">VND</span>
                      <div className="h-3 w-px bg-white/20" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase">{priceData.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-100 border-2 border-amber-200 rounded-[2.5rem] p-6 text-center shadow-inner animate-in zoom-in-95 duration-700 delay-200">
                  <p className="text-amber-800 text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">{t.krwConvert}</p>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-amber-700/60 font-bold text-lg">{t.about}</span>
                    <span className="text-3xl font-black text-amber-950 tracking-tight">{formatPriceAsKrw(priceData.priceRange) || (lang === 'KO' ? '시세 확인 불가' : 'Không rõ giá')}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.details}</p>
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed text-sm bg-slate-50 p-6 rounded-3xl">{priceData.description}</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-600 p-8 rounded-[3rem] shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <div className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform"><Lightbulb className="w-32 h-32" /></div>
              <div className="flex gap-5 items-start">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner shrink-0"><Zap className="w-6 h-6 text-white" /></div>
                <div className="space-y-1.5 pr-4">
                  <p className="font-black text-indigo-200 text-[10px] uppercase tracking-widest opacity-60">{t.negotiation}</p>
                  <p className="text-lg font-black text-white leading-tight tracking-tight">{priceData.negotiationTip}</p>
                </div>
              </div>
            </div>
            <button onClick={reset} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all mb-12 flex items-center justify-center gap-3">
              <RotateCcw className="w-5 h-5" />
              {t.reset}
            </button>
          </div>
        )}

        {state === ScanState.MANUAL_INPUT && (
          <div className="h-full flex flex-col items-center pt-20 space-y-10 p-6 animate-in slide-in-from-bottom-5">
            <div className="bg-indigo-600/10 p-10 rounded-[3rem] shadow-inner"><Database className="w-14 h-14 text-indigo-600" /></div>
            <div className="w-full space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-4">{lang === 'KO' ? '품목 이름' : 'Tên món hàng'}</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder={t.searchPlaceholder} className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2rem] text-2xl font-black focus:border-indigo-600 outline-none transition-all shadow-sm" />
              </div>
              <button onClick={handlePriceSearch} disabled={!itemName} className="w-full py-6 bg-indigo-600 disabled:bg-slate-200 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all">
                {t.searchBtn}
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ScannerTab;
