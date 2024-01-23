const mongoose=require('mongoose');

const categorySchema=mongoose.Schema({
    categoryName:{
        type:String
    }
})
const Category=mongoose.model('Cotegoreas',categorySchema)
module.exports =Category