const express = require("express");
const userRouter = express();
const authController = require("../controllers/authController.js");
const profileController = require("../controllers/profileController.js");
const viewController = require("../controllers/viewController.js");
const Auth = require("../middleware/AuthMiddleware.js");
const upload = require("../middleware/multer.js");
const CourseController = require("../controllers/CourseController.js");
const {
  createChat,
  findUserChats,
  findChats,
  checkConnection
} = require("../controllers/chatController.js");
const {
  createMessage,
  getMessage,
} = require("../controllers/messageController.js");


//  Get
userRouter.get("/getUser", profileController.getUser);
userRouter.get("/manageProfile", profileController.manageProfile);
userRouter.get("/getCourse", CourseController.getCourse);
userRouter.get("/LoadCategory", CourseController.getCategory);
userRouter.get("/fetchReview",viewController.fetchReview);
userRouter.get("/findUserChats/:userId", findUserChats);
userRouter.get("/findChat/:firstId/:secondId", findChats);
userRouter.get("/getMeassage/:chatId", getMessage);
userRouter.get("/getCommnets/:id", viewController.getCommnets);
userRouter.get("/getRating/:id", CourseController.getRating);
userRouter.get("/getBlogs", viewController.getBlog);
userRouter.get("/checkUser/:id",authController.checkUser);

// Post
userRouter.post("/signup", authController.adduser);
userRouter.post("/sendotp", authController.sendOTP);
userRouter.post("/verifyotp", authController.userverifyOTP);
userRouter.post("/login", authController.verifyLogin);
userRouter.post("/forgotPass", authController.forgotPass);
userRouter.post("/newPass", authController.passverifyOTP);
userRouter.post("/updateuser", Auth, profileController.profileUpdate);
userRouter.post("/userRegisterWithGoole", authController.googleRegister);
userRouter.post("/updateProfile",upload.single("image"),profileController.UpdateProfile);
userRouter.post("/enrollments", CourseController.enrollments);
userRouter.post("/checkout", CourseController.checkout);
userRouter.post("/addReview", viewController.addReview);
userRouter.post("/createChat", createChat);
userRouter.post("/createMessage", createMessage);
userRouter.post("/postCommnets",viewController.postCommnets);
userRouter.post("/checkConnection",checkConnection);
userRouter.post("/success",CourseController.successPayment);
userRouter.post("/certificate",CourseController.certificateAdded);
userRouter.post("/createBlog",upload.single("image"),viewController.createBlog);

// Put
userRouter.put("/updateaPass", authController.updatePass);
userRouter.put("/purchaseCourse/:id", CourseController.purchaseCourse);
userRouter.put("/courseRating", CourseController.courseRating);


module.exports = userRouter;
