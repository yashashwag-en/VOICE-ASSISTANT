import { getBackendUrl } from "./api";

export const createStatusSocket = (onMessage, onOpen, onClose) => {
  const baseUrl = getBackendUrl().replace(/^http/, "ws");
  const socket = new WebSocket(`${baseUrl}/ws`);

  socket.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch {
      // Ignore bad event frames
    }
  };
  socket.onopen = onOpen;
  socket.onclose = onClose;
  socket.onerror = onClose;

  return socket;
};
