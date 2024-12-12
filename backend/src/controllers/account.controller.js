import logger from "../config/logger.config.js";
import models from "../models/index.js";
const { Account, Transaction, Payment } = models;

// Create Account
export const createAccount = async (req, res) => {
  try {
    const { name, type, balance } = req.body;
    logger.info("body: ", { name, type, balance });

    // Check if the required fields are provided
    if (!name || !type || balance === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new account for the authenticated user
    const newAccount = await Account.create({
      name,
      type,
      balance,
      auth_id: req.user.id, // Get user ID from the authenticated token (provided by middleware)
    });

    res.status(201).json({
      message: "Account created successfully",
      account: newAccount,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error during account creation" });
  }
};

// Get all accounts for the logged-in user
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { auth_id: req.user.id }, // Fetch accounts for the authenticated user
    });

    if (!accounts || accounts.length === 0) {
      return res
        .status(404)
        .json({ message: "No accounts found for this user" });
    }

    res.status(200).json({
      accounts,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error while fetching accounts" });
  }
};

// Get account details
export const getAccountDetails = async (req, res) => {
  try {
    const { accountId } = req.params; // Get account ID from URL parameters
    logger.info("param: accountId: ", accountId);

    // Fetch account with associated transactions and payments
    const account = await Account.findOne({
      where: {
        id: accountId,
        auth_id: req.user.id, // Ensure the user has access to this account
      },
      include: [
        {
          model: Payment,
          as: "payments",
          attributes: [
            "id",
            "amount",
            "paymentMethod",
            "creditDebit",
            "status",
          ],
          include: [
            {
              model: Transaction,
              as: "transaction",
              attributes: ["id", "title", "timestamp", "status"],
            },
          ],
        },
      ],
    });

    if (!account) {
      return res
        .status(404)
        .json({ error: "Account not found or not authorized" });
    }

    res.status(200).json({
      account,
    });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: "Server error while fetching account details" });
  }
};

// Update account balance
export const updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params; // Account ID from URL parameters
    const { name, type, balance } = req.body;

    // Validate balance input
    if (balance !== undefined && balance < 0) {
      return res.status(400).json({ error: "Invalid balance value" });
    }

    // Find the account and ensure it's the user's account
    const account = await Account.findOne({
      where: {
        id: accountId,
        auth_id: req.user.id, // Ensure the user has access to this account
      },
    });

    if (!account) {
      return res
        .status(404)
        .json({ error: "Account not found or not authorized" });
    }

    // Prepare fields to update
    const updates = {};
    if (balance !== undefined && balance >= 0 && balance !== account.balance)
      updates.balance = balance;
    if (name && name !== account.name) updates.name = name;
    if (type && type !== account.type) updates.type = type;

    // Apply updates
    for (let key in updates) {
      account[key] = updates[key];
    }

    // Save only if there are changes
    if (Object.keys(updates).length > 0) {
      await account.save();
    }

    res.status(200).json({
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while updating account" });
  }
};

// Delete account
// export const deleteAccount = async (req, res) => {
//   try {
//     const { accountId } = req.params; // Account ID from URL parameters

//     // Find the account and ensure it's the user's account
//     const account = await Account.findOne({
//       where: {
//         id: accountId,
//         auth_id: req.user.id, // Ensure the user has access to this account
//       },
//     });

//     if (!account) {
//       return res
//         .status(404)
//         .json({ error: "Account not found or not authorized" });
//     }

//     // Delete the account
//     await account.destroy();

//     res.status(200).json({
//       message: "Account deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error while deleting account" });
//   }
// };
