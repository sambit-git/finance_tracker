export default (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
      },
      app: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM("credit", "debit"),
        allowNull: false,
        defaultValue: "debit",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Completed",
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.Transaction, {
      foreignKey: "transaction_id",
      as: "transaction",
    });
    Payment.belongsTo(models.Account, {
      foreignKey: "account_id",
      as: "account",
    });
  };

  return Payment;
};
