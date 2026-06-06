// Real-time messaging
// Socket.IO
// Online/Offline status
// Read receipts

import { Server } from "socket.io";

let io;

const onlineUsers =
    new Map();

export const initSocket =
    (server) => {

        io = new Server(server, {
  cors: {
    origin: "*",
    methods: [
      "GET",
      "POST",
    ],
    credentials: true,
  },
});

        io.on(
            "connection",
            (socket) => {

                console.log(
                    "Socket Connected:",
                    socket.id
                );

                socket.on(
                    "user_connected",
                    (userId) => {

                        console.log(
                            "User Online:",
                            userId,
                            "Socket:",
                            socket.id
                        );

                        onlineUsers.set(
                            userId,
                            socket.id
                        );

                        io.emit(
                            "user_online",
                            {
                                userId,
                            }
                        );
                    }
                );

                socket.on(
                    "disconnect",
                    () => {

                        let removedUserId = null;

                        for (const [
                            userId,
                            socketId,
                        ] of onlineUsers.entries()) {

                            if (
                                socketId ===
                                socket.id
                            ) {

                                onlineUsers.delete(
                                    userId
                                );
                                removedUserId = userId;

                                console.log(
                                    "User Offline:",
                                    userId
                                );

                                break;
                            }
                        }

                        if (removedUserId) {
                            io.emit(
                                "user_offline",
                                {
                                    userId:
                                        removedUserId,
                                }
                            );
                        }

                        console.log(
                            "Socket Disconnected:",
                            socket.id
                        );
                    }
                );
            }
        );

        return io;
    };

export const getIO =
    () => io;

export {
    onlineUsers,
};