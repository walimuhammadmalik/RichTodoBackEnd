//model/index.js
const { Sequelize, DataTypes, Model } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    logging: false,
  }
);

console.log("index.js");

try {
  sequelize.authenticate();
  sequelize.getDatabaseName();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, DataTypes);
db.socialMedia = require("./socialMediaModel.js")(sequelize, DataTypes);
db.todoList = require("./todoListModel.js")(sequelize, DataTypes);

// console.log("model index.js");
// Define the one-to-many relationship
db.user.hasMany(db.todoList, { foreignKey: "foreignKey", onDelete: "CASCADE" });
db.todoList.belongsTo(db.user, {
  foreignKey: "foreignKey",
  onDelete: "CASCADE",
});

db.socialMedia.hasMany(db.todoList, {
  foreignKey: "foreignKey",
  onDelete: "CASCADE",
});
db.todoList.belongsTo(db.socialMedia, {
  foreignKey: "foreignKey",
  onDelete: "CASCADE",
});

// force: true - drops the table and creates a new one // force:true, force:false, alter:true explained
// force: false - does not drop the table and does not create a new one
// alter: true - alters the table
// alter: false - does not alter the table

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
console.log("model index.js");

// db.sequelize.sync().then((e)=>{console.log(e) }).catch((e )=>{ console.log(e) });

module.exports = db;
