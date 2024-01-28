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
vendorRouter.post("/vendor/loadCourse",upload.single("image"),CourseController.addCourse)
vendorRouter.get('/vendor/getCategory',vendorController.getCategory)





module.exports=vendorRouter;

