const Course = require("../models/courseModel");
const CategoryDb=require('../models/courseCategory')
const { uploadToCloudinary } = require("../utils/cloudinary");
const addCourse = async (req, res) => {
  try {
    const { title, description, level, payment, category, price,image } = req.body;
    console.log(req.body, "sssa");
    console.log(image, "image");

    
    // const img = req.file.path;
    // const data = await uploadToCloudinary(img, "course");
    // console.log(data, "ooooooooooooooo");
    const newData = new Course({
      title: title,
      description: description,
      level: level,
      payment: payment,
      category: category,
      price: price,
      image: image,
    });
    const savedData = await newData.save();
    if (newData) {
      res.status(201).json({
        newData: savedData,
        alert: "Course saved successfully. Checking course data as admin.",
        status: true,
      });
    }
  } catch (err) {
    console.log('sddafdaf');
    console.error("Error in addCourse:", err);
    res.status(400).json({ status: false, alert: "Server error" });
  }
};

const getCourse = async (req, res) => {
  try {
    const CourseData = await Course.find();
    const category = await CategoryDb.find();
    console.log(category, 'category');
    console.log(CourseData, 'CourseData');
    res.json({ CourseData, category, status: true })
  } catch (err) {
    console.log(err); 
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  addCourse,
  getCourse
};
