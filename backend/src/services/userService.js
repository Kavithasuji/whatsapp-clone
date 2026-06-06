import User from "../models/User.js";

export const createUser = async (data) => {
  return await User.create(data);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByEmailOrUsername = async (
  email,
  username
) => {
  return await User.findOne({
    $or: [
      { email },
      { username }
    ]
  });
};

export const updateLastLogin = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      lastLogin: new Date(),
    },
    {
      new: true,
    }
  );
};