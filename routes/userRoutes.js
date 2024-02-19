const express = require("express");
const userRouter = express();
const userController = require("../controllers/userController");
const Auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const CourseController = require("../controllers/courseController");
const {
  createChat,
  findUserChats,
  findChats,
} = require("../controllers/chatController");
const {
createMessage,
  getMessage,
} = require("../controllers/messageController");
userRouter.post("/signup", userController.adduser);
userRouter.post("/sendotp", userController.sendOTP);
userRouter.post("/verifyotp", userController.userverifyOTP);
userRouter.post("/login", userController.verifyLogin);
userRouter.post("/forgotPass", userController.forgotPass);
userRouter.post("/newPass", userController.passverifyOTP);
userRouter.put("/updateaPass", userController.updatePass);
userRouter.post("/userRegisterWithGoole", userController.googleRegister);
userRouter.get("/getUser", userController.getUser);
userRouter.post(
  "/updateProfile",
  upload.single("image"),
  userController.UpdateProfile
);

//  Get
userRouter.get("/manageProfile", userController.manageProfile);
userRouter.get("/getCourse", CourseController.getCourse);
userRouter.get("/LoadCategory", userController.getCategory);
userRouter.get("/fetchReview", userController.fetchReview);
userRouter.get("/findUserChats/:userId", findUserChats);
userRouter.get("/findChat/:firstId/:secondId", findChats);
userRouter.get("/getMeassage/:chatId", getMessage);
userRouter.get("/getCommnets/:id",userController.getCommnets);


// Post
userRouter.post("/updateuser", Auth, userController.profileUpdate);
userRouter.post("/enrollments", userController.enrollments);
userRouter.post("/checkout", userController.checkout);
userRouter.post("/addReview", userController.addReview);
userRouter.post("/createChat", createChat);
userRouter.post("/createMessage", createMessage);
userRouter.post("/postCommnets", userController.postCommnets);



// Put
userRouter.put("/purchaseCourse/:id", Auth, userController.purchaseCourse);



module.exports = userRouter;
