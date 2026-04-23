import open from "open";
import { formatActionResult } from "../utils/responseFormatter.js";

const isSafeHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const openWebsite = async (url) => {
  if (!url || typeof url !== "string" || !isSafeHttpUrl(url)) {
    return formatActionResult({
      success: false,
      action: "open_website",
      error: "Only valid http/https URLs are allowed.",
    });
  }

  await open(url);
  return formatActionResult({
    success: true,
    action: "open_website",
    data: { url },
    message: `Opened ${url}`,
  });
};

export const googleSearch = async (query) => {
  if (!query || typeof query !== "string") {
    return formatActionResult({
      success: false,
      action: "google_search",
      error: "Search query is required.",
    });
  }

  const encoded = encodeURIComponent(query.trim());
  const searchUrl = `https://www.google.com/search?q=${encoded}`;
  await open(searchUrl);
  return formatActionResult({
    success: true,
    action: "google_search",
    data: { query, searchUrl },
    message: `Searching Google for "${query}"`,
  });
};
