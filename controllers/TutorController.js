const Tutor = require("../models/tutorModel");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel");
const CourseDb = require("../models/courseModel");
const CategoryDb = require("../models/categoryModel");
const otpGenerator = require("otp-generator");
const { createSecretToken } = require("../utils/SecretToken");
const { uploadToCloudinary } = require("../utils/cloudinary");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addTutor = async (req, res) => {
  try {
    const { tutorName, email, password, phone, role } = req.body;
    const img = req.file.path;
    const data = await uploadToCloudinary(img, "course");
    if (!tutorName || !email || !password || !phone) {
      return res.status(403).json({
        status: false,
        alert: "All fields are required",
      });
    }
    const existingUser = await Tutor.findOne({ email: email });
    if (existingUser) {
      return res.json({
        alert: "email already exists",
        success: false,
        status: false,
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message,
        status: false,
      });
    }

    const newTutor = await Tutor.create({
      tutorName,
      email,
      phone,
      password: hashedPassword,
      role,
      image: data.url,
    });

    return res.status(201).json({
      success: true,
      alert: "please verify your mail",
      newTutor,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const result = await OTP.findOne({ otp: otp });
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
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const otp = req.body.otp.toString();
  try {
    const checkUserPresent = await OTP.findOne({ otp: otp });
    if (checkUserPresent) {
      const tutor = await Tutor.findOne({ email: checkUserPresent.email });
      return res.status(200).json({
        success: true,
        alert:
          "Tutor signup successful. Please wait for admin approval before logging in. ",
        tutor,
        status: true,
      });
    } else {
      return res.json({ status: false, alert: "wrong Otp" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await Tutor.findOne({ email: email });
    if (exist) {
      const compared = await bcrypt.compare(password, exist.password);
      if (exist.is_Actived === "approved") {
        if (exist.is_Block === "false") {
          if (compared) {
            const token = createSecretToken(exist._id);
            res.cookie("tutortoken", token, {
              withCredentials: true,
              httpOnly: false,
            });
            res.json({
              tutorData: exist,
              status: true,
              err: null,
              token,
              alert: "Tutor SignIn successfully Compleated",
            });
          } else {
            res.json({ alert: "Enter password is incorrect !" });
          }
        } else {
          res.json({ alert: "admin blocked you!" });
        }
      } else if (exist.is_Actived === "rejected") {
        res.json({ alert: "Admin rejected you" });
      } else if (exist.is_Actived === "pending") {
        res.json({ alert: "Please wait for admin approval before logging in" });
      }
    } else {
      return res.json({ alert: "Email not Exist !" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const gooleRegister = async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    const exist = await Tutor.findOne({ email: email });
    if (exist.is_Actived === "true") {
      if (exist) {
        return res.status(200).json({
          created: true,
          alert: "Google registration successful",
        });
      } else {
        const passwordHash = await securePassword(id);
        const GoogleTutor = new Tutor({
          tutorName: name,
          email,
          password: passwordHash,
          phone: phone || "0000000000",
        });
        const tutorData = await GoogleTutor.save();
        if (tutorData) {
          const token = createSecretToken(tutorData._id);
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
      }
    } else {
      res.json({ alert: "Please wait for admin approval before logging in" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCategory = async (req, res) => {
  try {
    const data = await CategoryDb.find();
    res.status(200).json({ newData: data });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const manageProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const tutorData = await Tutor.find({ email: email });
    res.json({ tutorData, alert: "sucsessfully get the data" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const img = req.file.path;
    const data = await uploadToCloudinary(img, "profile");
    const tutorData = await Tutor.findOneAndUpdate(
      { email: email },
      { $set: { image: data.url } },
      { new: true }
    );
    res.json({ tutorData, alert: "sucsessfully get the data" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCourse = async (req, res) => {
  try {
    const { author } = req.body;
    const course = await CourseDb.find({ auther: author });
    if (course) {
      res.status(200).json({ success: true, course });
    } else {
      res.status(404).json({ success: false, message: "Course not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const managecourse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CourseDb.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      return res.json({ result, alert: "Course canceled successfully." });
    } else {
      return res.status(404).json({ alert: "Course not found." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ alert: "An error occurred while canceling the course." });
  }
};

module.exports = {
  securePassword,
  addTutor,
  sendOTP,
  verifyOTP,
  verifyLogin,
  gooleRegister,
  getCategory,
  manageProfile,
  UpdateProfile,
  getCourse,
  managecourse,
};
