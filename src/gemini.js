import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY || "YOUR_DEFAULT_API_KEY"; 
const MODEL_NAME = "gemini-2.0-flash";

const GENERATION_CONFIG = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

async function runChat(prompt, onChunkReceived) {
  try {
    const chat = model.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      history: [],
    });

    const result = await chat.sendMessageStream(prompt);

    for await (const chunk of result.stream) {
      const response = chunk.text();
      if (onChunkReceived) {
        onChunkReceived(response);
      }
    }

    return "Stream complete";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "An error occurred while processing your request.";
  }
}

export default runChat;
