const express = require('express');
const adminRouter = express()
const adminController=require('../controllers/adminController')

adminRouter.post('/login',adminController.loadloagin)
adminRouter.post('/loadusers',adminController.loaduser)
adminRouter.post('/loadtutor',adminController.loadtutor)
adminRouter.put('/blockuser',adminController.blockuser)
adminRouter.put('/blocktutor',adminController.blocktutor)
adminRouter.put('/approvTutor',adminController.approveTutor)
adminRouter.post('/addCategory',adminController.addCategory)
adminRouter.get('/getCategory',adminController.loadCategory)
adminRouter.get('/getCourse',adminController.loadCourse)
adminRouter.put('/manageCourse',adminController.manageCourse)
adminRouter.get('/getCourse',adminController.getCourse)
adminRouter.put('/blockCourse',adminController.blockCourse)













module.exports=adminRouter;