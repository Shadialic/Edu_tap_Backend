const express = require('express');
const otpController = require('../controllers/userControllers');
const router = express.Router();
router.post('/send-otp', otpController.sendOTP);
router.post('/verifyotp',otpController.verifyOTP);
module.exports = router;