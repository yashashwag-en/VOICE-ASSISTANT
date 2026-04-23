import { logger } from "../config/logger.js";
import { detectIntent } from "../services/intentService.js";
import { executeSafeAction } from "../services/actionExecutor.js";
import { broadcastEvent } from "../websocket/socketServer.js";

export const handleCommand = async (req, res, next) => {
  try {
    const { text } = req.body;
    logger.info("Incoming command", { text });
    broadcastEvent("command_received", { text });

    const intent = await detectIntent(text);
    logger.info("Intent output", intent);
    broadcastEvent("intent_detected", intent);

    const actionResult = await executeSafeAction(intent);
    logger.info("Action result", actionResult);
    broadcastEvent("action_result", actionResult);

    return res.json({
      ok: true,
      text,
      intent,
      actionResult,
    });
  } catch (error) {
    return next(error);
  }
};
