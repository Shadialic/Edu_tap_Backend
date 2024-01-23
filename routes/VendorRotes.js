const express =require('express');
const vendorRouter=express();
const vendorController=require('../controllers/TutorController');
const CourseController=require('../controllers/CourseController')
const {uploadImage} = require('../config/cloudinary');
vendorRouter.post('/vendor/signup', uploadImage.single('image'), vendorController.addTutor);
vendorRouter.post('/vendor/sendotp',vendorController.sendOTP);
vendorRouter.post('/vendor/verifyotp',vendorController.verifyOTP);
vendorRouter.post('/vendor/login',vendorController.verifyLogin)
vendorRouter.post('/vendor/tutorRegisterWithGoole',vendorController.gooleRegister)
vendorRouter.post('/vendor/loadCourse',uploadImage.single('image'),CourseController.addCourse)





module.exports=vendorRouter;

