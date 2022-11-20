import express from "express";
import { getAll, info } from "../controllers/tournament";
const router = express.Router();

router.get("/tournament/:id", info);

export default router;
