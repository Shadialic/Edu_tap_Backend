const mongoose=require('mongoose');

const categorySchema=mongoose.Schema({
    categoryName:{
        type:String
    },
    is_Block:{
        type:String,
        default:false
    }
})
const Category=mongoose.model('Cotegoreas',categorySchema)
module.exports =Category