export default (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    "Auth",
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING, // Store hashed passwords
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING, // Optional profile picture URL
      },
    },
    {
      timestamps: true,
    }
  );

  Auth.associate = (models) => {
    Auth.hasMany(models.Account, { foreignKey: "auth_id", as: "accounts" });
  };

  return Auth;
};
