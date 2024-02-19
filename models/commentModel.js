const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  auther: {
    type: String,
  },
  Image: {
    type: String,
  },
  comment: {
    type: String,
  },
  Date: {
    type: String,
  },
  chapterId:{
    type:String
  }
});
const Comments = mongoose.model("Comments", commentSchema);
module.exports = Comments;
