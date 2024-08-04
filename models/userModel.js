//models/userModel.js
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        errorMessages: {
          allowNull: "Name is required",
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 36],
        },
      },
      status: {
        type: DataTypes.ENUM(
          "active",
          "inactive",
          "pending",
          "deleted",
          "suspended"
        ),
        defaultValue: "pending",
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
      paranoid: true, // Enable soft deletes
    }
  );
  return User;
};
