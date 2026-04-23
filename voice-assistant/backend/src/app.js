import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import healthRoutes from "./routes/healthRoutes.js";
import commandRoutes from "./routes/commandRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  const allowedOrigins = (() => {
    const set = new Set([env.frontendOrigin]);
    try {
      const parsed = new URL(env.frontendOrigin);
      if (parsed.hostname === "localhost") {
        set.add(`${parsed.protocol}//127.0.0.1${parsed.port ? `:${parsed.port}` : ""}`);
      } else if (parsed.hostname === "127.0.0.1") {
        set.add(`${parsed.protocol}//localhost${parsed.port ? `:${parsed.port}` : ""}`);
      }
    } catch {
      // Ignore invalid env.frontendOrigin; cors will reject unknown origins.
    }
    return set;
  })();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.has(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST"],
    })
  );
  app.use(express.json({ limit: "50kb" }));

  app.use((req, _res, next) => {
    logger.info("Request", { method: req.method, path: req.path });
    next();
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/command", commandRoutes);
  app.use(errorHandler);

  return app;
};
