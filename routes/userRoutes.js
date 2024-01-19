const express = require('express');
const userRouter = express()
const userController=require('../controllers/userControllers')
const Auth=require('../middleware/AuthMiddleware')

userRouter.post('/signup',userController.adduser);
userRouter.post('/sendotp',userController.sendOTP);
userRouter.post('/verifyotp',userController.userverifyOTP);
userRouter.post('/login',userController.verifyLogin)
userRouter.post('/forgotPass',userController.forgotPass)
userRouter.post('/newPass',userController.passverifyOTP)
userRouter.put('/updateaPass',userController.updatePass)
userRouter.post('/userRegisterWithGoole',userController.googleRegister)






module.exports=userRouter;