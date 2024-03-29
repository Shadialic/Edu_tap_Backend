const mongoose = require('mongoose');
const CourseSchema=new mongoose.Schema({
    title:{
        type:String
    },
    auther:{
        type:String,
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
    },
    is_varified:{
        type:String,
        default:false
    },
    is_Block:{
        type:String,
        default:false
    },
    is_Active:{
        type:String,
        default:false
    },
    ratings:[{
        star:Number,
        postedby:{
            type:mongoose.Schema.Types.ObjectId,ref:"Course"
        },

    }],
    totelrating:{
        type:String,
        default:0
    }
 
})
const Course=mongoose.model('Course',CourseSchema);
module.exports=Course;