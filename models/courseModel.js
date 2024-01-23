const mongoose = require('mongoose');
const CourseSchema=new mongoose.Schema({
    title:{
        type:String
    },
    payment:{
        type:String
    },
    level:{
        type:String
    },
    category:{
        type:String,
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    image:{
        type:String
    }
})
const Course=mongoose.model('Course',CourseSchema);
module.exports=Course;