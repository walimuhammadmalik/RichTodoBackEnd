// middleware/facebook-passport.js
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const db = require("../models/");
require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      enableProof: true,
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Profile:", profile);
        const [user, created] = await db.socialMedia.findOrCreate({
          where: { socialMediaId: profile.id },
          defaults: {
            socialMediaId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "facebook",
          },
        });
        console.log("User found or created:", user);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
