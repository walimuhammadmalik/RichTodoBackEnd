const db = require("../models");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");
//1. create a todoList for a user and also add validation and sanitization
const createTodoList = [
  // Validation and sanitization
  check("title").trim().notEmpty().withMessage("Title is required"),
  check("description")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description is too long"),
  check("status")
    .isIn(["Pending", "Completed", "Deleted", "InProgress"])
    .withMessage("Invalid status"),

  async (req, res) => {
    const user = req.user;
    const { title, description, status } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create a new todoList
      const todoList = await db.todoList.create({
        title,
        description,
        status,
        foreignKey: user.id,
      });
      await todoList.save();
      console.log("task is added.");
      return res.status(201).json(todoList);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
];

// 2. get a todoList against a logged in user and todo id and also add validation and sanitization
const getOneTodoList = [
  // Validation and sanitization
  check("id").isInt().withMessage("Invalid todo id"),
  async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find the todoList
      const todoList = await db.todoList.findOne({
        where: { id, foreignKey: user.id },
      });
      if (!todoList) {
        return res.status(404).json({ error: "Todo list not found" });
      }
      return res.json(todoList);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
];

//4. find all todoLists againt loggined user
const getAll = (req, res) => {
  const user = req.user;
  db.todoList
    .findAll({
      where: { foreignKey: user.id },
    })
    .then((todolists) => {
      res.json(todolists);
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

//4. find all todoLists againt loggined user with pagination
const getAllPagination = (req, res) => {
  const limit = +req.query.limit || 20;
  const offset = +req.query.offset || 10;
  const search = req.query.search || "";
  const sortField = req.query.sortField || "id"; // Default sort field
  const sortDirection = req.query.sortDirection === "desc" ? "DESC" : "ASC"; // Default sort direction

  const user = req.user;
  // console.log('limit: ', limit);
  // console.log('offset: ', offset);
  // console.log('user: ', typeof limit);
  // AndCount
  db.todoList
    .findAll({
      where: {
        foreignKey: user.id,
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [[sortField, sortDirection]], // Sort by field and direction
      limit: limit,
      offset: offset,
    })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ error: error });
    });
};
// how i can use in postman above code
// {{BASE_URL}}/todo/getAllp?limit=103&offset=1&search=te&sortField=id&sortDirection=desc
// http://localhost:3000/api/todo/getAllp?limit=2&offset=1
// http://localhost:3000/api/todo/getAllp?limit=2
// http://localhost:3000/api/todo/getAllp?offset=2
// http://localhost:3000/api/todo/getAllp

//5. update a todoList against a logged in user and todo id
const updateTodoList = (req, res) => {
  const id = req.params.id;
  const user = req.user;
  // getting updated data from request body and updating it you can send even a single field to update
  db.todoList
    .update(req.body, {
      where: { id: id, foreignKey: user.id },
    })
    .then((num) => {
      if (num == 1) {
        res.json({ message: "todoList was updated successfully" });
      } else {
        res.json({ message: "cannot update a todoList" });
      }
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

//6. delete a todoList against a logged in user and todo id
const deleteTodoList = (req, res) => {
  const id = req.params.id;
  const user = req.user;
  TodoList.destroy({
    where: { id: id, userId: user.id },
  })
    .then((num) => {
      if (num == 1) {
        res.json({ message: "todolist was deleted successfully" });
      } else {
        res.json({ message: "cannot delete todolist" });
      }
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

module.exports = {
  createTodoList,
  getOneTodoList,
  getAll,
  updateTodoList,
  deleteTodoList,
  getAllPagination,
};
