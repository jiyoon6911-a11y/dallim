
export enum Tab {
  SCANNER = 'scanner',
  PHRASES = 'phrases',
  GUIDE = 'guide'
}

export type Language = 'KO' | 'VN';

export interface SurvivalTip {
  id: string;
  icon: string;
  color: string;
  title: Record<string, string>;
  description: Record<string, string>;
}

export interface Phrase {
  id: string;
  category: string;
  ko: string;
  vn: string;
  phonetic: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
