const express = require("express");
const userRouter = express();
// const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const viewController = require("../controllers/viewController");

const Auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const CourseController = require("../controllers/courseController");
const {
  createChat,
  findUserChats,
  findChats,
  checkConnection
} = require("../controllers/chatController");
const {
  createMessage,
  getMessage,
} = require("../controllers/messageController");

userRouter.post("/signup", authController.adduser);
userRouter.post("/sendotp", authController.sendOTP);
userRouter.post("/verifyotp", authController.userverifyOTP);
userRouter.post("/login", authController.verifyLogin);
userRouter.post("/forgotPass", authController.forgotPass);
userRouter.post("/newPass", authController.passverifyOTP);
userRouter.put("/updateaPass", authController.updatePass);
userRouter.post("/userRegisterWithGoole", authController.googleRegister);
userRouter.get("/getUser", profileController.getUser);
userRouter.post("/updateProfile",upload.single("image"),profileController.UpdateProfile);

//  Get
userRouter.get("/manageProfile", profileController.manageProfile);
userRouter.get("/getCourse", CourseController.getCourse);
userRouter.get("/LoadCategory", CourseController.getCategory);
userRouter.get("/fetchReview",viewController.fetchReview);
userRouter.get("/findUserChats/:userId", findUserChats);
userRouter.get("/findChat/:firstId/:secondId", findChats);
userRouter.get("/getMeassage/:chatId", getMessage);
userRouter.get("/getCommnets/:id", viewController.getCommnets);
userRouter.get("/getRating/:id", CourseController.getRating);


// Post
userRouter.post("/updateuser", Auth, profileController.profileUpdate);
userRouter.post("/enrollments", CourseController.enrollments);
userRouter.post("/checkout", CourseController.checkout);
userRouter.post("/addReview", viewController.addReview);
userRouter.post("/createChat", createChat);
userRouter.post("/createMessage", createMessage);
userRouter.post("/postCommnets", viewController.postCommnets);
userRouter.post("/checkConnection",checkConnection);

userRouter.post("/createBlog",upload.single("image"),viewController.createBlog);


// Put
userRouter.put("/purchaseCourse/:id", Auth, CourseController.purchaseCourse);
userRouter.put("/courseRating", CourseController.courseRating);


module.exports = userRouter;
