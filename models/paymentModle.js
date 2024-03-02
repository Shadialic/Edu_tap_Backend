const mongoose = require('mongoose');

const PaymentSchema =new mongoose.Schema({
    PaymentId: {
        type: String
    },
    Amount: {
        type:Number
    },
    date: {
        type: String
    },
    tutorId: {
        type: String
    },
    studentId: {
        type: String
    },
    courseName: {
        type: String
    },
    success: {
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
