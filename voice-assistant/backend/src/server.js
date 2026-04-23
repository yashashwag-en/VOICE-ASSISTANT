import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { setupWebSocket } from "./websocket/socketServer.js";

const app = createApp();
const server = http.createServer(app);

setupWebSocket(server);

server.listen(env.port, env.host, () => {
  logger.info("Backend started", {
    url: `http://${env.host}:${env.port}`,
    frontendOrigin: env.frontendOrigin,
  });
});
