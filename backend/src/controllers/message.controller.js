


import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

import {
  onlineUsers,
  getIO,
} from "../sockets/socket.js";

export const sendMessage = async (
  req,
  res
) => {
  try {

    const senderId =
      req.user.id;

    const {
      receiverId,
      text,
    } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message:
          "Receiver is required",
      });
    }

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Message is required",
      });
    }

    let conversation =
      await Conversation.findOne({
        participants: {
          $all: [
            senderId,
            receiverId,
          ],
        },
      });

    if (!conversation) {

      conversation =
        await Conversation.create({
          participants: [
            senderId,
            receiverId,
          ],
          lastMessage: text,
          lastMessageAt:
            new Date(),
        });
    }

    const message =
      await Message.create({
        conversationId:
          conversation._id,
        senderId,
        receiverId,
        text,
        status: "sent",
      });

    conversation.lastMessage =
      text;

    conversation.lastMessageAt =
      new Date();

    await conversation.save();

    const receiverSocketIds =
      onlineUsers.get(String(receiverId));

    if (receiverSocketIds?.size) {
      // mark message as delivered since recipient is online (device reached)
      message.status = "delivered";
      await message.save();

      // notify recipient about the new message
      for (const socketId of receiverSocketIds) {
        getIO()
          .to(socketId)
          .emit("new_message", message);
      }

      // notify sender that the message was delivered
      const senderSocketIds =
        onlineUsers.get(String(senderId));

      if (senderSocketIds?.size) {
        for (const socketId of senderSocketIds) {
          getIO()
            .to(socketId)
            .emit(
              "message_delivered",
              { messageId: message._id }
            );
        }
      }

    
    }

    return res.status(201).json({
      success: true,
      message,
      conversation,
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

export const getMessages =
  async (req, res) => {

    try {

      const conversationId = req.params.conversationId;

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Number(req.query.limit) || 20);

      const total = await Message.countDocuments({ conversationId });

      // Fetch newest messages first for pagination, then reverse to return oldest->newest
      const msgs = await Message.find({ conversationId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const messages = msgs.reverse();

      const hasMore = page * limit < total;

      return res.status(200).json({
        success: true,
        messages,
        hasMore,
        page,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });
    }
  };

export const markDelivered =
  async (req, res) => {

    try {

      const conversationId =
        req.params.conversationId;

      const messages =
        await Message.find({
          conversationId,
          receiverId:
            req.user.id,
          status: "sent",
        });

      await Message.updateMany(
        {
          conversationId,
          receiverId:
            req.user.id,
          status: "sent",
        },
        {
          status:
            "delivered",
        }
      );

      messages.forEach((message) => {
        const senderSocketIds =
          onlineUsers.get(
            String(message.senderId)
          );

        if (senderSocketIds?.size) {
          for (const socketId of senderSocketIds) {
            getIO()
              .to(socketId)
              .emit("message_delivered", {
                messageId: message._id,
              });
          }
        }
      });

      return res.status(200).json({
        success: true,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });
    }
  };

export const markRead =
  async (req, res) => {

    try {

      const conversationId =
        req.params.conversationId;

      const messages =
        await Message.find({
          conversationId,
          receiverId:
            req.user.id,
          status: {
            $in: [
              "sent",
              "delivered",
            ],
          },
        });

      await Message.updateMany(
        {
          conversationId,
          receiverId:
            req.user.id,
          status: {
            $in: [
              "sent",
              "delivered",
            ],
          },
        },
        {
          status: "read",
        }
      );

      messages.forEach((message) => {
        const senderSocketIds =
          onlineUsers.get(
            String(message.senderId)
          );

        if (senderSocketIds?.size) {
          for (const socketId of senderSocketIds) {
            getIO()
              .to(socketId)
              .emit("message_read", {
                messageId: message._id,
              });
          }
        }
      });

      return res.status(200).json({
        success: true,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });
    }
  };