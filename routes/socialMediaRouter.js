// routes/fbUserRouter.js
const express = require("express");
const router = express.Router();
const passport = require("../middleware/facebook-passport");
const isLoggedIn = require("../middleware/fbAuth");
// const { fbUser } = require("../models");
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

router.get("/", isLoggedIn, (req, res) => {
  console.log("users loggedIn:", req.user);
  res.send(`Hello world ${req.user.name}`);
});

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

router.get("/profile", (req, res) => {
  res.json(req.user);
});

module.exports = router;
