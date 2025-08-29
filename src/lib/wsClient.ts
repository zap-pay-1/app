import { io } from 'socket.io-client';

 const productionServer = "ws://xts-pay-server.onrender.com"
 const localServer = "ws://localhost:4000"
export const socket = io(productionServer);

socket.on('connect', () => {
  console.log('WebSocket connected');
});