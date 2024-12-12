import express from "express";
import {
  createTransaction,
  // updateTransactionStatus,
  getTransactionById,
  deleteTransaction,
} from "../controllers/transaction.controller.js"; // Import the controller methods
import { authenticateToken } from "../middlewares/auth.middleware.js"; // Import authentication middleware

const router = express.Router();

// Create a new transaction
router.post("/create", authenticateToken, createTransaction);

// Update the status of a transaction
// router.patch(
//   "/accounts/:accountId/transactions/:transactionId",
//   authenticateToken,
//   updateTransactionStatus
// );

// // Get a specific transaction by ID, including its items
// router.get(
//   "/accounts/:accountId/transactions/:transactionId",
//   authenticateToken,
//   getTransactionById
// );

// // Delete a specific transaction (and its associated items)
// router.delete(
//   "/accounts/:accountId/transactions/:transactionId",
//   authenticateToken,
//   deleteTransaction
// );

export default router;
