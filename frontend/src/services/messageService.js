import api from "./api";

export const sendMessage =
  async (payload) => {

    const response =
      await api.post(
        "/messages",
        payload
      );

    return response.data;
};

export const markRead =
  async (
    conversationId
  ) => {

    const response =
      await api.put(
        `/messages/read/${conversationId}`
      );

    return response.data;
};

export const markDelivered =
  async (
    conversationId
  ) => {

    const response =
      await api.put(
        `/messages/delivered/${conversationId}`
      );

    return response.data;
};

export const getMessages =
  async (
    conversationId,
    page = 1,
    limit = 20
  ) => {
    const response =
      await api.get(
        `/messages/${conversationId}?page=${page}&limit=${limit}`
      );

    return response.data;
  };