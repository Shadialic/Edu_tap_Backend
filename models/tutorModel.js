const mongoose = require('mongoose');

const TutorSchema = mongoose.Schema({
    tutorName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image:{
        type: String,
    },
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Tutor']
      },
      is_Actived:{
        type: String,
        default:'pending'
      },
      is_Block:{
        type:String,
        default:false
      }
    
});

const Tutor = mongoose.model('tutor', TutorSchema);
module.exports = Tutor;
