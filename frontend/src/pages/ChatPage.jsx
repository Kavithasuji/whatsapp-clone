
import { useEffect, useState } from "react";

import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import socket from "../socket";
import { getUsers }
    from "../services/userService";
import {
    getConversation,
}
    from "../services/conversationService";
import {
    sendMessage,
    markDelivered,
    markRead,
    getMessages,
}
    from "../services/messageService";

export default function ChatPage() {

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [
        selectedUser,
        setSelectedUser,
    ] = useState(null);

    const [
        conversation,
        setConversation,
    ] = useState(null);

    const [messages, setMessages] =
        useState([]);

    const [page, setPage] =
        useState(1);

    const [hasMore, setHasMore] =
        useState(true);

    const [loadingMore, setLoadingMore] =
        useState(false);

    const [isChatOpen, setIsChatOpen] =
        useState(false);

    const sortUsersByRecentConversation =
        (users) => {
            return [...users].sort(
                (a, b) => {
                    const aTime = a.lastMessageAt
                        ? new Date(a.lastMessageAt).getTime()
                        : 0;
                    const bTime = b.lastMessageAt
                        ? new Date(b.lastMessageAt).getTime()
                        : 0;

                    return bTime - aTime;
                }
            );
        };

    // ----------------------------------
    // Initial Load
    // ----------------------------------

    useEffect(() => {

        fetchUsers();

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "user"
                )
            );

        const currentUserId =
            currentUser?.id ||
            currentUser?._id;

        const registerSocketUser = () => {
            if (currentUserId) {
                socket.emit(
                    "user_connected",
                    currentUserId
                );

            }
        };

        socket.on(
            "connect",
            registerSocketUser
        );

        if (socket.connected) {
            registerSocketUser();
        }

        return () => {
            socket.off(
                "connect",
                registerSocketUser
            );
        };

    }, []);

    // ----------------------------------
    // Auto Load Conversation
    // ----------------------------------

    useEffect(() => {

        if (!selectedUser)
            return;

        loadConversation(
            selectedUser
        );

    }, [selectedUser]);

    // ----------------------------------
    // Socket Listener
    // ----------------------------------

    // Debug: log socket lifecycle events to diagnose frequent reconnections
    useEffect(() => {
        const onConnect = () =>
            console.log("[socket] connect", new Date().toISOString(), socket.id);
        const onDisconnect = (reason) =>
            console.log("[socket] disconnect", new Date().toISOString(), reason);
        const onConnectError = (err) =>
            console.log("[socket] connect_error", new Date().toISOString(), err);
        const onReconnectAttempt = (attempt) =>
            console.log("[socket] reconnect_attempt", new Date().toISOString(), attempt);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.on("reconnect_attempt", onReconnectAttempt);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.off("reconnect_attempt", onReconnectAttempt);
        };
    }, []);

    useEffect(() => {

        const handleNewMessage =
            async (message) => {

                const isCurrentChat =
                    String(
                        message.senderId
                    ) ===
                    String(
                        selectedUser?._id
                    );

                if (isCurrentChat) {
                    setMessages(
                        (prev) => [
                            ...prev,
                            {
                                ...message,
                                status: "delivered",
                            },
                        ]
                    );

                    updateUserPreview(
                        message.senderId,
                        message.text,
                        message.createdAt,
                        0,
                        0
                    );

                    try {

                        await markDelivered(
                            message.conversationId
                        );
                    } catch (error) {
                        console.log(error);
                    }

                    try {
                        await markRead(
                            message.conversationId
                        );

                        setMessages((prev) =>
                            prev.map((msg) =>
                                String(msg._id) ===
                                    String(message._id)
                                    ? {
                                        ...msg,
                                        status: "read",
                                    }
                                    : msg
                            )
                        );
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    updateUserPreview(
                        message.senderId,
                        message.text,
                        message.createdAt,
                        1
                    );
                }
            };

        socket.on(
            "new_message",
            handleNewMessage
        );

        return () => {

            socket.off(
                "new_message",
                handleNewMessage
            );

        };

    }, [selectedUser]);




    useEffect(() => {

        const handleRead =
            ({ messageId }) => {

                setMessages(
                    (prev) =>
                        prev.map(
                            (msg) =>
                                String(
                                    msg._id
                                ) ===
                                    String(
                                        messageId
                                    )
                                    ? {
                                        ...msg,
                                        status:
                                            "read",
                                    }
                                    : msg
                        )
                );
            };

        socket.on(
            "message_read",
            handleRead
        );

        return () => {

            socket.off(
                "message_read",
                handleRead
            );
        };

    }, []);
    useEffect(() => {

        const handleDelivered =
            ({ messageId }) => {

                setMessages(
                    (prev) =>
                        prev.map(
                            (msg) =>
                                String(
                                    msg._id
                                ) ===
                                    String(
                                        messageId
                                    )
                                    ? {
                                        ...msg,
                                        status:
                                            "delivered",
                                    }
                                    : msg
                        )
                );
            };

        socket.on(
            "message_delivered",
            handleDelivered
        );

        return () => {

            socket.off(
                "message_delivered",
                handleDelivered
            );
        };

    }, []);

    useEffect(() => {
        const setUserOnlineState =
            (userId, online) => {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        String(user._id) ===
                            String(userId)
                            ? {
                                ...user,
                                online,
                            }
                            : user
                    )
                );

                setSelectedUser((prev) => {
                    if (
                        prev &&
                        String(prev._id) ===
                        String(userId)
                    ) {
                        return {
                            ...prev,
                            online,
                        };
                    }
                    return prev;
                });
            };

        const handleUserOnline = ({ userId }) => {
            setUserOnlineState(userId, true);
        };

        const handleUserOffline = ({ userId }) => {
            setUserOnlineState(userId, false);
        };

        socket.on(
            "user_online",
            handleUserOnline
        );

        socket.on(
            "user_offline",
            handleUserOffline
        );

        return () => {
            socket.off(
                "user_online",
                handleUserOnline
            );
            socket.off(
                "user_offline",
                handleUserOffline
            );
        };
    }, []);
    // ----------------------------------
    // Users
    // ----------------------------------
    // ----------------------------------

    const fetchUsers =
        async () => {

            try {

                const response =
                    await getUsers();

                const usersData =
                    response.users || [];

                setUsers(
                    sortUsersByRecentConversation(
                        usersData
                    )
                );

                if (
                    usersData.length > 0 &&
                    !selectedUser
                ) {

                    setSelectedUser(
                        usersData[0]
                    );
                } else if (
                    selectedUser
                ) {
                    const updatedSelected =
                        usersData.find(
                            (user) =>
                                String(
                                    user._id
                                ) ===
                                String(
                                    selectedUser._id
                                )
                        );

                    if (updatedSelected) {
                        setSelectedUser(
                            updatedSelected
                        );
                    }
                }

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        };

    // ----------------------------------
    // Conversation
    // ----------------------------------

    const updateUserPreview = (
        userId,
        lastMessage,
        lastMessageAt,
        unreadDelta = 0,
        unreadCount = null
    ) => {
        setUsers((prevUsers) => {
            let hasChanged = false;

            const updatedUsers = prevUsers.map((user) => {
                if (String(user._id) !== String(userId)) {
                    return user;
                }

                const nextUnreadCount =
                    unreadCount !== null
                        ? unreadCount
                        : Math.max(
                            0,
                            (user.unreadCount || 0) +
                            unreadDelta
                        );

                const updatedUser = {
                    ...user,
                    lastMessage,
                    lastMessageAt,
                    unreadCount: nextUnreadCount,
                };

                if (
                    user.lastMessage !== updatedUser.lastMessage ||
                    user.lastMessageAt !== updatedUser.lastMessageAt ||
                    (user.unreadCount || 0) !== updatedUser.unreadCount
                ) {
                    hasChanged = true;
                }

                return updatedUser;
            });

            if (!hasChanged) {
                return prevUsers;
            }

            return sortUsersByRecentConversation(updatedUsers);
        });

        setSelectedUser((prev) => {
            if (!prev || String(prev._id) !== String(userId)) return prev;

            const nextUnreadCount =
                unreadCount !== null ? unreadCount : prev.unreadCount;

            const lastMessageUnchanged = prev.lastMessage === lastMessage;
            const lastMessageAtUnchanged = String(prev.lastMessageAt) === String(lastMessageAt);
            const unreadUnchanged = (prev.unreadCount || 0) === (nextUnreadCount || 0);

            if (lastMessageUnchanged && lastMessageAtUnchanged && unreadUnchanged) {
                return prev;
            }

            return {
                ...prev,
                lastMessage,
                lastMessageAt,
                unreadCount: nextUnreadCount,
            };
        });
    };

    const loadConversation =
        async (user) => {

            try {

                const response =
                    await getConversation(
                        user._id
                    );

                setConversation(
                    response.conversation
                );

                setPage(1);

                setMessages(
                    response.messages || []
                );

                setHasMore(
                    response.hasMore ?? false
                );

                if (
                    response.conversation?._id
                ) {

                    await markDelivered(
                        response.conversation._id
                    );

                    await markRead(
                        response.conversation._id
                    );

                    updateUserPreview(
                        user._id,
                        response.conversation.lastMessage,
                        response.conversation.lastMessageAt,
                        0,
                        0
                    );
                }

            } catch (error) {

                console.log(error);

            }
        };

    // ----------------------------------
    // Select User
    // ----------------------------------

    const loadOlderMessages =
        async () => {

            if (
                !conversation?._id ||
                !hasMore ||
                loadingMore
            ) {
                return;
            }

            try {

                setLoadingMore(true);

                const nextPage =
                    page + 1;

                const response =
                    await getMessages(
                        conversation._id,
                        nextPage,
                        1
                    );

                setMessages(
                    (prev) => [
                        ...response.messages,
                        ...prev,
                    ]
                );

                setPage(nextPage);

                setHasMore(
                    response.hasMore
                );

            } catch (error) {

                console.log(error);

            } finally {

                setLoadingMore(
                    false
                );

            }
        };

    const handleSelectUser =
        (user) => {

            setSelectedUser((prev) =>
                prev && String(prev._id) === String(user._id)
                    ? prev
                    : user
            );

            setIsChatOpen(true);
        };

    const handleBack = () => {
        setIsChatOpen(false);
    };

    // ----------------------------------
    // Send Message
    // ----------------------------------
    const [sentTrigger, setSentTrigger] = useState(0);

    const handleSendMessage = async (text) => {
        if (!selectedUser) return;

        try {
            const response = await sendMessage({
                receiverId: selectedUser._id,
                text,
            });

            setMessages((prev) => [...prev, response.message]);
            setSentTrigger((prev) => prev + 1); // 👈 increment on every send

            if (response.conversation) {
                setConversation(response.conversation);
                updateUserPreview(
                    selectedUser._id,
                    response.conversation.lastMessage,
                    response.conversation.lastMessageAt,
                    0,
                    0
                );
            }
        } catch (error) {
            console.log(error);
        }
    };


    // ----------------------------------
    // Loading
    // ----------------------------------

    if (loading) {

        return (
            <div
                className="
          h-screen
          flex
          items-center
          justify-center
        "
            >
                Loading...
            </div>
        );
    }

    // ----------------------------------
    // UI
    // ----------------------------------

    return (
        <div className="w-screen overflow-hidden bg-white flex" style={{ height: '100dvh' }}>

            {/* SIDEBAR - Hidden on mobile when chat open */}
            <div
                className={`
                    ${isChatOpen ? "hidden" : "flex"}
                    md:flex
                    flex-col
                    w-full
                    md:w-[380px]
                    h-screen
                    md:h-screen
                    flex-shrink-0
                    border-r border-gray-200
                `}
            >
                <Sidebar
                    users={users}
                    selectedUser={selectedUser}
                    onSelectUser={handleSelectUser}
                />
            </div>

            {/* CHAT AREA - Full screen on mobile */}
            <div className={`
    ${isChatOpen ? "flex" : "hidden"}
    md:flex
    flex-col
    w-full
    md:flex-1
    min-h-0
`}
                style={{ height: '100dvh' }}
            >
                {/* Chat Header */}
                <div className="h-16 flex-shrink-0 border-b border-gray-200">
                    <ChatHeader
                        selectedUser={selectedUser}
                        onBack={handleBack}
                    />
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-hidden min-h-0">
                    <MessageList
                        conversation={conversation}
                        messages={messages}
                        hasMore={hasMore}
                        loadOlderMessages={loadOlderMessages}
                        sentTrigger={sentTrigger}

                    />
                </div>

                {/* Message Input */}
                <div className="h-auto flex-shrink-0 border-t border-gray-200 bg-white">
                    <MessageInput
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>

        </div>
    );
}