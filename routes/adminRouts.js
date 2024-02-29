const express = require('express');
const adminRouter = express()
const adminController=require('../controllers/adminController')

adminRouter.post('/login',adminController.loadloagin)
adminRouter.post('/loadusers',adminController.loaduser)
adminRouter.get('/loadtutor',adminController.loadtutor)
adminRouter.put('/blockuser/:id',adminController.blockuser)
adminRouter.put('/blocktutor',adminController.blocktutor)
adminRouter.put('/approvTutor',adminController.approveTutor)
adminRouter.post('/addCategory',adminController.addCategory)
adminRouter.get('/getCategory',adminController.loadCategory)
adminRouter.get('/getCourse',adminController.loadCourse)
adminRouter.put('/manageCourse',adminController.manageCourse)
adminRouter.get('/getCourse',adminController.getCourse)
adminRouter.put('/blockCourse',adminController.blockCourse)
adminRouter.put('/managecategory/:id',adminController.managecategory)
adminRouter.post('/postOffer',adminController.postOffer)
adminRouter.get('/loadOffer',adminController.loadOffer)
















module.exports=adminRouter;