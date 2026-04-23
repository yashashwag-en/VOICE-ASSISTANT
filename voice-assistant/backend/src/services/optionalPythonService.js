import { env } from "../config/env.js";

export const callOptionalPythonRunner = async (action, payload = {}) => {
  try {
    const response = await fetch(`${env.optionalPythonRunnerUrl}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      return { available: false, message: "Runner responded with non-200 status." };
    }

    const data = await response.json();
    return { available: true, data };
  } catch {
    return { available: false, message: "Optional Python runner is not running." };
  }
};
