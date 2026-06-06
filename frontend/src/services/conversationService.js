
import api from "./api";

export const getConversations =
  async () => {
    const response =
      await api.get(
        "/conversations"
      );

    return response.data;
};

export const getConversation =
  async (receiverId) => {
    const response =
      await api.get(
        `/conversations/${receiverId}`
      );

    return response.data;
};