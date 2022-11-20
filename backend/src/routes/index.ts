import express from "express";
import { getAll } from "../controllers/tournament";
import authRoute from "./auth";
import tournament from "./tournaments";
const router = express.Router();

router.use("/", authRoute, tournament);

router.get("/", getAll);

export default router;
