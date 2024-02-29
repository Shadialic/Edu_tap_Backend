const CategoryDb = require("../models/categoryModel");
const ChapterDb = require("../models/videoModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const TutorDb = require("../models/tutorModel");
const CourseDb = require("../models/courseModel");
const PaymentDb = require("../models/paymentModle");
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
    const newData = new CourseDb({
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
    const CourseData = await CourseDb.find();
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
    const result = await CourseDb.findOne({ _id: objectId }).exec();
    if (!result) {
      return res.status(404).json({ alert: "Document not found" });
    }
    const newData = await CourseDb.updateOne(
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

const getCategory = async (req, res) => {
  try {
    const categories = await CategoryDb.find();
    res.json({ categories, alert: "Successfully retrieved the data" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const purchaseCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { userid } = req.body;
    const user = await User.findOne({ _id: userid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateResult = await User.updateOne(
      { _id: userid },
      { $push: { courses: { courseId: id } } }
    );
    res
      .status(200)
      .json({ success: true, message: "Course purchased successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const enrollments = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.find({ _id: userId });
    const allCourseIds = new Set();
    userData.forEach((user) => {
      user.courses.forEach((course) => {
        allCourseIds.add(course.courseId);
      });
    });
    const coursesData = await CourseDb.find({
      _id: { $in: [...allCourseIds] },
    });
    const chapter = await ChapterDb.find();
    const tutors = await TutorDb.find({ is_Actived: "approved" });
    res
      .status(200)
      .json({ courses: coursesData, chapter, tutors, status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkout = async (req, res) => {
  try {
    const { courseid } = req.body;
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const courseData = await CourseDb.findById(courseid);
    if (!courseData) {
      return res.status(404).json({ error: "Course not found" });
    }
    const amountInPaise = courseData.price * 100;
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "inr",
    //         product_data: {
    //           name: "Course",
    //         },
    //         unit_amount: amountInPaise,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: "http://localhost:5173/success",
    //   cancel_url: "https://localhost:5173/cancel",
    // });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log(paymentIntent, "paymentIntent");
    return res.status(200).json({
      success: true,
      message: "client id passed to client",
      clientSecret: paymentIntent.client_secret,
      amountInPaise: amountInPaise,
    });

    // const payment=new PaymentDb({
    //   PaymentId:session.id,
    //   date:new Date(),
    //   Amount:session.amount_total,
    // courseName,
    // studentId,
    // tutorId,

    // })
    // res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const successPayment = async (req, res) => {
  try {
    console.log(req.body, "oeooeoeoeooe");
    const { data } = req.body;
    const { id, amount, date, userId, tutorId, courseId } = data;

    const user = await User.findOne({ email: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const courseExists = user.courses.some(
      (course) => course.courseId === courseId
    );
    console.log(courseExists, "courseExistscourseExists");
    if (courseExists) {
      console.log(courseExists);
      return res
        .status(201)
        .json({ message: "This course has already been purchased" });
    } else {
      const paymentData = new PaymentDb({
        PaymentId: id,
        studentId: userId,
        tutorId: tutorId,
        courseName: courseId,
        date: date,
        Amount: amount,
      });

      const saveData = await paymentData.save();

      await User.updateOne(
        { email: userId },
        { $push: { courses: { courseId: courseId } } }
      );

      return res
        .status(200)
        .json({
          success: true,
          message: "Course purchase successful",
          saveData,
        });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const courseRating = async (req, res) => {
  console.log(req.body, "oeoeoeoeoeoeoeoe");
  const { data } = req.body;
  const { newValue, courseId, userId } = data;

  try {
    const data = await CourseDb.findOne({ _id: courseId });
    const exist = data.ratings.find(
      (rating) => rating.postedby.toString() === userId.toString()
    );
    if (exist) {
      await CourseDb.updateOne(
        { _id: courseId, "ratings.postedby": userId },
        { $set: { "ratings.$.star": newValue } },
        { new: true }
      );
    } else {
      await CourseDb.findByIdAndUpdate(
        courseId,
        {
          $push: {
            ratings: {
              star: newValue,
              postedby: userId,
            },
          },
        },
        { new: true }
      );
    }
    const getallratings = await CourseDb.findById(courseId);
    const totalRating = getallratings.ratings.length;
    const ratingSum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = ratingSum / totalRating;
    console.log(actualRating, "actualRating");
    const finalRating = await CourseDb.findByIdAndUpdate(
      { _id: courseId },
      { totelrating: actualRating },
      { new: true }
    );
    console.log(finalRating, "finalRating");

    res.json(finalRating);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRating = async (req, res) => {
  try {
    console.log(req.params, "111111111111111111");

    const { id } = req.params;
    const courseId = String(id);
    console.log(id, "111111111111111111");

    const rating = await CourseDb.findOne({ _id: courseId });
    console.log(rating, "yourRating");
    res.json({ rating });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchPaymentDetailes=async(req,res)=>{
  try{
    const {id}=req.params;
    console.log(id,'sssssssssssssssss');
    const data=await PaymentDb.find({tutorId:id})
    res.json({data})


  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server error" });

  }
}
module.exports = {
  addCourse,
  getCourse,
  addChapter,
  getChapter,
  manageChapter,
  courseManage,
  getCategory,
  purchaseCourse,
  enrollments,
  checkout,
  courseRating,
  getRating,
  successPayment,
  fetchPaymentDetailes
};
