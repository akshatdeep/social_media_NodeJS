var express = require("express");
var router = express.Router();
const User = require("../models/register");
const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(User.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

router.get("/profile", function (req, res, next) {
  res.render("profile");
});

router.post("/register", async function (req, res, next) {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("user Created");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
