const express = require('express');
const adminRouter = express()
const adminController=require('../controllers/adminController')

adminRouter.post('/login',adminController.loadloagin)
adminRouter.post('/loadusers',adminController.loaduser)
adminRouter.post('/loadtutor',adminController.loadtutor)
adminRouter.put('/blockuser',adminController.blockuser)






module.exports=adminRouter;