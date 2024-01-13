const express =require('express');
const vendorRouter=express();
const vendorController=require('../controllers/TutorController');
const {uploadOptions}=require('../config/multer')

vendorRouter.post('/vendor/signup',vendorController.addTutor);
vendorRouter.post('/vendor/sendotp',vendorController.sendOTP);
vendorRouter.post('/vendor/verifyotp',vendorController.verifyOTP);
vendorRouter.post('/vendor/login',vendorController.verifyLogin)


module.exports=vendorRouter;

