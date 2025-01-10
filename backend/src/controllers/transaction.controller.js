import model from "../models/index.js";
import sequelize from "../config/database.config.js";

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
export const updateTransaction = async (req, res, next) => {
  const { id } = req.params; // Transaction ID
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
      // Fetch the existing transaction
      const transaction = await Transaction.findByPk(id, {
        include: [
          { model: TransactionItem, as: "items" },
          { model: Payment, as: "payments" },
        ],
        transaction: t,
      });
      if (!transaction) throw new Error(`Transaction with ID ${id} not found`);

      // Step 1: Update Transaction Fields
      const transactionUpdates = {
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
        totalAmount,
        finalAmount,
      };
      Object.keys(transactionUpdates).forEach((key) => {
        if (transactionUpdates[key] !== undefined) {
          transaction[key] = transactionUpdates[key];
        }
      });

      // Step 2: Update Transaction Items
      if (items) {
        const existingItems = transaction.items || [];
        const updatedItemIds = items.map((item) => item.id).filter(Boolean);

        // Remove items not in the request
        for (const existingItem of existingItems) {
          if (!updatedItemIds.includes(existingItem.id)) {
            await existingItem.destroy({ transaction: t });
          }
        }

        // Update or Add items
        for (const item of items) {
          if (item.id) {
            // Update existing item
            const existingItem = await TransactionItem.findByPk(item.id, {
              transaction: t,
            });
            if (existingItem) {
              await existingItem.update(item, { transaction: t });
            }
          } else {
            // Add new item
            await TransactionItem.create(
              { ...item, transaction_id: transaction.id },
              { transaction: t }
            );
          }
        }
      }

      // Step 3: Recalculate Total and Final Amounts
      const updatedItems = await TransactionItem.findAll({
        where: { transaction_id: transaction.id },
        transaction: t,
      });
      const computedTotalAmount = updatedItems.reduce(
        (sum, item) => sum + parseFloat(item.finalAmount || 0),
        0
      );
      transaction.totalAmount = totalAmount || computedTotalAmount;
      transaction.finalAmount = finalAmount || computedTotalAmount;

      // Step 4: Update Payments
      if (payments) {
        const existingPayments = transaction.payments || [];
        const updatedPaymentIds = payments
          .map((payment) => payment.id)
          .filter(Boolean);

        // Remove payments not in the request
        for (const existingPayment of existingPayments) {
          if (!updatedPaymentIds.includes(existingPayment.id)) {
            const account = await Account.findByPk(existingPayment.account_id, {
              transaction: t,
            });
            if (!account) {
              throw new Error(
                `Account with ID ${existingPayment.account_id} not found`
              );
            }

            // Reverse payment effect on account balance
            if (transaction.type === "credit") {
              account.balance -= existingPayment.amount;
            } else {
              account.balance += existingPayment.amount;
            }
            await account.save({ transaction: t });
            await existingPayment.destroy({ transaction: t });
          }
        }

        // Update or Add payments
        for (const payment of payments) {
          if (payment.id) {
            // Update existing payment
            const existingPayment = await Payment.findByPk(payment.id, {
              transaction: t,
            });
            if (existingPayment) {
              const account = await Account.findByPk(payment.account_id, {
                transaction: t,
              });
              if (!account) {
                throw new Error(
                  `Account with ID ${payment.account_id} not found`
                );
              }

              // Reverse old payment effect
              if (transaction.type === "credit") {
                account.balance -= Number(existingPayment.amount);
              } else {
                account.balance += Number(existingPayment.amount);
              }

              // Apply new payment effect
              if (transaction.type === "credit") {
                account.balance += Number(payment.amount);
              } else {
                if (account.balance < Number(payment.amount)) {
                  throw new Error(
                    `Insufficient funds in account with ID ${payment.account_id}`
                  );
                }
                account.balance -= Number(payment.amount);
              }
              await account.save({ transaction: t });
              await existingPayment.update(payment, { transaction: t });
            }
          } else {
            // Add new payment
            const account = await Account.findByPk(payment.account_id, {
              transaction: t,
            });
            if (!account) {
              throw new Error(
                `Account with ID ${payment.account_id} not found`
              );
            }

            // Apply payment effect
            if (transaction.type === "credit") {
              account.balance += payment.amount;
            } else {
              if (account.balance < payment.amount) {
                throw new Error(
                  `Insufficient funds in account with ID ${payment.account_id}`
                );
              }
              account.balance -= payment.amount;
            }
            await account.save({ transaction: t });
            await Payment.create(
              {
                ...payment,
                transaction_id: transaction.id,
                balance: account.balance,
              },
              { transaction: t }
            );
          }
        }
      }

      // Save the updated transaction
      await transaction.save({ transaction: t });

      return transaction;
    });

    // Fetch the updated transaction with associated details
    const updatedTransaction = await Transaction.findOne({
      where: { id: result.id },
      include: [
        { model: TransactionItem, as: "items" },
        { model: Payment, as: "payments" },
      ],
    });

    // Respond with the updated transaction
    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
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
