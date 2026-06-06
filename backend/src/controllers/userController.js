import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { onlineUsers } from "../sockets/socket.js";

export const getUsers = async (
  req,
  res
) => {
  try {

    const currentUserId =
      req.user.id;

    const users =
      await User.find(
        {
          _id: {
            $ne: currentUserId,
          },
        },
        {
          password: 0,
        }
      ).lean();

    const usersWithChatInfo =
      await Promise.all(
        users.map(
          async (user) => {

            const conversation =
              await Conversation.findOne({
                participants: {
                  $all: [
                    currentUserId,
                    user._id,
                  ],
                },
              }).lean();

            let unreadCount = 0;

            if (conversation) {

              unreadCount =
                await Message.countDocuments({
                  conversationId:
                    conversation._id,

                  receiverId:
                    currentUserId,

                  status: {
                    $ne: "read",
                  },
                });
            }

            return {
              ...user,

              online: onlineUsers.has(
                String(user._id)
              ),

              lastMessage:
                conversation
                  ?.lastMessage || "",

              lastMessageAt:
                conversation
                  ?.lastMessageAt || null,

              unreadCount,
            };
          }
        )
      );

    usersWithChatInfo.sort(
      (a, b) =>
        new Date(
          b.lastMessageAt || 0
        ) -
        new Date(
          a.lastMessageAt || 0
        )
    );

    return res.status(200).json({
      success: true,
      users:
        usersWithChatInfo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });

  }
};
export const updateProfile =
  async (req, res) => {

    try {

      const user =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            profilePicture:
              req.body.profilePicture,
          },
          {
            new: true,
          }
        );

      return res.json({
        success: true,
        user,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
      });

    }
};