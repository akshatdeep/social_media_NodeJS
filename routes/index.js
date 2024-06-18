var express = require("express");
var router = express.Router();
const User = require("../models/register");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const upload = require("../utils/multer");
const fs = require("fs");
const path = require("path");

passport.use(new LocalStrategy(User.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/login", function (req, res, next) {
  res.render("login", { user: req.user });
});

router.get("/register", function (req, res, next) {
  res.render("register", { user: req.user });
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile", { user: req.user });
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    User.register({ username, email }, password);
    res.redirect("/login");
  } catch (error) {
    res.send(error);
  }
});

router.get("/updateUser/:id", (req, res) => {
  res.render("updateUser", { user: req.user });
});

router.post(
  "/profile-update/:id",
  upload.single("profilepic"),
  isLoggedIn,
  async (req, res) => {
    try {
      if (req.user.profilepic !== "profile.png") {
        fs.unlinkSync(
          path.join(__dirname, "..", "public", "images", req.user.profilepic)
        );
      }
      console.log("working")
      req.user.profilepic = req.file.filename;
      await req.user.save();
      // res.redirect(`/updateUser${req.params.id}`);
      res.send("profilepic updated")
    } catch (error) {
      res.send(error);
    }
  }
);

router.post(
  "/login-user",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res, next) {}
);

router.get("/logout-user", (req, res) => {
  req.logOut(() => {
    res.redirect("/login");
  });
});

router.get("/reset-password/:id", (req, res) => {
  res.render("resetpassword", { user: req.user });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
