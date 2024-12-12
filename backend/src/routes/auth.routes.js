import { Router } from "express";
import {
  getCurrentUser,
  login,
  register,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Protecting the routes with authenticateToken middleware
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
