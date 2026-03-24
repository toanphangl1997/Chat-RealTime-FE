import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3197";

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], 
  autoConnect: false, 
});