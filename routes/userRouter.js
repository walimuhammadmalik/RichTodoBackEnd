//routes/userRouter.js
const express = require("express");
const userRouter = express();
const userController = require("../controllers/userController.js");
const auth = require("../middleware/auth");
const passport = require("../middleware/passports");
// Example route that uses passport for authentication
userRouter.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("protected route");
    res.json({ message: "This is a protected route" });
  }
);
// user routes
userRouter.post("/postTestUser", userController.postTestUser); //1
userRouter.post("/signupUser", userController.signupUser); //2
userRouter.get(
  "/verifyUser",
  passport.authenticate("jwt", { session: false }),
  userController.verifyUser
); //3
userRouter.get(
  "/verifyUser/:token",
  passport.authenticate("jwt", { session: false }),
  userController.verifyUser
); //3
userRouter.post("/loginUser", userController.loginUser); //4
userRouter.get(
  "/authMe",
  passport.authenticate("jwt", { session: false }),
  userController.authMe
); //5
userRouter.post("/forgetUser", userController.forgetUser); //6
userRouter.post(
  "/resetPassUser",
  passport.authenticate("jwt", { session: false }),
  userController.resetPassUser
); //7

module.exports = userRouter;
