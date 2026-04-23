import clipboard from "clipboardy";
import { formatActionResult } from "../utils/responseFormatter.js";

const MAX_CLIPBOARD_TEXT = 500;

export const clipboardCopy = async (text) => {
  if (!text || typeof text !== "string") {
    return formatActionResult({
      success: false,
      action: "clipboard_copy",
      error: "Text is required.",
    });
  }

  if (text.length > MAX_CLIPBOARD_TEXT) {
    return formatActionResult({
      success: false,
      action: "clipboard_copy",
      error: `Text too long. Max ${MAX_CLIPBOARD_TEXT} characters.`,
    });
  }

  await clipboard.write(text);
  return formatActionResult({
    success: true,
    action: "clipboard_copy",
    data: { textLength: text.length },
    message: "Text copied to clipboard.",
  });
};
