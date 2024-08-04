//models/todoListModel.js
module.exports = (sequelize, DataTypes) => {
  const todoList = sequelize.define("todoList", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 500],
      },
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed", "Deleted", "InProgress"),
      defaultValue: "Pending",
    },
    foreignKey: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });
  return todoList;
};
