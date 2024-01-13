const Tutor = require("../models/tutorModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");

// const OTPGen=require('../controllers/otpController')

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    console.log(err);
  }
};

const addTutor = async (req, res) => {
  try {
    // const { tutorName, email, phone, password } = req.body;
    // const spassword = await securePassword(password);
    // const exist = await Tutor.findOne({ email: email });
    // if (exist) {
    //   res.json({ alert: "Email Already Exist", status: false });
    // } else {
    //   const Tutors = new Tutor({
    //     tutorName: tutorName,
    //     email: email,
    //     password: spassword,
    //     phone: phone,
    //   });

    //   const saveTutorData = await Tutors.save();
    //   const token = jwt.sign(
    //     {
    //       tutoId: saveTutorData._id,
    //     },
    //     process.env.JWT_SECRET_KEY,
    //     { expiresIn: "1h" }
    //   );

    //   res.json({
    //     token,
    //     saveTutorData,
    //     status: true,
    //     alert: "registration",
    //   });
    // }
    const { tutorName, email, password, phone, role, otp } = req.body;

    console.log(req.body, "lll");
    // Check if all details are provided
    if (!tutorName || !email || !password || !phone) {
      return res.status(403).json({
        status: false,
        alert: "All fields are required",
      });
    }
    // Check if user already exists
    const existingUser = await Tutor.findOne({ email: email });
    console.log(existingUser, "existingUser");
    if (existingUser) {
      res.json({
        alert: "email already exists",
        success: false,
        status: false,
      });
    }

    // Secure password
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
    });

    return res.status(201).json({
      success: true,
      alert: "please verify your mail",
      newTutor,
      status: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
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
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
const verifyOTP = async (req, res) => {
  console.log(req.body.otp, "=======>>>000000================>>>>>");

  const otp = req.body.otp.toString();
  try {
    // Check if user is already present
    const checkUserPresent = await OTP.findOne({ otp: otp });
    console.log(checkUserPresent, "checkUserPresent");

    if (checkUserPresent) {
      const tutor = await Tutor.findOne({ email: checkUserPresent.email });
      console.log(tutor, "tutor");
      tutor.is_Actived = true;
      tutor.save();

      return res.status(200).json({
        success: true,
        alert: "User Activated successfully",
        tutor,
        status: true,
      });
    } else {
      console.log("User not found");
      return res.status(400).json({ success: false, alert: "wrong Otp" });
    }
  } catch (error) {
    console.error("Error while checking for user:", error);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, "llllll");
    const exist = await User.findOne({ email: email });
    if (exist) {
      const compared = await bcrypt.compare(password, exist.password);
      if (is_Actived == true) {
        if (compared) {
          let token = jwt.sign(
            { userId: exist._id },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );
          res.json({
            tutorData: exist,
            status: true,
            err: null,
            token,
          });
        } else {
          res.json({ alert: "Enter password is incorrect !" });
        }
      }
    } else {
      res.json({ alert: "Email not Exist !" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  securePassword,
  addTutor,
  sendOTP,
  verifyOTP,
  verifyLogin,
};
