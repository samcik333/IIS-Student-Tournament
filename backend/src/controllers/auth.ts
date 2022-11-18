import registerUserService from "../services/registerUser";

export const registerUser = async (ctx: any) => {
  const { name, lastname, username, email, password } = ctx.body;
  await registerUserService(name, lastname, username, email, password);
};
