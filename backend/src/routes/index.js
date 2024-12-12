import express from "express";
import accountRoutes from "./account.routes.js";
import authRoutes from "./auth.routes.js";
import transactionRoutes from "./transaction.routes.js";

const router = express.Router();

// Mount route files to specific paths
router.use("/accounts", accountRoutes); // Routes for accounts
router.use("/auth", authRoutes); // Routes for authentication
router.use("/transactions", transactionRoutes); // Routes for transactions

export default router;
