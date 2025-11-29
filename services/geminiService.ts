import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const proofreadText = async (text: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: `You are a professional novel editor. Your task is to fix grammar, spelling, and punctuation errors in the provided text.
        
        CRITICAL RULES:
        1. DO NOT change, remove, or translate the special tokens: "IMAGE", "IMAGEU", or the separator "◇ ◆ ◇ ◆ ◇".
        2. Keep the paragraph structure exactly as it is (newlines).
        3. Only correct the narrative text.
        4. Do not add any conversational filler (e.g., "Here is the corrected text"). Return ONLY the corrected text.`,
      }
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};