const express = require("express");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const cookieSession = require("cookie-session");
const { cookieKey } = require("./config");
const session = require("express-session");

const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-router");

const app = express();

// set up view engine
app.set("view engine", "ejs");

// set up database
require("./database");

// set up static file
app.use(express.static("public"));

// set up session cookies
app.use(
  session({
    secret: cookieKey, // Ganti dengan kunci sesi Anda
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Atur sesuai kebutuhan Anda
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => console.log("app now listening for requests on port 3000"));
