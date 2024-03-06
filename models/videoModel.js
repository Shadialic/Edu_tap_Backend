const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  course_id: {
    type: String,
  },
  demoVideo: {
    type: String,
  },
  chapterVideo: {
    type: String,
  },
  file_path: { 
    type: String, 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  chapterTitle: {
    type: String,
  },
  chapterDescription: {
    type: String,
  },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
