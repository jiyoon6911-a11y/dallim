
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, RotateCcw, CheckCircle, XCircle, Search, Info, Loader2,
  ChevronRight, ScanLine, Sparkles, Tag, Lightbulb, ExternalLink,
  Keyboard, Edit3
} from 'lucide-react';
import { identifyItem, getAveragePrice, PriceResult } from '../services/geminiService';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

enum ScanState { IDLE, CAPTURING, IDENTIFYING, CONFIRMING, SEARCHING, RESULT, MANUAL_INPUT }

interface Props { lang: Language; }

const ScannerTab: React.FC<Props> = ({ lang }) => {
  const [state, setState] = useState<ScanState>(ScanState.IDLE);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [itemName, setItemName] = useState<string>('');
  const [priceData, setPriceData] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initCamera = async () => {
    setIsCameraLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraLoading(false);
          videoRef.current?.play().catch(console.error);
        };
      }
    } catch (err) {
      setError(t.identifyFailed);
      setState(ScanState.IDLE);
    }
  };

  useEffect(() => {
    if (state === ScanState.CAPTURING) initCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
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
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        handleIdentify(dataUrl.split(',')[1]);
      }
    }
  };

  const handleIdentify = async (base64: string) => {
    setState(ScanState.IDENTIFYING);
    try {
      const result = await identifyItem(base64, lang);
      setItemName(result.itemName);
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

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-100 flex justify-between items-center z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <ScanLine className="w-6 h-6 text-indigo-600" />
          <h1 className="font-bold text-slate-800">{t.scannerTitle}</h1>
        </div>
        {state !== ScanState.IDLE && <button onClick={reset} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><RotateCcw className="w-5 h-5" /></button>}
      </div>

      <div className="flex-1 relative p-6 overflow-y-auto pb-32">
        {state === ScanState.IDLE && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in-95">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.startTitle}</h2>
              <p className="text-slate-500 font-medium">{t.startSub}</p>
            </div>
            <div className="w-full space-y-4">
              <button onClick={() => setState(ScanState.CAPTURING)} className="w-full p-8 bg-indigo-600 rounded-[2rem] flex items-center justify-between group shadow-xl shadow-indigo-200">
                <div className="flex items-center gap-5">
                  <div className="bg-white/20 p-4 rounded-2xl text-white"><Camera className="w-8 h-8" /></div>
                  <span className="text-xl font-bold text-white">{t.byCamera}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-white opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setState(ScanState.MANUAL_INPUT)} className="w-full p-8 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="bg-slate-100 p-4 rounded-2xl text-slate-600"><Keyboard className="w-8 h-8" /></div>
                  <span className="text-xl font-bold text-slate-800">{t.bySearch}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {state === ScanState.CAPTURING && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />
            {isCameraLoading && <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white"><Loader2 className="animate-spin" /></div>}
            <div className="p-10 flex justify-center bg-black/50 backdrop-blur-md">
              <button onClick={captureImage} className="w-20 h-20 rounded-full border-4 border-white p-1.5"><div className="w-full h-full bg-white rounded-full"/></button>
            </div>
          </div>
        )}

        {state === ScanState.MANUAL_INPUT && (
          <div className="h-full flex flex-col items-center pt-20 space-y-8 animate-in slide-in-from-bottom-5">
            <div className="bg-indigo-600/10 p-6 rounded-[2.5rem]"><Search className="w-12 h-12 text-indigo-600" /></div>
            <div className="w-full space-y-6">
              <input 
                type="text" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl text-xl font-bold focus:border-indigo-600 outline-none transition-all shadow-sm"
              />
              <button onClick={handlePriceSearch} disabled={!itemName} className="w-full py-5 bg-indigo-600 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg shadow-lg">
                {t.searchBtn}
              </button>
              <button onClick={() => setState(ScanState.IDLE)} className="w-full text-slate-400 font-bold">{t.reset}</button>
            </div>
          </div>
        )}

        {(state === ScanState.IDENTIFYING || state === ScanState.SEARCHING) && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-xl font-black text-slate-800">Gemini AI<br/>Thinking...</p>
          </div>
        )}

        {state === ScanState.CONFIRMING && (
          <div className="space-y-8 animate-in zoom-in-95">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
              {image && <img src={image} className="w-full h-64 object-cover" />}
              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-indigo-600 text-xs font-black uppercase">{t.confirmItem}</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="text-3xl font-black text-slate-900 w-full outline-none border-b-2 border-slate-100 focus:border-indigo-600 transition-colors py-2"
                    />
                    <Edit3 className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium pt-2">{t.editing}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={reset} className="py-4 bg-slate-100 rounded-2xl font-bold">{t.reset}</button>
                  <button onClick={handlePriceSearch} className="py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">{t.searchBtn}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === ScanState.RESULT && priceData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-black text-slate-800">{itemName}</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
                <p className="text-[10px] font-black text-indigo-600 mb-2 uppercase">{t.recommended}</p>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-slate-900">{priceData.priceRange}</span>
                  <span className="text-sm font-bold text-slate-400">VND ({priceData.unit})</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex gap-4">
              <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-black text-amber-900 text-xs uppercase">{t.negotiation}</p>
                <p className="text-sm font-semibold text-amber-800">{priceData.negotiationTip}</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <p className="text-xs font-black text-slate-400 mb-2 uppercase">{t.details}</p>
              <p className="text-slate-600 font-medium leading-relaxed">{priceData.description}</p>
            </div>
            <button onClick={reset} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black">{t.reset}</button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ScannerTab;
