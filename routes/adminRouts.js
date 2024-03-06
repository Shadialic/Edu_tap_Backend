const express = require('express');
const adminRouter = express()
const adminController=require('../controllers/adminController')

// Get
adminRouter.get('/loadtutor',adminController.loadtutor)
adminRouter.get('/getCategory',adminController.loadCategory)
adminRouter.get('/getCourse',adminController.getCourse)
adminRouter.get('/getCourse',adminController.loadCourse)
adminRouter.get('/loadOffer',adminController.loadOffer)
adminRouter.get('/fetchPaymentReport',adminController.fetchPaymentReport)
adminRouter.get('/getDashboardData',adminController.getDashboardData)

// Post
adminRouter.post('/login',adminController.loadloagin)
adminRouter.post('/loadusers',adminController.loaduser)
adminRouter.post('/postOffer',adminController.postOffer)
adminRouter.post('/addCategory',adminController.addCategory)

// Put
adminRouter.put('/blockuser/:id',adminController.blockuser)
adminRouter.put('/blocktutor',adminController.blocktutor)
adminRouter.put('/approvTutor',adminController.approveTutor)
adminRouter.put('/manageCourse',adminController.manageCourse)
adminRouter.put('/blockCourse',adminController.blockCourse)
adminRouter.put('/managecategory/:id',adminController.managecategory)



















module.exports=adminRouter;