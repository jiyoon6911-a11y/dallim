
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface IdentificationResult {
  itemName: string;
}

export interface PriceResult {
  priceRange: string;
  unit: string;
  negotiationTip: string;
  description: string;
  sources: { title: string; uri: string }[];
}

export interface TranslationResult {
  translatedText: string;
  phonetic: string;
}

export interface MapSpot {
  title: string;
  uri: string;
}

export const identifyItem = async (base64Image: string, lang: Language): Promise<IdentificationResult> => {
  const ai = getAI();
  const langText = lang === 'KO' ? '한국어' : 'Tiếng Việt';
  const prompt = `당신은 베트남 달랏 야시장의 전문가 가이드입니다. 이 이미지 속의 주요 음식이나 기념품이 무엇인지 ${langText}로 답변하세요. 오직 상품 이름만 짧게 답변하세요. 강조 표시(**)는 사용하지 마세요.`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    }
  });

  return { itemName: response.text?.replace(/\*\*/g, '').trim() || (lang === 'KO' ? '알 수 없음' : 'Không xác định') };
};

export const getAveragePrice = async (itemName: string, lang: Language): Promise<PriceResult> => {
  const ai = getAI();
  const langText = lang === 'KO' ? '한국어' : 'Tiếng Việt';
  
  const prompt = `Provide current market price info for "${itemName}" in Dalat Night Market (Dalat, Vietnam).
  Language: ${langText}. Do NOT use markdown bold (**).
  
  Please provide the info in this exact format:
  PRICE: [number range like 20,000 - 40,000 or 50,000]
  UNIT: [e.g. per kg, per piece]
  TIP: [one short bargaining tip]
  DESC: [brief description about this item]`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const text = (response.text || "").replace(/\*\*/g, '');
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Ref',
    uri: chunk.web?.uri || '#'
  })) || [];

  const priceMatch = text.match(/PRICE:\s*(.*)/i);
  const unitMatch = text.match(/UNIT:\s*(.*)/i);
  const tipMatch = text.match(/TIP:\s*(.*)/i);
  const descMatch = text.match(/DESC:\s*(.*)/i);

  return {
    priceRange: priceMatch ? priceMatch[1].trim() : "20,000 - 50,000",
    unit: unitMatch ? unitMatch[1].trim() : "단위 미정",
    negotiationTip: tipMatch ? tipMatch[1].trim() : (lang === 'KO' ? "흥정이 필요합니다." : "Cần trả giá."),
    description: descMatch ? descMatch[1].trim() : text.split('\n')[0],
    sources
  };
};

export const getMarketMapSpots = async (lang: Language): Promise<MapSpot[]> => {
  const ai = getAI();
  const prompt = `Find 3 key specific location pins within Dalat Night Market (Chợ Đêm Đà Lạt): The entrance area, the main food court steps, and the motorcycle parking area nearby.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: 11.942475,
            longitude: 108.437025
          }
        }
      }
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .filter((c: any) => c.maps)
    .map((c: any) => ({
      title: c.maps.title || "지도에서 확인",
      uri: c.maps.uri
    }));
};

export const translateText = async (text: string, sourceLang: Language): Promise<TranslationResult> => {
  const ai = getAI();
  const targetLang = sourceLang === 'KO' ? 'Vietnamese' : 'Korean';
  
  const prompt = `Translate to ${targetLang}. 
  If translating to Vietnamese, MUST include a field "phonetic" which is the Korean pronunciation of the Vietnamese text.
  Return JSON: {"translatedText": "...", "phonetic": "..."}
  Text: "${text}"`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { translatedText: text, phonetic: "" };
  }
};
