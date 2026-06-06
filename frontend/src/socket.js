import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env
    .VITE_SOCKET_URL;

const createSocket = () =>
  io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });

const socket =
  typeof window !== "undefined"
    ? window.__whatsapp_socket ||
      (window.__whatsapp_socket =
        createSocket())
    : createSocket();

export default socket;