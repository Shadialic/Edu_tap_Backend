const User = require("../models/userModel");
const TutorDb=require('../models/tutorModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otpModel");
const CategoryDb = require("../models/categoryModel");
const CourseDb = require("../models/courseModel");
const otpGenerator = require("otp-generator");
const { createSecretToken } = require("../utils/SecretToken");
const { uploadToCloudinary } = require("../utils/cloudinary");
const ChapterDb = require("../models/videoModel");
const ReviewDb=require('../models/reviewModel')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    console.log(err.message);
  }
};

const adduser = async (req, res) => {
  try {
    const { name, credential, phone, password } = req.body;
    console.log(req.body);
    const spassword = await securePassword(password);
    const exist = await User.findOne({ email: credential });
    console.log(exist, "hhhhh");
    if (exist) {
      res.json({ alert: "email already exists", status: false });
    } else {
      console.log(exist, "hhhhh");

      const users = new User({
        userName: name,
        email: credential,
        phone: phone,
        password: spassword,
      });
      const saveUserData = await users.save();
      const token = createSecretToken(saveUserData._id);
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      return res.status(201).json({
        saveUserData,
        alert: "please verify your email",
        status: true,
        token,
      });
    }
  } catch (err) {
    res.status(400);
    console.log(err, "dddddd");
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      alert: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const userverifyOTP = async (req, res) => {
  try {
    const otp = req.body.otp.toString();
    const checkUserPresent = await OTP.findOne({ otp: otp });
    if (checkUserPresent) {
      const user = await User.findOne({ email: checkUserPresent.email });
      user.is_Active = true;
      user.save();
      console.log("User found:", user);
      return res.status(200).json({
        success: true,
        alert: "User Activated successfully",
        user,
        status: true,
      });
    } else {
      return res.json({ status: false, alert: "wrong Otp" });
    }
  } catch (error) {
    console.error("Error while checking for user:", error);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { credential, password } = req.body;
    const exist = await User.findOne({ email: credential });
    if (exist) {
      if (password && exist.password) {
        const compared = await bcrypt.compare(password, exist.password);
        if (compared) {
          if (exist.is_Active === "true") {
            if (exist.is_Active) {
              const token = createSecretToken(exist._id);
              res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
              });
              console.log(token, "uuu");
              res.json({
                userData: exist,
                status: true,
                err: null,
                token,
              });
            } else {
              res.json({ alert: "User account is not active." });
            }
          } else {
            res.json({ alert: "Admin Blocked You." });
          }
        } else {
          res.json({ alert: "Entered password is incorrect!" });
        }
      } else {
        res.json({ alert: "Password or existing password is undefined!" });
      }
    } else {
      res.json({ alert: "Email not found!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ alert: "Internal Server Error" });
  }
};

const forgotPass = async (req, res) => {
  try {
    let { email } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      res.status(400).json({ alert: "user not exist" });
      return;
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (err) {
    console.log(err);
  }
};

const passverifyOTP = async (req, res) => {
  try {
    const otp = req.body.otp.toString();
    const checkUserPresent = await OTP.findOne({ otp: otp });
    if (checkUserPresent) {
      const newuser = await User.findOne({ email: checkUserPresent.email });
      newuser.is_Active = true;
      newuser.save();
      console.log("User found:", newuser);
      return res.status(200).json({
        success: true,
        alert: "User Activated successfully",
        newuser,
        status: true,
      });
    } else {
      return res.status(400).json({ success: false, alert: "wrong Otp" });
    }
  } catch (error) {
    console.error("Error while checking for user:", error);
  }
};

const updatePass = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const hashPass = await securePassword(password);
    const newData = await User.updateOne(
      { email: email },
      { $set: { password: hashPass } }
    );
    res.status(200).json({
      status: 200,
      newData,
      alert: "successfully compleated",
    });
  } catch (err) {
    console.log(err);
  }
};

const googleRegister = async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    const data = await User.findOne({ email: email });
    console.log(req.body);
    if (!data) {
      const hashPassword = await securePassword(id);
      const googleUser = new User({
        userName: name,
        email,
        phone: phone || "000000000000",
        password: hashPassword,
        is_google: true,
        is_Active: true,
      });
      const userData = await googleUser.save();
      if (userData) {
        const token = createSecretToken(userData._id);
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: false,
        });
        if (token) {
          return res.status(200).json({
            created: true,
            alert: "Google registration successful",
            token,
          });
        }
      }
    } else {
      const token = createSecretToken(data._id);
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      if (token) {
        return res.status(200).json({
          created: true,
          alert: "Google registration successful",
          token,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const userData = await User.find();
    res.json({ userData, alert: "sucsessfully get the data" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const img = req.file.path;
    const data = await uploadToCloudinary(img, "profile");
    const userData = await User.findOneAndUpdate(
      { email: email },
      { $set: { image: data.url } },
      { new: true }
    );
    console.log(userData, "userData");
    res.json({ userData, alert: "sucsessfully get the data" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const manageProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const userData = await User.find({ email: email });
    res.json({ userData, alert: "sucsessfully get the data" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const profileUpdate = async (req, res) => {
  try {
    const { userName, phone, Country, email, Qualification, year, Institute } =
      req.body;
    if (!email) {
      return res.status(400).json({ alert: "Email is required" });
    }
    const updatedData = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          userName: userName,
          phone: phone,
          Country: Country,
          Qualification: Qualification,
          year: year,
          Institute: Institute,
        },
      },
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ updatedData, alert: "Your profile is updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
    console.log(id, "dssa", userid);

    const user = await User.findOne({ _id: userid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateResult = await User.updateOne(
      { _id: userid },
      { $push: { courses: { courseId: id } } }
    );

    console.log(updateResult, "-=-=-=-=-=-");

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
    console.log(req.body, "dsa", userId);

    const userData = await User.find({ _id: userId });
    console.log(userData, "ppp");

    const allCourseIds = new Set();

    userData.forEach((user) => {
      user.courses.forEach((course) => {
        allCourseIds.add(course.courseId);
      });
    });

    console.log([...allCourseIds], "allCourseIds");
    const coursesData = await CourseDb.find({
      _id: { $in: [...allCourseIds] },
    });
    const chapter = await ChapterDb.find();
    const tutors=await TutorDb.find({is_Actived:'approved'})
    console.log(tutors,'tutors');
    console.log(chapter, "coursesData");
    res.status(200).json({ courses: coursesData, chapter,tutors, status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const checkout = async (req, res) => {
  try {
    const { courseid } = req.body;
    const courseData = await CourseDb.findById(courseid);
    if (!courseData) {
      return res.status(404).json({ error: "Course not found" });
    }
    const amountInPaise = courseData.price *100; 
    console.log(courseData,'==============',amountInPaise);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Course', 
            },
            unit_amount: amountInPaise, 
          },
          quantity: 1, 
        },
      ],
      mode: 'payment',
      success_url: 'https://localhost:5173/success', 
      cancel_url: 'https://localhost:5173/cancel', 
    });
    console.log(session,'sessionsession');
    
    res.json({ sessionId: session.id }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addReview = async (req, res) => {
  try {
    const { data } = req.body;
const { review, userName, currntDate, courseId } = data;

    // const reviewDate = new Date(currntDate).toLocaleDateString();
    const newReview = new ReviewDb({
      description: review,
      author: userName,
      date: currntDate,
      courseId: courseId
    });
    const savedReview = await newReview.save();
    res.json({ message: 'Review successfully added', review: savedReview });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

const fetchReview=async(req,res)=>{
  try{
    const data= await ReviewDb.find();
    console.log(data,'lock');
    res.json({data})
  }catch(err){
    res.status(500).json({ error: "Internal server error" });

  }
}

module.exports = {
  adduser,
  securePassword,
  verifyLogin,
  sendOTP,
  userverifyOTP,
  forgotPass,
  passverifyOTP,
  updatePass,
  googleRegister,
  getUser,
  UpdateProfile,
  manageProfile,
  profileUpdate,
  getCategory,
  purchaseCourse,
  enrollments,
  checkout,
  addReview,
  fetchReview
};
