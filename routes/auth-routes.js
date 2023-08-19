const router = require("express").Router();
const passport = require("passport");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

// auth login
router.get("/login", (req, res) => {
  const user = { user: req.user };
  const templatePath = path.join(__dirname, "..", "views", "login.ejs");
  const templateContent = fs.readFileSync(templatePath, "utf-8");

  const renderedHtml = ejs.render(templateContent, { user });

  //   res.render("login");
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(renderedHtml);
});

// auth logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// auth with google+
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/user.birthday.read", "https://www.googleapis.com/auth/user.gender.read"],
  })
);

// callback route for google to redirect to
// hand control to passport to use to grab profile info
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  //   res.send(req.user);
  res.redirect("/profile");
});

module.exports = router;
