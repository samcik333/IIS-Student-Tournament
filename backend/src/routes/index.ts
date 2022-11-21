import express from "express";
import authRoute from "./auth";
import tournament from "./tournaments";
import user from "./user";
import team from "./teams";
import { getAll } from "../controllers/tournament";
const router = express.Router();

router.use(authRoute, user, team, tournament);

router.get("/", getAll);

export default router;
