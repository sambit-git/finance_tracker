import { Op } from "sequelize";
import model from "../models/index.js";
import sequelize from "../config/database.config.js";
import logger from "../config/logger.config.js";

const { Transaction, TransactionItem, Payment, Account } = model;
/**
 * Create a new transaction with items and payments
 */
export const createTransaction = async (req, res, next) => {
  const {
    title,
    type,
    timestamp,
    totalAmount,
    discountPercentage,
    couponCode,
    couponDiscount,
    finalAmount,
    status,
    shipping,
    orderNumber,
    notes,
    recipt,
    items,
    payments,
  } = req.body;

  try {
    // Start a transaction (database transaction for atomicity)
    const result = await sequelize.transaction(async (t) => {
      // Step 1: Create the Transaction
      const transaction = await Transaction.create(
        {
          title,
          type,
          timestamp,
          discountPercentage,
          couponCode,
          couponDiscount,
          shipping,
          status,
          orderNumber,
          notes,
          recipt,
          totalAmount: totalAmount || finalAmount || (items && 0), // Placeholder, will compute if items exists
          finalAmount: finalAmount || (items && 0), // Placeholder, will compute if items exists
        },
        { transaction: t }
      );

      // Step 2: Add Transaction Items
      if (items?.length > 0) {
        const transactionItems = items.map((item) => ({
          ...item,
          transaction_id: transaction.id,
        }));
        const createdItems = await TransactionItem.bulkCreate(
          transactionItems,
          {
            transaction: t,
            returning: true,
          }
        );

        // Step 3: Recalculate Transaction Amounts
        const computedTotalAmount = createdItems.reduce(
          (sum, item) => sum + parseFloat(item.finalAmount || 0),
          0
        );

        // If the user didn't provide `finalAmount`, set it to the computed total
        transaction.totalAmount = totalAmount || computedTotalAmount;
        transaction.finalAmount = finalAmount || computedTotalAmount;
        await transaction.save({ transaction: t });
      }

      // Step 4: Add Payments
      if (payments?.length > 0) {
        const paymentsTotal = payments.reduce(
          (sum, item) => sum + parseFloat(item.amount || 0),
          0
        );
        if (paymentsTotal != transaction.finalAmount)
          throw new Error(
            "Total amount paid must match with transaction final amount."
          );
        for (const payment of payments) {
          const account = await Account.findOne({
            where: { id: payment.account_id },
          });
          if (!account) {
            throw new Error(`Account with ID ${payment.account_id} not found`);
          }

          // Deduct/Add the payment amount from/to the account
          if (transaction.type === "credit") account.balance += payment.amount;
          else {
            if (account.balance < payment.amount) {
              throw new Error(
                `Insufficient funds in account with ID ${payment.account_id}`
              );
            }
            account.balance -= payment.amount;
          }

          await account.save();

          // Create the payment entry
          await Payment.create(
            {
              ...payment,
              transaction_id: transaction.id,
              balance: account.balance,
            },
            { transaction: t }
          );
        }
      } else {
        throw new Error("Transaction can't be saved without payments.");
      }

      return transaction;
    });

    // Fetch the associated transaction items and payments after creation
    const transactionWithDetails = await Transaction.findOne({
      where: { id: result.id },
      include: [
        {
          model: TransactionItem,
          as: "items",
        },
        {
          model: Payment,
          as: "payments",
        },
      ],
    });

    // Respond with the created transaction
    return res.status(201).json({
      message: "Transaction created successfully",
      transaction: transactionWithDetails,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieve all transactions with associated items and payments
 */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Payment,
          as: "payments",
          include: [
            {
              model: Account,
              as: "account",
              required: true, // Ensure only accounts related to the user are considered
            },
          ],
        },
        { model: TransactionItem, as: "items" }, // Include transaction items
      ],
      order: [["timestamp", "DESC"]], // Order transactions by timestamp
      where: { "$payments->account.auth_id$": req.user.id }, // Filter transactions by user
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return res.status(500).json({ error: "Failed to retrieve transactions" });
  }
};

/**
 * Retrieve a single transaction by ID with associated items and payments
 */
export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: TransactionItem, as: "items" },
        { model: Payment, as: "payments" },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error("Error retrieving transaction:", error);
    return res.status(500).json({ error: "Failed to retrieve transaction" });
  }
};

/**
 * Update a transaction with associated items and payments
 */
// Helper functions for payment operations
const reversePaymentEffect = (account, amount, type) => {
  if (type === "credit") {
    account.balance -= Number(amount);
  } else {
    account.balance += Number(amount);
  }
};

const applyPaymentEffect = (account, amount, type) => {
  if (type === "credit") {
    account.balance += Number(amount);
  } else {
    if (account.balance < Number(amount)) {
      throw new Error(`Insufficient funds in account ${account.id}`);
    }
    account.balance -= Number(amount);
  }
};

export const updateTransaction = async (req, res, next) => {
  const { id } = req.params;
  const transactionData = req.body;

  try {
    const updatedTransaction = await sequelize.transaction(async (t) => {
      // Fetch transaction with original data
      const transaction = await Transaction.findByPk(id, {
        include: [
          { model: TransactionItem, as: "items" },
          { model: Payment, as: "payments" },
        ],
        transaction: t,
      });
      if (!transaction) throw new Error(`Transaction ${id} not found`);
      const originalType = transaction.type; // Capture original type

      // Update transaction fields
      const updatableFields = [
        "title",
        "type",
        "timestamp",
        "totalAmount",
        "discountPercentage",
        "couponCode",
        "couponDiscount",
        "status",
        "finalAmount",
      ];
      updatableFields.forEach((field) => {
        if (transactionData[field] !== undefined) {
          transaction[field] = transactionData[field];
        }
      });

      // Handle items
      if (transactionData.items) {
        const itemIds = transactionData.items.map((i) => i.id).filter(Boolean);
        // Remove items not in request
        await TransactionItem.destroy({
          where: { transaction_id: id, id: { [Op.notIn]: itemIds } },
          transaction: t,
        });

        // Update or create items
        await Promise.all(
          transactionData.items.map(async (item) => {
            if (item.id) {
              await TransactionItem.update(item, {
                where: { id: item.id },
                transaction: t,
              });
            } else {
              await TransactionItem.create(
                {
                  ...item,
                  transaction_id: id,
                },
                { transaction: t }
              );
            }
          })
        );
      }

      // Recalculate amounts
      const items = await TransactionItem.findAll({
        where: { transaction_id: id },
        transaction: t,
      });
      const computedTotal = items.reduce(
        (sum, item) => sum + Number(item.finalAmount),
        0
      );
      transaction.totalAmount = transactionData.totalAmount ?? computedTotal;
      transaction.finalAmount = transactionData.finalAmount ?? computedTotal;

      // Handle payments
      if (transactionData.payments) {
        const paymentIds = transactionData.payments
          .map((p) => p.id)
          .filter(Boolean);
        const existingPayments = transaction.payments || [];

        // Remove payments not in request
        await Promise.all(
          existingPayments.map(async (payment) => {
            if (!paymentIds.includes(payment.id)) {
              const account = await Account.findByPk(payment.account_id, {
                transaction: t,
              });
              reversePaymentEffect(account, payment.amount, originalType);
              await account.save({ transaction: t });
              await payment.destroy({ transaction: t });
            }
          })
        );

        // Process payments in request
        await Promise.all(
          transactionData.payments.map(async (payment) => {
            if (payment.id) {
              const existingPayment = await Payment.findByPk(payment.id, {
                transaction: t,
              });
              const account = await Account.findByPk(payment.account_id, {
                transaction: t,
              });

              // Reverse original effect
              reversePaymentEffect(
                account,
                existingPayment.amount,
                originalType
              );
              // Apply new effect
              applyPaymentEffect(account, payment.amount, transaction.type);

              await account.save({ transaction: t });
              await existingPayment.update(payment, { transaction: t });
            } else {
              const account = await Account.findByPk(payment.account_id, {
                transaction: t,
              });
              applyPaymentEffect(account, payment.amount, transaction.type);

              await account.save({ transaction: t });
              await Payment.create(
                {
                  ...payment,
                  transaction_id: id,
                  balance: account.balance,
                },
                { transaction: t }
              );
            }
          })
        );
      }

      await transaction.save({ transaction: t });
      return transaction;
    });

    // Fetch fresh transaction data
    const result = await Transaction.findByPk(id, {
      include: [
        { model: TransactionItem, as: "items" },
        {
          model: Payment,
          as: "payments",
          include: [{ model: Account, as: "account" }],
        },
      ],
    });

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction: result,
    });
  } catch (error) {
    logger.error(`Transaction update failed: ${error.message}`);
    return next(error);
  }
};

/**
 * Delete a transaction and its associated items and payments
 */
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sequelize.transaction(async (t) => {
      const transaction = await Transaction.findByPk(id, { transaction: t });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Delete associated items and payments
      await TransactionItem.destroy({
        where: { transaction_id: id },
        transaction: t,
      });
      await Payment.destroy({
        where: { transaction_id: id },
        transaction: t,
      });

      // Delete transaction
      await transaction.destroy({ transaction: t });

      return transaction;
    });

    return res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: result,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({ error: "Failed to delete transaction" });
  }
};
