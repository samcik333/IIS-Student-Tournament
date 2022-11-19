import User from "../../models/userModel";

export default async function registerUserService(
  name: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
  role: "admin" | "register" = "register"
) {
  const user = await User.query().insert({
    name,
    lastname,
    username,
    email: email.toLowerCase(),
    password,
    role,
  });
  return user;
}
