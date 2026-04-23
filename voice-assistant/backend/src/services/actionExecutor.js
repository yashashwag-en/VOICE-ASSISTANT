import { executeActionByName } from "../actions/index.js";
import { formatActionResult } from "../utils/responseFormatter.js";

export const executeSafeAction = async (intentData) => {
  if (!intentData || intentData.action === "none") {
    return formatActionResult({
      success: false,
      action: "none",
      message: intentData?.responseText || "No action executed.",
      error: "",
    });
  }

  try {
    return await executeActionByName(intentData.action, intentData.params);
  } catch (error) {
    return formatActionResult({
      success: false,
      action: intentData.action,
      error: error.message || "Action execution failed.",
    });
  }
};
