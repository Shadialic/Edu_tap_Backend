const Course = require("../models/courseModel");
const CategoryDb = require("../models/categoryModel");
const ChapterDb = require("../models/videoModel");
const mongoose = require("mongoose");

const addCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      level,
      payment,
      category,
      price,
      image,
      auther,
    } = req.body;
    const newData = new Course({
      title: title,
      description: description,
      level: level,
      payment: payment,
      category: category,
      price: price,
      image: image,
      auther: auther,
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
    res.status(400).json({ status: false, alert: "Server error" });
  }
};

const getCourse = async (req, res) => {
  try {
    const CourseData = await Course.find();
    const category = await CategoryDb.find();
    res.json({ CourseData, category, status: true });
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
};

const addChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapterTitle, chapterDescription, demoVideo, chapterVideo } =
      req.body;
    const chapter = new ChapterDb({
      course_id: id,
      chapterTitle,
      chapterDescription,
      demoVideo,
      chapterVideo,
    });
    const saveData = await chapter.save();
    res.status(200).json({
      chapter: saveData,
      success: true,
      message: "Chapter added successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getChapter = async (req, res) => {
  try {
    const data = await ChapterDb.find();
    res.json({ data, status: 200 });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const manageChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ChapterDb.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      return res.json({ result, alert: "Chapter deleted successfully." });
    } else {
      return res.status(404).json({ alert: "Chapter not found." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const courseManage = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const result = await Course.findOne({ _id: objectId }).exec();
    if (!result) {
      return res.status(404).json({ alert: "Document not found" });
    }
    const newData = await Course.updateOne(
      { _id: objectId },
      { $set: { is_Block: !result.is_Block } }
    );
    res.json({
      newData,
      status: true,
      alert: `${result.title} ${result.is_Block ? "unblocked" : "blocked"}`,
    });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  addCourse,
  getCourse,
  addChapter,
  getChapter,
  manageChapter,
  courseManage,
};
