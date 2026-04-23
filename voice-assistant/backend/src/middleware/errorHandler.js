import { logger } from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message, path: req.path });
  res.status(500).json({ error: "Internal server error." });
};
