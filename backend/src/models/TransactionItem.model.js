export default (sequelize, DataTypes) => {
  const TransactionItem = sequelize.define(
    "TransactionItem",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1.0,
      },
      unit: {
        // Enum for units
        type: DataTypes.ENUM("no.", "kg", "litres"),
        allowNull: false,
        defaultValue: "no.",
      },
      mrp: {
        type: DataTypes.DECIMAL(12, 2),
      },
      discountPercent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      couponCode: {
        type: DataTypes.STRING,
      },
      couponDiscount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      taxPercent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      finalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  TransactionItem.associate = (models) => {
    TransactionItem.belongsTo(models.Transaction, {
      foreignKey: "transaction_id",
      as: "transaction",
    });
  };

  return TransactionItem;
};

// Utility function to update the final amount of a transaction
async function updateTransactionFinalAmount(transactionId) {
  const Transaction = sequelize.models.Transaction;
  const TransactionItem = sequelize.models.TransactionItem;

  // Fetch the transaction and its related items
  const items = await TransactionItem.findAll({
    where: { transaction_id: transactionId },
  });

  const finalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.finalAmount || 0),
    0
  );

  // Update the transaction with the new final amount
  await Transaction.update({ finalAmount }, { where: { id: transactionId } });
}
