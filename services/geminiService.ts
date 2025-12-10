import { GoogleGenAI } from "@google/genai";
import { JAPIE_SYSTEM_PROMPT, MODEL_NAME } from "../constants";
import { JapieResponse } from "../types";

let chatSession: any | null = null;

export const analyzeImage = async (base64Image: string): Promise<JapieResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: {
        systemInstruction: JAPIE_SYSTEM_PROMPT,
        temperature: 0.2, 
        responseMimeType: "application/json",
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyseer deze technische tekening. Genereer het complete productiedossier als JSON volgens de JAPIE v3.0 specificaties."
          }
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Japie.");

    try {
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanedText) as JapieResponse;
    } catch (e) {
      console.error("Failed to parse JSON", text);
      throw new Error("Japie kon de berekening niet formatteren.");
    }

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const createChatSession = (projectContext: JapieResponse) => {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Inject the specific project data into the chat context
  const contextPrompt = `
    Je bent nu in CHAT MODUS over een specifiek project.
    
    PROJECT CONTEXT (JSON DATA):
    ${JSON.stringify(projectContext)}

    Jouw taak:
    1. Beantwoord vragen van de meubelmaker over DIT specifieke project.
    2. Als hij vraagt "hoeveel meter band?", kijk in de JSON data.
    3. Als hij vraagt "past paneel K1-P01 op plaat 1?", check de platenberekening.
    4. Wees ultra-precies. Je bent een senior calculator.
    5. Antwoord kort en bondig in het Nederlands.
  `;

  chatSession = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: contextPrompt,
    }
  });

  return chatSession;
};

export const sendMessageToJapie = async (message: string): Promise<AsyncIterable<string>> => {
  if (!chatSession) throw new Error("Chat session not initialized");
  
  const result = await chatSession.sendMessageStream({
    message: message
  });

  // Generator function to yield chunks
  async function* streamGenerator() {
    for await (const chunk of result) {
       yield chunk.text;
    }
  }

  return streamGenerator();
};
