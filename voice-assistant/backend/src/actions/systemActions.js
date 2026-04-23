import { formatActionResult } from "../utils/responseFormatter.js";
import { getSystemInfo } from "../utils/systemInfo.js";

export const getTime = async () => {
  const currentTime = new Date().toLocaleString();
  return formatActionResult({
    success: true,
    action: "get_time",
    data: { currentTime },
    message: `Local time is ${currentTime}`,
  });
};

export const systemInfo = async () => {
  const info = getSystemInfo();
  return formatActionResult({
    success: true,
    action: "system_info",
    data: info,
    message: "Fetched system information.",
  });
};
