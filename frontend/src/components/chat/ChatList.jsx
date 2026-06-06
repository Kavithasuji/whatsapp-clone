import ChatItem from "./ChatItem";

export default function ChatList({
    users,
    selectedUser,
    onSelectUser,
}) {

    if (!users?.length) {
        return (
            <div
                className="
          flex
          items-center
          justify-center
          h-full
          text-gray-500
        "
            >
                No users found
            </div>
        );
    }

    return (
        <div
            className="
        flex-1
        overflow-y-auto
        bg-white
      "
        >
            {users.map((user) => (

                <ChatItem
                    key={user._id}
                    chat={{
                        id: user._id,
                        name: user.username,
                        profilePicture:
                            user.profilePicture,
                        online: user.online || false,
                        lastMessage: user.lastMessage || "",
                        unread: user.unreadCount || 0,
                        time: user.lastMessageAt
                            ? new Date(
                                user.lastMessageAt
                            ).toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )
                            : "",
                    }}
                    active={
                        selectedUser?._id ===
                        user._id
                    }
                    onClick={() =>
                        onSelectUser(user)
                    }
                />

            ))}
        </div>
    );
}