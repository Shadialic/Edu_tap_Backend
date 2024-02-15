const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    courseId:{
        type: String,
        required: true
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
