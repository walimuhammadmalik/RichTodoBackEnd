//middleware/auth.js
const jwt = require("jsonwebtoken");
const db = require("../models");
const { verifyToken } = require("../utils/jwt");
const authenticate = async (req, res, next) => {
  let token =
    req.headers["authorization"] ||
    req.headers["Authorization"] ||
    req.params.token;
  // console.log("Authenticate token", token);
  console.log("auth token: ", token);
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  console.log("token bb: ", token);
  try {
    const obj = verifyToken(token);
    console.log(" authenticate obj: ", obj);
    if (obj.status !== "active") {
      return res.status(401).json({ error: "Account not active" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "authenticate Invalid token" });
  }
};

const authVerify = (req, res, next) => {
  let token =
    req.headers["authorization"] ||
    req.headers["Authorization"] ||
    req.params.token;
  // console.log("req.headers", req.headers);
  // console.log("token", token);
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = {
  authenticate,
  authVerify,
};
