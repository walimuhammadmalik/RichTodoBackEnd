//server.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const facebookPassport = require("./middleware/facebook-passport");
require("./models/index");
const bodyParser = require("body-parser");
// const { PASSWORD } = require("./config/dbConfig");
const authRoutes = require("./middleware/auth");
// const fbUserRouter = require("./routes/fbUserRouter");
const passport = require("passport");


const db = require("./models/index");

const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());

var vorOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(
  session({
    secret: "your_secret_key",
    name: "facebook-auth-session",
    keys: ["key1", "key2"],
  })
);

app.use(facebookPassport.initialize());
app.use(facebookPassport.session());
app.use("/auth/", require("./routes/socialMediaRouter"));

// middleware
console.log("server.js");
app.use(cors(vorOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api/auth", authRoutes.authenticate);
// app.use("/api/auth", authRoutes.authVerify);

// routers
app.get("/", (req, res) => {
  res.json({ message: "hello fro Api" });
});
app.get("/example", (req, res) => {
  res.send("Hello World!");
});

//user routes
app.use("/user", require("./routes/userRouter"));
app.use("/todo", require("./routes/todoListRouter"));
// app.use("/fb", require("./routes/socialMediaRouter"));

//port
const PORT = process.env.PORT || 8080;

//server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
