const express =require('express');
const vendorRouter=express();
const vendorController=require('../controllers/tutorController');
const CourseController=require('../controllers/courseController')
const upload=require('../middleware/multer')
const {findTutorChats,techerStudents,createGroupChat}=require('../controllers/chatController')

// Get
vendorRouter.get('/vendor/getCategory',vendorController.getCategory)
vendorRouter.get('/vendor/manageProfile',vendorController.manageProfile)
vendorRouter.get('/vendor/getChapter',CourseController.getChapter);
vendorRouter.get('/teacherUsers/:id',techerStudents);
vendorRouter.get('/fetchPaymentDetailes/:id',CourseController.fetchPaymentDetailes);
vendorRouter.get("/findTutorChats/:tutorId", findTutorChats);
vendorRouter.get("/chekingTutor/:id",vendorController.chekingTutor);


// Post
vendorRouter.post('/vendor/signup',upload.single("image"),vendorController.addTutor);
vendorRouter.post('/vendor/sendotp',vendorController.sendOTP);
vendorRouter.post('/vendor/verifyotp',vendorController.verifyOTP);
vendorRouter.post('/vendor/login',vendorController.verifyLogin)
vendorRouter.post('/vendor/tutorRegisterWithGoole',vendorController.gooleRegister)
vendorRouter.post("/vendor/loadCourse",CourseController.addCourse)
vendorRouter.post('/vendor/updateProfile', upload.single("image"), vendorController.UpdateProfile);
vendorRouter.post('/vendor/getcoures',vendorController.getCourse)
vendorRouter.post('/vendor/addChapter/:id',CourseController.addChapter);
vendorRouter.post('/createGroupChat', upload.single("image"), createGroupChat);

// Put

vendorRouter.put('/vendor/manageCourse/:id',vendorController.managecourse)
vendorRouter.put('/vendor/blockunblcoCourse/:id',CourseController.courseManage);
vendorRouter.put('/vendor/manageChapter/:id',CourseController.manageChapter);
















module.exports=vendorRouter;

