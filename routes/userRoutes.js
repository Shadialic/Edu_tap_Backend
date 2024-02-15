const express = require('express');
const userRouter = express()
const userController=require('../controllers/userController')
const Auth=require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const CourseController=require('../controllers/courseController')

userRouter.post('/signup',userController.adduser);
userRouter.post('/sendotp',userController.sendOTP);
userRouter.post('/verifyotp',userController.userverifyOTP);
userRouter.post('/login',userController.verifyLogin)
userRouter.post('/forgotPass',userController.forgotPass)
userRouter.post('/newPass',userController.passverifyOTP)
userRouter.put('/updateaPass',userController.updatePass)
userRouter.post('/userRegisterWithGoole',userController.googleRegister)
userRouter.get('/getUser',userController.getUser)
userRouter.post('/updateProfile', upload.single("image"), userController.UpdateProfile);
userRouter.get('/manageProfile',userController.manageProfile)
userRouter.get('/getCourse',CourseController.getCourse)
userRouter.post('/updateuser',Auth,userController.profileUpdate)
userRouter.get('/LoadCategory',userController.getCategory)
userRouter.put('/purchaseCourse/:id',Auth,userController.purchaseCourse)
userRouter.post('/enrollments',userController.enrollments)
userRouter.post('/checkout',userController.checkout)
userRouter.post('/addReview',userController.addReview)
userRouter.get('/fetchReview',userController.fetchReview)















module.exports=userRouter;