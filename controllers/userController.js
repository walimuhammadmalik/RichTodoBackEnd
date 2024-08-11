const db = require("../models");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken, generateToken } = require("../utils/jwt");
const { check, validationResult } = require("express-validator");
const User = db.user;

//1. post a user with email, name and password and also add validation and sanitization
const postTestUser = [
  // Validation and sanitization
  check("name").trim().notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    const { name, email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the user already exists
      const existingUser = await db.user.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      // Create a new user
      const user = await db.user.create({
        name,
        email,
        password,
      });
      // Generate JWT token
      const token = generateToken(user);

      // Send the response with the token
      // const verificationLink = `http://localhost:8080/user/verifyUser/${token}`;
      const verificationLink = `http://localhost:8080/user/verifyUser?token=${token}`;
      console.log(verificationLink);
      return res.status(201).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error registering user" });
    }
  },
];

//2. signupUser with email, name and password and also add validation and sanitization
const signupUser = [
  // Validation and sanitization
  check("name").trim().notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res) => {
    const { name, email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the user already exists
      const existingUser = await db.user.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      // Create a new user
      const user = await db.user.create({
        name,
        email,
        password,
      });
      // Generate JWT token
      const token = generateToken(user);
      // Send the response with the token
      const verificationLink = `http://localhost:8080/user/verifyUser?access-token=${token}`;
      console.log(verificationLink);
      return res.status(201).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error registering user" });
    }
  },
];

//3. VerifyUser and also add validation and sanitization
const verifyUser = [
  // Validation and sanitization
  check("authorization").trim().notEmpty().withMessage("Token is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let token =
      req.params.token ||
      req.headers["authorization"] ||
      req.headers["Authorization"];
    // console.log("req.params.token: ", token);
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    try {
      const obj = verifyToken(token);
      // console.log("obj: ", obj);
      const user = await db.user.findOne({ where: { email: obj.email } });
      user.status = "active";
      await user.save();
      // console.log("token:a a ", token);
      console.log("Email verified successfully!");
      res.json({ message: "Email verified successfully!" });
    } catch (error) {
      console.log("Error : v ", error);
      res.status(500).json({ message: error.message });
    }
  },
];

//4. login user with email and password  and also add validation and sanitization
const loginUser = [
  // Validation and sanitization
  check("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  check("password").trim().notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const { email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await db.user.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
      const token = generateToken(user);
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Error logging in" });
    }
  },
];

//5. authMe
const authMe = async (req, res) => {
  return res
    .status(200)
    .json({ message: "You are authenticated", user: req.user });
};

// 6. forgetUser using email and also add validation and sanitization
const forgetUser = [
  // Validation and sanitization
  check("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  check("email").trim().notEmpty().withMessage("Email is required"),
  async (req, res) => {
    const { email } = req.body;
    try {
      const user = await db.user.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const token = generateToken(user);
      // Send the response with the token
      const verificationLink = `http://localhost:8080/user/resetPassUser/${token}`;
      console.log(verificationLink);
      // console.log(verificationToken);
      console.log("Password reset link sent on given email");
      return res.status(201).json({ token });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res
        .status(500)
        .json({ error: "Error sending password reset link" });
    }
  },
];

//7. resetPassUser using email and password  and also add validation and sanitization
const resetPassUser = [
  // Validation and sanitization
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("authorization").trim().notEmpty().withMessage("Token is required"),
  async (req, res) => {
    const { password } = req.body;
    // let token = req.params.token;
    let token =
      req.headers["authorization"] ||
      req.headers["Authorization"] ||
      req.params.token;
    try {
      const userObj = req.user;
      console.log("userObj: ", userObj);
      const User = await db.user.findOne({
        where: {
          email: userObj.email,
        },
      });
      if (!User) {
        return res.status(404).json({ error: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      User.password = hashedPassword;
      await User.save();
      // console.log("token: ", token);
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.log("token not matched");
      console.error("Reset password error:", error);
      return res.status(500).json({ error: "Error resetting password" });
    }
  },
];

module.exports = {
  postTestUser,
  signupUser,
  verifyUser,
  loginUser,
  authMe,
  forgetUser,
  resetPassUser,
};
