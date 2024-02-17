const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    members: {
        type: Array
    }
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
