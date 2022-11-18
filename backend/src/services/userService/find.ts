import User from "../../models/userModel";

export const findRegisteredUser = async (
  username: string,
  email: string = ""
) => {
  if (await User.query().findOne("username", username)) {
    return "username";
  }
  if (await User.query().findOne("email", email)) {
    return "email";
  }
};

export const findUserByUsername = async (username: string) => {
  return await User.query().findOne("username", username);
};
