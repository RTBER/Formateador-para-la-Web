
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
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: `Eres un editor profesional de novelas ligeras. Tu tarea es corregir errores gramaticales, ortográficos y de puntuación.
        
        REGLAS CRÍTICAS:
        1. NO cambies, elimines ni traduzcas los tokens especiales: "IMAGE", "IMAGEU" o el separador "◇ ◆ ◇ ◆ ◇".
        2. Mantén la estructura de párrafos exactamente como está.
        3. Solo corrige el texto narrativo y diálogos.
        4. No añadas comentarios extra. Devuelve SOLO el texto corregido.`,
      }
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
