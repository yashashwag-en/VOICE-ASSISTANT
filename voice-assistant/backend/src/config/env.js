import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  host: "127.0.0.1",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  confidenceThreshold: Number(process.env.CONFIDENCE_THRESHOLD || 0.7),
  optionalPythonRunnerUrl:
    process.env.OPTIONAL_PYTHON_RUNNER_URL || "http://127.0.0.1:8001",
};
