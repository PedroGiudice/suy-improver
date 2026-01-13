export enum GeminiModel {
  Flash = 'gemini-3-flash-preview',
  Pro = 'gemini-3-pro-preview'
}

export interface TextImprovementRequest {
  text: string;
  model: GeminiModel;
  systemInstruction?: string;
  temperature?: number;
  thinkingBudget?: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  original: string;
  improved: string;
  model: GeminiModel;
  systemInstruction?: string;
  temperature?: number;
  thinkingBudget?: number;
}
