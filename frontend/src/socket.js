import { io } from "socket.io-client";

const createSocket = () =>
  io("http://localhost:5000", {
    withCredentials: true,
    transports: ["websocket"],
    // keep default reconnection behavior; HMR can create duplicates
  });

// Persist socket instance across Vite HMR reloads to avoid multiple connections
const socket =
  typeof window !== "undefined"
    ? window.__whatsapp_socket || (window.__whatsapp_socket = createSocket())
    : createSocket();

export default socket;