const mongoose = require("mongoose");
const videoSchema = mongoose.Schema({
  course_id: {
    type: String,
  },
  demoVideo: {
    type: String,
  },
  chapterVideo: {
    type: String,
  },
  chapterTitle: {
    type: String,
  },
  chapterDescription: {
    type: String,
  },
});
const video = mongoose.model("video", videoSchema);
module.exports = video;
