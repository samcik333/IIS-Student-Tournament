import express from "express";
import { registerUser } from "../controllers/auth";
import { validateUser } from "../middlewares/validate";
const router = express.Router();

// Home page route.
router.post("/register", validateUser, registerUser);

// About page route.
router.get("/about", function (req, res) {
  res.send("About this wiki");
});

export default router;
