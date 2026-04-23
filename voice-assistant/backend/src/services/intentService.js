import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { askGeminiForIntent } from "../providers/geminiProvider.js";
import { repairAndParseJson } from "../utils/jsonRepair.js";

const ALLOWED_ACTIONS = new Set([
  "open_website",
  "google_search",
  "get_time",
  "clipboard_copy",
  "system_info",
  "none",
]);

const safeUnknownResponse = {
  intent: "unknown",
  action: "none",
  params: {},
  confidence: 0,
  responseText: "I cannot perform that request safely.",
};

const normalizeIntent = (raw) => {
  if (!raw || typeof raw !== "object") return safeUnknownResponse;

  const normalized = {
    intent: typeof raw.intent === "string" ? raw.intent : "unknown",
    action: typeof raw.action === "string" ? raw.action : "none",
    params: typeof raw.params === "object" && raw.params ? raw.params : {},
    confidence:
      typeof raw.confidence === "number"
        ? Math.min(Math.max(raw.confidence, 0), 1)
        : 0,
    responseText:
      typeof raw.responseText === "string"
        ? raw.responseText
        : "I am not fully sure what you meant.",
  };

  if (!ALLOWED_ACTIONS.has(normalized.action)) return safeUnknownResponse;
  return normalized;
};

export const detectIntent = async (text) => {
  try {
    const aiRawText = await askGeminiForIntent(text);
    logger.info("Gemini raw output", { aiRawText });

    const parsed = repairAndParseJson(aiRawText);
    const intentData = normalizeIntent(parsed);

    if (intentData.confidence < env.confidenceThreshold) {
      return {
        ...intentData,
        action: "none",
        responseText:
          "I need a bit more detail before I do anything. Please rephrase your request.",
      };
    }

    return intentData;
  } catch (error) {
    logger.error("Intent detection failed", { error: error.message });
    return {
      ...safeUnknownResponse,
      responseText: "I could not process that request right now.",
    };
  }
};
