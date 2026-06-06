import api from "./api";

export const getUsers =
  async () => {

    const response =
      await api.get("/users");

    return response.data;
};


export const updateProfile =
  async (
    profilePicture
  ) => {

    const response =
      await api.put(
        "/users/profile",
        {
          profilePicture,
        }
      );

    return response.data;
};