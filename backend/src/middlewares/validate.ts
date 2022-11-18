import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export const validateUser = async (ctx: any, next: any) => {
  const registerSchema = {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      lastname: {
        type: "string",
      },
      username: {
        type: "string",
      },
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        format: "password",
        minLength: 8,
      },
    },
    required: ["name", "lastname", "username", "email", "password"],
  };
  const valid = ajv.validate(registerSchema, ctx.body);

  if (!valid) {
    return ctx;
  }
  return await next();
};
