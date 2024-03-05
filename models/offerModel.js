const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({ 
    category: {
        type: String,
    },
   Percentage: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    ExpireDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'Active',
    },
});

offerSchema.pre('save', function (next) {
    const currentDate = new Date();
    if (this.endDate <= currentDate) {
        this.status = 'Expired';
    }
    next();
});
module.exports = mongoose.model('Offer', offerSchema);
