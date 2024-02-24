const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  is_Active: {
    type: String,
    default: false,
  },
  is_admin: {
    type: String,
    default: false,
  },
  googleId: {
    type: String,
  },
  secret: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  Country: {
    type: String,
  },
  Qualification: {
    type: String,
  },
  Institute: {
    type: String,
  },
  year: {
    type: Number,
  },
  courses: [ 
  {
    courseId: String,
  }
],


});
const user = mongoose.model("User", userSchema);
module.exports = user;
