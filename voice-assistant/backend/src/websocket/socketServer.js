import { WebSocketServer } from "ws";
import { logger } from "../config/logger.js";

let wss;

export const setupWebSocket = (httpServer) => {
  wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (socket) => {
    logger.info("WebSocket client connected");
    socket.send(
      JSON.stringify({ type: "status", payload: { connected: true, ts: Date.now() } })
    );
  });
};

export const broadcastEvent = (type, payload) => {
  if (!wss) return;

  const message = JSON.stringify({ type, payload, ts: Date.now() });
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(message);
  }
};
