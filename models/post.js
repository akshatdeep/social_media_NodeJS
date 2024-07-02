const mongoose = require("mongoose");

const post = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Title is required"],
    minLength: [4, "Title must be atleast 4 characters long"],
  },
  media: {
    type: String,
    required: [true, "Media is required"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserRegister" },
});

const posts = mongoose.model("post", post)


module.exports = posts;