const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");

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
      const users = new User({
        userName: name,
        email: credential,
        phone: phone,
        password: spassword,
      });
      const saveUserData = await users.save();
      return res.status(201).json({
        saveUserData,
        alert: "registration",
        status: true,
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
    console.log(email, "emailemail");
    console.log(req.body, "emailemail");

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
      return res.status(400).json({ success: false, alert: "wrong Otp" });
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
      const compared = await bcrypt.compare(password, exist.password);
      console.log(compared, "compared");

      if (compared) {
        if (exist.is_Active) {
          console.log("ooooo");
          const token = jwt.sign(
            { userId: exist._id },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );
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
        res.json({ alert: "Entered password is incorrect!" });
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


const updatePass=async(req,res)=>{
  try{
    const email = req.body.email; 
    const password = req.body.password;
    console.log(email,'888888');
    console.log(password,'11111111');

    
    const hashPass = await securePassword(password);
    const newData=await User.updateOne({ email: email }, { $set: { password: hashPass } });
    console.log(newData,'newData');

    res.status(200).json({
      status:200,
      newData,
      alert:'successfully compleated'
    })


  }catch(err){
    console.log(err);
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
  updatePass
};
