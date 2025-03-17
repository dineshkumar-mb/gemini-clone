import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
const API_KEY = "AIzaSyDz82LSpgcJsl4e4Vz5dOLx6ZeX2lQs_O8"; // Replace with your actual API key
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

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

/**
 * Sends a prompt to the Gemini API and handles streaming responses.
 *
 * @param {string} prompt - The user's input prompt.
 * @param {function} onChunkReceived - Callback function to handle each response chunk.
 * @returns {Promise<string>} - Promise resolving to "Stream complete" or an error message.
 */

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



// import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// const apiKey = "AIzaSyDz82LSpgcJsl4e4Vz5dOLx6ZeX2lQs_O8"; 
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function runChat(prompt) {
//   const chat = model.startChat({
//     generationConfig,
//     safetySettings,
//     history: [
//     ],
//   });

//   const result = await chat.sendMessage(prompt);
//   const response = result.response;
//   console.log(response.text());
//   return response.text();

// }

// export default runChat;



