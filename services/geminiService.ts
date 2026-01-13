import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (customInstruction?: string): string => {
  const baseInstruction = "You are an expert editor and writing assistant. Your goal is to improve the user's text while preserving the original meaning. IMPORTANT: The very first line of your response MUST be a suggested filename for this content (e.g., 'improved-memo.md'). It should be a valid filename, preferably kebab-case. Do not wrap it in markdown code blocks. The refined text starts on the second line.";

  if (customInstruction && customInstruction.trim()) {
    // We append the base instruction rules to the user's custom instruction to ensure formatting consistency
    return `${customInstruction}\n\n[SYSTEM NOTE: ${baseInstruction}]`;
  }

  return `${baseInstruction} Improve the clarity and grammar of the text. Output in Markdown.`;
};

export const improveText = async (
  text: string,
  model: GeminiModel,
  customInstruction?: string,
  temperature?: number,
  thinkingBudget?: number
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(customInstruction);
    
    let config: any = {
      systemInstruction: systemInstruction,
    };

    // Configure model specific settings
    if (model === GeminiModel.Pro) {
      // Gemini 3 Pro supports Thinking Mode
      // If thinkingBudget is provided and > 0, use it. Default to max if not specified but Pro is selected? 
      // User controls this now.
      if (thinkingBudget !== undefined && thinkingBudget > 0) {
         config.thinkingConfig = { thinkingBudget: thinkingBudget };
      }
    } else {
      // Gemini 3 Flash supports Temperature
      if (temperature !== undefined) {
        config.temperature = temperature;
      }
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: text,
      config: config,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate improved text. Please try again.");
  }
};
