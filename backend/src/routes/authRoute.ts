import express, { response } from "express";
import { loginUser, registerUser } from "../controllers/auth";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/validate";
const router = express.Router();

router.post("/register", validateRegisterUser, registerUser);

router.post("/login", validateLoginUser, loginUser);

export default router;
