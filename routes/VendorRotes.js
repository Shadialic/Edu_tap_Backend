const express =require('express');
const vendorRouter=express();
const vendorController=require('../controllers/TutorController');
const CourseController=require('../controllers/CourseController')
// const {uploadImage} = require('../config/cloudinary');
const upload=require('../middleware/multer')

vendorRouter.post('/vendor/signup',upload.single("image"),vendorController.addTutor);
vendorRouter.post('/vendor/sendotp',vendorController.sendOTP);
vendorRouter.post('/vendor/verifyotp',vendorController.verifyOTP);
vendorRouter.post('/vendor/login',vendorController.verifyLogin)
vendorRouter.post('/vendor/tutorRegisterWithGoole',vendorController.gooleRegister)
vendorRouter.post("/vendor/loadCourse",CourseController.addCourse)
vendorRouter.get('/vendor/getCategory',vendorController.getCategory)
vendorRouter.get('/vendor/manageProfile',vendorController.manageProfile)
vendorRouter.post('/vendor/updateProfile', upload.single("image"), vendorController.UpdateProfile);






module.exports=vendorRouter;

