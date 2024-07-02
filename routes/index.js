var express = require("express");
var router = express.Router();
const User = require("../models/register");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const upload = require("../utils/multer");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post")

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

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const posts =await Post.find().populate("user")
  res.render("profile", { user: req.user , posts});
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

router.get("/updateUser/:id", isLoggedIn, (req, res) => {
  res.render("updateUser", { user: req.user });
});

router.get("/post/:id", isLoggedIn, (req, res) => {
  res.render("postpic", { user: req.user });
});


router.post("/post", isLoggedIn,upload.single("media"), async (req, res) => {
  try {
    const newpost = new Post({
      title:req.body.title,
      media:req.file.filename,
      user:req.user._id
    })
    req.user.posts.push(newpost._id)
    await newpost.save()
    await req.user.save()
    res.redirect("/profile")
  } catch (error) {
    res.send(error)
  }
});


router.get("/timeline", (req, res)=>{
  res.render("timeline",{user:req.user})
})

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
      res.redirect(`/updateUser/${req.params.id}`);
      // res.send("profilepic updated")
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
