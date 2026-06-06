
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

        console.log(
            "Current User:",
            currentUser
        );

        socket.on(
            "connect",
            () => {

                console.log(
                    "Socket Connected:",
                    socket.id
                );

                if (
                    currentUser?.id
                ) {

                    socket.emit(
                        "user_connected",
                        currentUser.id
                    );

                    console.log(
                        "User Registered:",
                        currentUser.id
                    );
                }
            }
        );

        return () => {

            socket.off(
                "connect"
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

        setSelectedUser((prev) =>
            prev && String(prev._id) === String(userId)
                ? {
                      ...prev,
                      lastMessage,
                      lastMessageAt,
                      unreadCount:
                          unreadCount !== null
                              ? unreadCount
                              : prev.unreadCount,
                  }
                : prev
        );
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

                setMessages(
                    response.messages || []
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

    const handleSelectUser =
        (user) => {

            setSelectedUser((prev) =>
                prev && String(prev._id) === String(user._id)
                    ? prev
                    : user
            );
        };

    // ----------------------------------
    // Send Message
    // ----------------------------------

    const handleSendMessage =
        async (text) => {

            if (!selectedUser)
                return;

            try {

                const response =
                    await sendMessage({
                        receiverId:
                            selectedUser._id,
                        text,
                    });

                setMessages(
                    (prev) => [
                        ...prev,
                        response.message,
                    ]
                );

                if (
                    response.conversation
                ) {

                    setConversation(
                        response.conversation
                    );

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
        <div className="h-screen flex">

            <Sidebar
                users={users}
                selectedUser={
                    selectedUser
                }
                onSelectUser={
                    handleSelectUser
                }
            />

            <div className="flex-1 flex flex-col">

                <ChatHeader
                    selectedUser={
                        selectedUser
                    }
                />

                <MessageList
                    conversation={
                        conversation
                    }
                    messages={messages}
                />

                <MessageInput
                    onSendMessage={
                        handleSendMessage
                    }
                />

            </div>

        </div>
    );
}