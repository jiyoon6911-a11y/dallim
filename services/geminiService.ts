
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Language } from '../types';

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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

export const identifyItem = async (base64Image: string, lang: Language): Promise<IdentificationResult> => {
  const ai = getAIClient();
  const langText = lang === 'KO' ? '한국어' : 'Tiếng Việt';
  const prompt = `당신은 베트남 달랏 야시장의 전문가 가이드입니다. 이 이미지 속의 주요 음식이나 기념품이 무엇인지 ${langText}로 답변하세요. 오직 상품 이름만 짧게 답변하세요.`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    }
  });

  return { itemName: response.text?.trim() || (lang === 'KO' ? '알 수 없음' : 'Không xác định') };
};

export const getAveragePrice = async (itemName: string, lang: Language): Promise<PriceResult> => {
  const ai = getAIClient();
  const langText = lang === 'KO' ? '한국어' : 'Tiếng Việt';
  const prompt = `Provide the current average price for "${itemName}" in Dalat Market. 
  Answer in ${langText}.
  Return ONLY a JSON object:
  {
    "priceRange": "string (e.g., 20.000 - 30.000)",
    "unit": "string (e.g., per 1kg)",
    "negotiationTip": "one sentence bargaining tip",
    "description": "brief description or how to pick a good one"
  }`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json"
    }
  });

  let data;
  try {
    data = JSON.parse(response.text || '{}');
  } catch (e) {
    data = {
      priceRange: "-",
      unit: "-",
      negotiationTip: lang === 'KO' ? "흥정이 필요합니다." : "Cần trả giá.",
      description: response.text || ""
    };
  }

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Ref',
    uri: chunk.web?.uri || '#'
  })) || [];

  return { ...data, sources };
};

export const translateText = async (text: string, sourceLang: Language): Promise<TranslationResult> => {
  const ai = getAIClient();
  const targetLang = sourceLang === 'KO' ? 'Vietnamese' : 'Korean';
  
  const prompt = `Translate the following text into ${targetLang}. 
  If translating to Vietnamese, also provide a simplified Korean pronunciation (phonetic) for it.
  Return ONLY a JSON object:
  {
    "translatedText": "translated string",
    "phonetic": "phonetic reading in source language's alphabet (empty if not applicable)"
  }
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
