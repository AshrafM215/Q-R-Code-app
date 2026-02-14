import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMagicContent = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert QR code content formatter.
      User request: "${prompt}"

      Rules:
      1. If the user wants a Wi-Fi code, output strictly in format: WIFI:S:MySSID;T:WPA;P:MyPass;;
      2. If the user wants a vCard, output strictly in VCF 3.0 format.
      3. If the user wants a calendar event, output strictly in iCalendar format.
      4. If the user simply wants a creative message, poem, or joke, output just that text.
      5. If the user wants a URL summary, output the URL or the summarized text.
      6. Do NOT include markdown code blocks (like \`\`\`). Just the raw string ready for the QR code.
      `,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content via AI.");
  }
};