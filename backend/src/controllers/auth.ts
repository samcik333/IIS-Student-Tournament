import { Request, Response } from "express";
import {
  findRegisteredUser,
  findUserByUsername,
} from "../services/userService/find";
import registerUserService from "../services/registerService/registerUser";
import encryptPassword from "../services/registerService/cryptPassword";
import { login } from "../services/registerService/login";

export const registerUser = async (req: Request, res: Response) => {
  const { name, lastname, username, email, password, role } = req.body;
  const userToRegister = await findRegisteredUser(username, email);

  if (userToRegister === "username") {
    return res.status(409).json({
      message: "username already exists",
    });
  } else if (userToRegister === "email") {
    return res.status(409).json({
      message: "email already exists",
    });
  }

  const encryptedPassword = await encryptPassword(password);

  const user = await registerUserService(
    name,
    lastname,
    username,
    email,
    encryptedPassword,
    role
  );
  return res
    .json({
      name,
      lastname,
      username,
      email,
    })
    .status(200);
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userToLogin = await findRegisteredUser(username);

  if (!userToLogin) {
    return res.status(409).json({
      message: "user does not exist",
    });
  }

  const user = await findUserByUsername(username);

  if (!user) {
    return res.status(409).json({
      message: "user does not exist",
    });
  }
  const shouldLogin = await login(password, user);
  if (!shouldLogin) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  return res
    .json({
      name: user.name,
      lastname: user.lastname,
      username,
      email: user.email,
    })
    .status(200);
};
