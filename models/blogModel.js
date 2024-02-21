const mongoose=require('mongoose');

const blogSchema=mongoose.Schema({
    author:{
        type:String
    },
    image:{
        type:String
    },
    description:{
        type:String
    },
    date:{
        type:String
    },

   
})
const Blog=mongoose.model('Blog',blogSchema)
module.exports =Blog