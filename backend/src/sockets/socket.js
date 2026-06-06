// Real-time messaging
// Socket.IO
// Online/Offline status
// Read receipts

import { Server } from "socket.io";

let io;

const onlineUsers = new Map();

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket Connected:", socket.id);

        socket.on("user_connected", (userId) => {
            const normalizedUserId = String(userId);

            console.log(
                "User Online:",
                normalizedUserId,
                "Socket:",
                socket.id
            );

            const existingSockets =
                onlineUsers.get(normalizedUserId);

            if (existingSockets) {
                existingSockets.add(socket.id);
            } else {
                onlineUsers.set(
                    normalizedUserId,
                    new Set([socket.id])
                );
                io.emit("user_online", {
                    userId: normalizedUserId,
                });
            }
        });

        socket.on("disconnect", () => {
            let removedUserId = null;

            for (const [userId, socketIds] of onlineUsers.entries()) {
                if (socketIds.has(socket.id)) {
                    socketIds.delete(socket.id);

                    if (socketIds.size === 0) {
                        onlineUsers.delete(userId);
                        removedUserId = userId;

                        console.log(
                            "User Offline:",
                            userId
                        );
                    }

                    break;
                }
            }

            if (removedUserId) {
                io.emit("user_offline", {
                    userId: removedUserId,
                });
            }

            console.log("Socket Disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO =
    () => io;

export {
    onlineUsers,
};