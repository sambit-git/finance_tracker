export default (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("bank", "wallet", "cash"), // Restricted to specific values
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.0,
      },
    },
    {
      timestamps: true,
    }
  );

  Account.associate = (models) => {
    Account.hasMany(models.Payment, {
      foreignKey: "account_id",
      as: "payments",
    });
    Account.belongsTo(models.Auth, {
      foreignKey: "auth_id",
      as: "auth",
    });
  };

  return Account;
};
