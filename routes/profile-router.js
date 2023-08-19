const router = require("express").Router();
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  const user = { user: req.user };

  const templatePath = path.join(__dirname, "..", "views", "profile.ejs");
  const templateContent = fs.readFileSync(templatePath, "utf-8");

  const renderedHtml = ejs.render(templateContent, { user });

  // Kirimkan HTML yang dihasilkan sebagai respons
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(renderedHtml);

  //   res.render("profile", { user: req.user });
});

module.exports = router;
