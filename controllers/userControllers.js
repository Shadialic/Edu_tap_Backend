const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const { createSecretToken } = require("../utils/SecretToken");

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
  console.log(req.body.otp, "=======>>>checkkkkkkk================>>>>>");

  try {
    const otp = req.body.otp.toString();

    // Check if user is already present
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
      // Handle the case where the user is found
    } else {
      console.log("User not found");
      // Handle the case where the user is not found
      return res.json({ status: false, alert: "wrong Otp" });
    }
  } catch (error) {
    console.error("Error while checking for user:", error);
    // Handle the error appropriately
  }
};

const verifyLogin = async (req, res) => {
  try {
    const { credential, password } = req.body;
    console.log(req.body, "llllll");
    const exist = await User.findOne({ email: credential });
    console.log(exist, "exist");

    if (exist) {
      // Check if both `password` and `exist.password` are defined
      if (password && exist.password) {
        const compared = await bcrypt.compare(password, exist.password);
        console.log(compared, "compared");

        if (compared) {
          console.log(typeof exist.is_Active, "ppp");
          console.log(exist.is_Active, "ppp");

          // Check if exist.is_Active is a boolean
          if (exist.is_Active == "true") {
            if (exist.is_Active) {
              console.log("ooooo");

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
            // Handle the case where exist.is_Active is not a boolean
            res.json({ alert: "Invalid is_Active value." });
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

    console.log(email, "userMail");
    const userExists = await User.findOne({ email });
    console.log(userExists, "userMail");
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
  console.log(req.body.otp, "=======>>>checkkkkkkk================>>>>>");

  try {
    const otp = req.body.otp.toString();

    // Check if user is already present
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
      // Handle the case where the user is found
    } else {
      console.log("User not found");
      // Handle the case where the user is not found
      return res.status(400).json({ success: false, alert: "wrong Otp" });
    }
  } catch (error) {
    console.error("Error while checking for user:", error);
    // Handle the error appropriately
  }
};

const updatePass = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, "888888");
    console.log(password, "11111111");

    const hashPass = await securePassword(password);
    const newData = await User.updateOne(
      { email: email },
      { $set: { password: hashPass } }
    );
    console.log(newData, "newData");

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
    console.log(req.body);
    // Assuming securePassword returns a Promise
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

    console.log(userData, "User registered");

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
  } catch (err) {
    console.error(err);
    // Handle errors and return an appropriate response to the client
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
};
