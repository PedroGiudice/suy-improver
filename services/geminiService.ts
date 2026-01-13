import { GoogleGenAI } from "@google/genai";
import { ToneStyle, GeminiModel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (style: ToneStyle, customInstruction?: string): string => {
  const baseInstruction = "You are an expert editor and writing assistant. Your goal is to improve the user's text while preserving the original meaning. IMPORTANT: The very first line of your response MUST be a suggested filename for this content (e.g., 'improved-memo.md'). It should be a valid filename, preferably kebab-case. Do not wrap it in markdown code blocks. The refined text starts on the second line.";

  if (style === ToneStyle.Custom && customInstruction) {
    return `${baseInstruction} Follow this specific instruction strictly: ${customInstruction}`;
  }

  switch (style) {
    case ToneStyle.Professional:
      return `${baseInstruction} Rewrite the text to be professional, formal, and suitable for a business context. Ensure correct grammar and sophisticated vocabulary. Output in Markdown.`;
    case ToneStyle.Concise:
      return `${baseInstruction} Rewrite the text to be clear, concise, and to the point. Remove unnecessary words and fluff. Output in Markdown.`;
    case ToneStyle.Friendly:
      return `${baseInstruction} Rewrite the text to be friendly, warm, and approachable. Use natural language and an inviting tone. Output in Markdown.`;
    case ToneStyle.Academic:
      return `${baseInstruction} Rewrite the text to be academic, objective, and rigorous. Use precise terminology and complex sentence structures where appropriate. Output in Markdown.`;
    case ToneStyle.Creative:
      return `${baseInstruction} Rewrite the text to be creative, engaging, and evocative. Use vivid imagery and a compelling voice. Output in Markdown.`;
    default:
      return `${baseInstruction} Improve the clarity and grammar of the text. Output in Markdown.`;
  }
};

export const improveText = async (
  text: string,
  style: ToneStyle,
  model: GeminiModel,
  customInstruction?: string
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(style, customInstruction);
    
    let config: any = {
      systemInstruction: systemInstruction,
    };

    // Configure model specific settings
    if (model === GeminiModel.Pro) {
      // Logic for Gemini 3 Pro (Thinking Mode)
      // As per requirements: Set thinkingBudget to 32768, do not set maxOutputTokens
      config.thinkingConfig = { thinkingBudget: 32768 };
    } else {
      // Logic for Gemini 3 Flash (Fast)
      config.temperature = 0.7; // Slightly creative but focused
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
