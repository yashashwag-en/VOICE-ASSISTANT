import { clipboardCopy } from "./clipboardActions.js";
import { getTime, systemInfo } from "./systemActions.js";
import { googleSearch, openWebsite } from "./webActions.js";
import { formatActionResult } from "../utils/responseFormatter.js";

const handlers = {
  open_website: (params) => openWebsite(params?.url),
  google_search: (params) => googleSearch(params?.query),
  get_time: () => getTime(),
  clipboard_copy: (params) => clipboardCopy(params?.text),
  system_info: () => systemInfo(),
};

export const executeActionByName = async (action, params = {}) => {
  const handler = handlers[action];
  if (!handler) {
    return formatActionResult({
      success: false,
      action: action || "none",
      error: "Action not allowed.",
    });
  }
  return handler(params);
};
