const Course = require("../models/courseModel");

const addCourse = async (req, res) => {
  try {
    const { title, description, level, payment, category, price } = req.body;
    console.log(req.body,'sssa');
    const img = req.file.path;
    const newData = new Course({
      title: title,
      description: description,
      level: level,
      payment: payment,
      category: category,
      price: price,
      image: img,
    });
    const savedData = await newData.save();
    if (newData) {
        res.status(201).json({
          newData:savedData,
          alert: "Course saved successfully. Checking course data as admin.",
          status: true,
        });
      }
    } catch (err) {
      console.error("Error in addCourse:", err);
      res.status(400).json({ status: false, alert: "Server error" });
    }
  };

module.exports = {
  addCourse,
};
