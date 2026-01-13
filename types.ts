export enum ToneStyle {
  Professional = 'Professional',
  Concise = 'Clear & Concise',
  Friendly = 'Friendly & Warm',
  Academic = 'Academic',
  Creative = 'Creative & Bold',
  Custom = 'Custom Instruction'
}

export enum GeminiModel {
  Flash = 'gemini-3-flash-preview',
  Pro = 'gemini-3-pro-preview'
}

export interface TextImprovementRequest {
  text: string;
  style: ToneStyle;
  model: GeminiModel;
  customInstruction?: string;
}

export interface TextImprovementResponse {
  improvedText: string;
  markdown: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  original: string;
  improved: string;
  style: ToneStyle;
  model: GeminiModel;
  customInstruction?: string;
}
