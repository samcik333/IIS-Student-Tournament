import express from "express";
import { getUserId, updateUser } from "../controllers/user";
import { authorization } from "../middlewares/authorization";
import { validateUpdateUser } from "../middlewares/validate";
const router = express.Router();

router.get("/user", getUserId);
router.get("/user/profile", authorization, getUserId);
router.patch("/user/profile", authorization, validateUpdateUser, updateUser);

export default router;
