//middleware/passport.js
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const passport = require("passport");
require("dotenv").config();
const db = require("../models"); // Adjust the path as necessary
const { check, validationResult } = require("express-validator");

// const User = db.user; // Adjust the model name as necessary
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Make sure to set this environment variable 
  
};

// console.log("opts: ", opts);
console.log("passport.js");
// create a new instance of JwtStrategy but i want to check email in both user and fbUsers
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    // console.log("Jwt strategy: ", jwt_payload);
    const existingUser = await db.user.findOne({
      where: { email: jwt_payload.email },
    });
    if (existingUser) {
      // console.log("Jwt strategy: ", jwt_payload);
      return done(null, existingUser, { message: "Authorized" });
    }
    console.log("Jwt strategy: ", jwt_payload);
    return done(null, false, { message: "Unauthorized and Token required" });
  })
);

module.exports = passport;
