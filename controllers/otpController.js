// const otpGenerator = require('otp-generator');
// const OTP = require('../models/otpModel');
// const Tutor = require('../models/userModel');

// exports.sendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     // Check if user is already present
//     const checkUserPresent = await Tutor.findOne({ email });
//     // If user found with provided email
//     if (checkUserPresent) {
//       return res.status(401).json({
//         success: false,
//         message: 'User is already registered',
//       });
//     }
//     let otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });
//     let result = await OTP.findOne({ otp: otp });
//     while (result) {
//       otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//       });
//       result = await OTP.findOne({ otp: otp });
//     }
//     const otpPayload = { email, otp };
//     const otpBody = await OTP.create(otpPayload);
//     res.status(200).json({
//       success: true,
//       message: 'OTP sent successfully',
//       otp,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };


// exports.verifyOTP = async (req, res) => {
//     try{

//         const { otp } = req.body;
//         // Check if user is already present
//         const checkUserPresent = await OTP.findOne({ otp: otp });
//         console.log(checkUserPresent,'=================<<<>>>>')
        
//     }catch(err){
//         console.log(err);
//     }

//       }