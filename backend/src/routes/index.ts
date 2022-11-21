import express from "express";
import { getAll } from "../controllers/tournament";
import authRoute from "./auth";
import tournament from "./tournaments";
import user from "./user";
const router = express.Router();

router.use(authRoute, tournament, user);

router.get("/", getAll);

export default router;
