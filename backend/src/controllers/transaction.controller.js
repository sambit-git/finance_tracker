import model from "../models/index.js";
import sequelize from "../config/database.config.js";

const { Transaction, TransactionItem, Payment, Account } = model;
/**
 * Create a new transaction with items and payments
 */
export const createTransaction = async (req, res, next) => {
  const {
    title,
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
      if(payments?.length > 0){
        const paymentsTotal = payments.reduce(
          (sum, item) => sum + parseFloat(item.amount || 0),
          0
        );
        if (paymentsTotal != transaction.finalAmount) throw new Error("Total amount paid must match with transaction final amount.");
        for (const payment of payments){
          const account = await Account.findOne({where: { id: payment.account_id}})
          if (!account) {
            throw new Error(`Account with ID ${payment.account_id} not found`);
          }
  
          if (account.balance < payment.amount) {
            throw new Error(
              `Insufficient funds in account with ID ${payment.account_id}`
            );
          }
          // Deduct the payment amount from the bank account
          account.balance -= payment.amount;
          await account.save()
          
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
      }else{
        throw new Error("Transaction can't be saved without payments.")
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
        { model: TransactionItem, as: "items" },
        { model: Payment, as: "payments" },
      ],
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
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { title, totalAmount, items, payments, shipping } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      const transaction = await Transaction.findByPk(id, { transaction: t });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Update transaction
      await transaction.update(
        { title, totalAmount, shipping },
        { transaction: t }
      );

      // Update transaction items
      await TransactionItem.destroy({
        where: { transaction_id: id },
        transaction: t,
      });
      const transactionItems = items.map((item) => ({
        ...item,
        transaction_id: id,
      }));
      await TransactionItem.bulkCreate(transactionItems, { transaction: t });

      // Update payments
      await Payment.destroy({
        where: { transaction_id: id },
        transaction: t,
      });
      const paymentEntries = payments.map((payment) => ({
        ...payment,
        transaction_id: id,
      }));
      await Payment.bulkCreate(paymentEntries, { transaction: t });

      return transaction;
    });

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction: result,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({ error: "Failed to update transaction" });
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
