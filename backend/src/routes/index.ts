import express from "express";
import { tournaments } from "../controllers/tournament";
import authRoute from "./auth";
import tournament from "./tournaments";
const router = express.Router();

router.use("/", authRoute, tournament);

router.get("/", tournaments);

export default router;
