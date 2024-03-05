const UserDb = require("../models/userModel");
const TutorDb = require("../models/tutorModel");
const Category = require("../models/categoryModel");
const CourseDb = require("../models/courseModel");
const OfferDb = require("../models/offerModel");
const PaymentDb = require("../models/paymentModle");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mailSender = require("../config/mailSender");

const loadloagin = async (req, res) => {
  try {
    const { credential, password } = req.body;
    const exist = await UserDb.findOne({ email: credential });
    if (exist) {
      if (exist.is_admin === "true") {
        const compared = await bcrypt.compare(password, exist.password);
        if (compared) {
          const admintoken = jwt.sign(
            {
              adminId: exist._id,
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res
            .status(200)
            .json({ loginData: exist, status: true, admintoken });
        } else {
          return res.status(401).json({ alert: "Entered password is wrong!" });
        }
      } else {
        return res.status(403).json({ alert: "Not a valid admin" });
      }
    } else {
      return res.json({ alert: "Email does not exist" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const loaduser = async (req, res) => {
  try {
    const userdata = await UserDb.find({ is_admin: false });
    if (userdata) {
      res.json({ userdata, status: true });
    } else {
      res.json({ userdata, status: false });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};

const loadtutor = async (req, res) => {
  try {
    const tutordata = await TutorDb.find();
    if (tutordata) {
      res.json({ tutordata, status: true });
    } else {
      res.json({ tutordata, status: false });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};

const blockuser = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await UserDb.findOne({ _id: objectId });
    if (user.is_Active == "true") {
      const newData = await UserDb.updateOne(
        { _id: objectId },
        { $set: { is_Active: false } }
      );
      res.json({
        newData,
        status: true,
        alert: `${user.userName} Blocked`,
      });
    } else {
      const newData = await UserDb.updateOne(
        { _id: objectId },
        { $set: { is_Active: true } }
      );
      res.json({
        newData,
        status: true,
        alert: `${user.userName} UnBlocked`,
      });
    }
  } catch (err) {
    res.status(500).json({ alert: "Internal Server Error" });
  }
};

const blocktutor = async (req, res) => {
  try {
    const id = req.body._id;
    const objectId = new mongoose.Types.ObjectId(id);
    const tutor = await TutorDb.findOne({ _id: objectId });
    if (tutor.is_Block === "false") {
      const newData = await TutorDb.updateOne(
        { _id: objectId },
        { $set: { is_Block: true } }
      );
      res.json({
        newData,
        status: true,
        alert: "blocked Tutor",
      });
    } else {
      const newData = await TutorDb.updateOne(
        { _id: objectId },
        { $set: { is_Block: false } }
      );
      res.json({
        newData,
        status: true,
        alert: "unBlocked Tutor",
      });
    }
  } catch (err) {
    res.status(500).json({ alert: "Internal Server Error" });
  }
};

const approveTutor = async (req, res) => {
  try {
    const { _id, data } = req.body;
    const objectId = new mongoose.Types.ObjectId(_id);
    const tutorData = await TutorDb.findById(objectId);
    if (tutorData) {
      if (data === "approved") {
        await TutorDb.updateOne({ _id: objectId }, { is_Actived: data });
        const mailSendResponse = await mailSender(
          tutorData.email,
          "Edu-tap - Tutor Request Update",
          `<h1>Dear ${tutorData.tutorName},</h1>
           <h1>Congratulations ${tutorData.tutorName}!</h1>
           <p>We are pleased to inform you that your tutor request has been approved by our administration team at Edu-tap. Welcome aboard!</p>
           <p>We believe in the valuable contributions you'll bring to our e-learning platform, and we are excited to have you as part of our community.</p>
           <p>Please log in to your Edu-tap account to explore the available features and start creating engaging educational content for our learners.</p>
           <p>If you have any questions or need assistance, feel free to reach out to our support team at edutapteam07@gmail.com.</p>
           <p>Once again, congratulations and thank you for choosing Edu-tap!</p>
           <p>Best regards,<br/>Edu-tap Team</p>`
        );
        res.status(200).json({ tutorData, alert: "approved tutor" });
      } else if (data === "rejected") {
        tutorData.is_Actived = "rejected";
        await tutorData.save();
        const mailSendResponse = await mailSender(
          tutorData.email,
          "Edu-tap - Tutor Request Update",
          `<h1>Dear ${tutorData.tutorName},</h1>
            <p>We appreciate your interest in joining Edu-tap as a tutor.</p>
            <p>After careful consideration, we regret to inform you that your tutor request has been declined by our administration team. We understand that this may be disappointing, and we want to assure you that the decision was not taken lightly.</p>
            <p>If you have any concerns or would like more information on why your request was declined, please feel free to reach out to our support team at edutapteam07@gmail.com.</p>
            <p>We value your contributions and hope that you consider applying again in the future. Thank you for your understanding.</p>
            <p>Best regards,<br/>Edu-tap Team</p>`
        );
        res.status(200).json({ tutorData, alert: "rejected tutor" });
      }
    } else {
      res.status(404).json({ error: "Tutor not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryname } = req.body;
    const exist = await Category.findOne({
      categoryName: { $regex: new RegExp(categoryname, "i") },
    });
    if (exist) {
      return res.json({ alert: "Category already exists" });
    } else {
      const newCategory = new Category({
        categoryName: categoryname,
      });
      const savedCategory = await newCategory.save();
      res.json({
        status: true,
        category: savedCategory,
        alert: "Category added successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};

const loadCategory = async (req, res) => {
  try {
    const data = await Category.find();
    res.json({ data });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};
const managecategory = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const exist = await Category.findOne({ _id: objectId });
    if (exist && exist.is_Block === "false") {
      const data = await Category.updateOne(
        { _id: objectId },
        { $set: { is_Block: true } }
      );
      return res.json({
        exist,
        data,
        alert: `${exist.categoryName} Category is UnBlocked`,
      });
    } else if (exist) {
      const data = await Category.updateOne(
        { _id: objectId },
        { $set: { is_Block: false } }
      );
      return res.json({
        exist,
        data,
        alert: `${exist.categoryName} Category is Blocked`,
      });
    } else {
      return res.json({ alert: "Category not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const loadCourse = async (req, res) => {
  try {
    const data = await CourseDb.find();
    res.json({ data });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};

const manageCourse = async (req, res) => {
  try {
    const id = req.body;
    const newData = await CourseDb.updateOne(
      { _id: id },
      { $set: { is_varified: true } }
    );
    res.json({
      data: newData,
      alert: "course approved successfully compleated",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};

const getCourse = async (req, res) => {
  try {
    const newData = await CourseDb.find();
    res.json({ data: newData, alert: "successfully compleated" });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: "Internal server error Lotta",
    });
  }
};

const blockCourse = async (req, res) => {
  try {
    const id = req.body;
    const course = await CourseDb.findOne({ _id: id });
    if (course.is_Block === "false") {
      const newData = await CourseDb.updateOne(
        { _id: id },
        { $set: { is_Block: true } }
      );
      res.json({ newData, alert: "course is Blocked" });
    } else {
      const newData = await CourseDb.updateOne(
        { _id: id },
        { $set: { is_Block: false } }
      );
      res.json({ newData, alert: "course is UnBlocked" });
    }
  } catch (err) {
    res.status(400).json({ alert: "intrnal server error" });
  }
};

const postOffer = async (req, res) => {
  try {
    const { category, percentage, startDate, expireDate } = req.body;

    const offer = new OfferDb({
      category: category,
      Percentage: percentage,
      startDate: startDate,
      ExpireDate: expireDate,
      status: true,
    });
    const savedOffer = await offer.save();
    console.log(offer, "offeroffer", savedOffer);
    res.json({ message: "Offer successfully added", data: savedOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loadOffer = async (req, res) => {
  try {
    const categories = await OfferDb.find();
    if (categories) {
      res.json({ categories, status: true });
    }
  } catch (err) {
    res.status(400).json({ alert: "intrnal server error" });
  }
};
const fetchPaymentReport = async (req, res) => {
  try {
    const data = await PaymentDb.find();
    res.json({ data });
  } catch (err) {
    res.status(400).json({ alert: "intrnal server error" });
  }
};
const getDashboardData = async (req, res) => {
  try {
    const userData = await UserDb.find();
    const tutorData = await TutorDb.find();
    const courseDb = await CourseDb.find();
    const payments = await PaymentDb.find();
    const user = userData.length;
    const tutor = tutorData.length;
    const course = courseDb.length;
    const amounts = payments.map((payment) => payment.Amount);
    console.log(payments, "payments");
    console.log(amounts, "amounts");
    
    let sum = 0; // Initialize sum variable
    for (let i = 0; i < amounts.length; i++) { // Fix syntax error in the loop
        sum += amounts[i];
    }
    
    const totalAmount = amounts.reduce((acc, curr) => acc + curr, 0);
    

    console.log(totalAmount, "totalAmount");

    console.log(sum, "dddddddddddd");
    res.json({ user, tutor, course, totalAmount });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  loadloagin,
  loaduser,
  loadtutor,
  blockuser,
  blocktutor,
  approveTutor,
  addCategory,
  loadCategory,
  loadCourse,
  manageCourse,
  getCourse,
  blockCourse,
  managecategory,
  postOffer,
  loadOffer,
  fetchPaymentReport,
  getDashboardData,
};
