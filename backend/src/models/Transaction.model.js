export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      discountPercentage: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      couponCode: {
        type: DataTypes.STRING,
      },
      couponDiscount: {
        // Discount applied due to coupon
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
      finalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Completed",
      },
      shipping: {
        type: DataTypes.JSONB, // Store shipping details as JSON
      },
      orderNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      recipt: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
    }
  );

  Transaction.associate = (models) => {
    Transaction.hasMany(models.TransactionItem, {
      foreignKey: "transaction_id",
      as: "items",
    });
    Transaction.hasMany(models.Payment, {
      foreignKey: "transaction_id",
      as: "payments",
    });
  };

  return Transaction;
};
