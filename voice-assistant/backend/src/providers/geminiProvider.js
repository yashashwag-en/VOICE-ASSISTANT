import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const SYSTEM_PROMPT = `You are an intent parser for a localhost-only voice assistant.
Rules:
1) Return ONLY valid JSON (no markdown).
2) JSON schema:
{
  "intent": "system_control | web | clipboard | info | unknown",
  "action": "open_website | google_search | get_time | clipboard_copy | system_info | none",
  "params": {},
  "confidence": 0.0,
  "responseText": ""
}
3) NEVER output disallowed actions.
4) Unsafe/destructive/admin requests must map to:
{
  "intent":"unknown",
  "action":"none",
  "params":{},
  "confidence":0.0,
  "responseText":"I cannot perform that request safely."
}
5) Keep confidence between 0 and 1.`;

let model;
if (env.geminiApiKey) {
  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export const askGeminiForIntent = async (userText) => {
  if (!model) {
    throw new Error("Gemini API key missing. Set GEMINI_API_KEY in backend .env.");
  }

  const prompt = `${SYSTEM_PROMPT}\n\nUser command: "${userText}"`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
