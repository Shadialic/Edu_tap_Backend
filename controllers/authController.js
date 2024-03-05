const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const { createSecretToken } = require("../utils/SecretToken");


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    return res.status(500).json({ err: "Internal server error" });
  }
};

const adduser = async (req, res) => {
  try {
    const { name, credential, phone, password } = req.body;
    const spassword = await securePassword(password);
    const exist = await User.findOne({ email: credential });
    if (exist) {
      res.json({ alert: "email already exists", status: false });
    } else {
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
    return res.status(500).json({ error: "Internal server error" });
  }
};

const googleRegister = async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;
    const data = await User.findOne({ email: email });
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

module.exports = {
  adduser,
  verifyLogin,
  sendOTP,
  userverifyOTP,
  forgotPass,
  passverifyOTP,
  updatePass,
  googleRegister,
};
