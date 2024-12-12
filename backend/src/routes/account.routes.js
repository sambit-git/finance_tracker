import { Router } from "express";
import {
  createAccount,
  getAccounts,
  getAccountDetails,
  updateAccount,
  // deleteAccount,
} from "../controllers/account.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Protecting the routes with authenticateToken middleware
router.post("/create", authenticateToken, createAccount);
router.get("/all", authenticateToken, getAccounts);
router.get("/:accountId", authenticateToken, getAccountDetails);
router.put("/:accountId", authenticateToken, updateAccount);
// router.delete("/:accountId", authenticateToken, deleteAccount);

export default router;
