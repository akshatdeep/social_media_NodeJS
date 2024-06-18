const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")

const User = new mongoose.Schema(
  
  {
    profilepic:{
      type:String,
      default:"profile.png"
    },
    username: {
      required: [true, "Username is required"],
      minlength: [4, "Username should be 4 characters Long"],
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
        type:String
    }
  },
  { timestamps: true }
);


User.plugin(plm)


const newuser = mongoose.model("UserRegister", User);

module.exports = newuser;
