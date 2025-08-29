/*import { io } from 'socket.io-client';

 const productionServer = "ws://xts-pay-server.onrender.com"
 const localServer = "ws://localhost:4000"
 const httpServer = "https://xts-pay-server.onrender.com"
export const socket = io(httpServer, {
   withCredentials: true,
  transports: ["websocket", "polling"], // polling fallback
});

socket.on('connect', () => {
  console.log('WebSocket connected');
});*/

import { io } from "socket.io-client";

const productionServer = "wss://xts-pay-server.onrender.com"; // ✅ secure websocket
const localServer = "ws://localhost:4000"; // local can stay ws
const httpServer = "https://xts-pay-server.onrender.com"; // ✅ correct

export const socket = io(httpServer, {
  withCredentials: true,
  transports: ["websocket"], // 🚀 force websocket only
});

socket.on("connect", () => {
  console.log("WebSocket connected ✅");
});
