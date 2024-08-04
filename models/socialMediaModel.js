// models/socialMediaModel.js
module.exports = (sequelize, DataTypes) => {
  const socialMedia = sequelize.define(
    "socialMedia",
    {
      socialMediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
          isEmail: true,
        },
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "deleted", "suspended"),
        defaultValue: "inactive",
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {}
  );
  return socialMedia;
};
