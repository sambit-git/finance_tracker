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
        allowNull: false,
      },
      app: {
        type: DataTypes.STRING,
      },
      creditDebit: {
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
      hooks: {
        async beforeValidate(payment) {
          if (!payment.paymentMethod && payment.account_id) {
            // Fetch the associated Account to determine the type
            const account = await sequelize.models.Account.findByPk(
              payment.account_id
            );
            if (account) {
              switch (account.type) {
                case "cash":
                  payment.paymentMethod = "cash";
                  break;
                case "wallet":
                  payment.paymentMethod = "digital wallet";
                  break;
                case "bank":
                  payment.paymentMethod = "upi";
                  break;
                default:
                  throw new Error("Invalid account type");
              }
            } else {
              throw new Error("Associated account not found");
            }
          }
        },
      },
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
