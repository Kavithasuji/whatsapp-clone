import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";


export const getConversation = async (
  req,
  res
) => {
  try {
    const senderId =
      String(req.user.id);

    const receiverId =
      String(req.params.receiverId);

    // Self Chat
    if (senderId === receiverId) {
      return res.status(200).json({
        success: true,
        conversation: null,
        messages: [],
      });
    }

    const conversation =
      await Conversation.findOne({
        participants: {
          $all: [
            senderId,
            receiverId,
          ],
        },
      });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        conversation: null,
        messages: [],
      });
    }

   const limit =
  Number(req.query.limit) || 20;

const total =
  await Message.countDocuments({
    conversationId:
      conversation._id,
  });

const msgs =
  await Message.find({
    conversationId:
      conversation._id,
  })
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .lean();

const messages =
  msgs.reverse();

const hasMore =
  total > limit;

return res.status(200).json({
  success: true,
  conversation,
  messages,
  hasMore,
});
  } catch (error) {
    console.error(
      "Get Conversation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};
export const getConversations =
  async (req, res) => {
    try {

      const currentUserId =
        req.user.id;

      const conversations =
        await Conversation.find({
          participants:
            currentUserId,
        })
          .sort({
            lastMessageAt: -1,
          })
          .lean();

      const result =
        await Promise.all(
          conversations.map(
            async (
              conversation
            ) => {

              const otherUserId =
                conversation.participants.find(
                  (id) =>
                    String(id) !==
                    String(
                      currentUserId
                    )
                );

              const user =
                await User.findById(
                  otherUserId,
                  {
                    password: 0,
                  }
                ).lean();

              return {
                conversationId:
                  conversation._id,

                user,

                lastMessage:
                  conversation.lastMessage,

                lastMessageAt:
                  conversation.lastMessageAt,
              };
            }
          )
        );

      return res.status(200).json({
        success: true,
        conversations:
          result,
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