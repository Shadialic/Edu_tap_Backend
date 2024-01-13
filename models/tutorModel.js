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
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Tutor']
      },
      is_Actived:{
        type: String,
        default: false,

      }
    
});

const Tutor = mongoose.model('tutor', TutorSchema);
module.exports = Tutor;