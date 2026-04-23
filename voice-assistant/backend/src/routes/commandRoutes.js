import { Router } from "express";
import { handleCommand } from "../controllers/commandController.js";
import { validateCommand } from "../middleware/validateCommand.js";
import { commandRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", commandRateLimiter, validateCommand, handleCommand);

export default router;
