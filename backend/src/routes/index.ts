import express from "express";
import { getAll } from "../controllers/tournament";
import authRoute from "./authRoute";
const router = express.Router();

router.use("/", authRoute);

router.get("/", getAll); 

export default router;
