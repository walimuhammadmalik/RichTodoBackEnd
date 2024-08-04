const express = require("express");
const todoRouter = express();
const todoController = require("../controllers/todoListController");
// const auth = require("../middleware/auth");
const passport = require("../middleware/passports");

// add all routes here for todoList and add authentication middleware
todoRouter.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  todoController.createTodoList
);
todoRouter.get(
  "/getOne/:id",
  passport.authenticate("jwt", { session: false }),
  todoController.getOneTodoList
);
todoRouter.get(
  "/getAll",
  passport.authenticate("jwt", { session: false }),
  todoController.getAll
);
todoRouter.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  todoController.updateTodoList
);
todoRouter.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  todoController.deleteTodoList
);
todoRouter.get(
  "/getAllPagination",
  passport.authenticate("jwt", { session: false }),
  todoController.getAllPagination
);

module.exports = todoRouter;
