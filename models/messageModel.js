const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Messages', messageSchema);
module.exports = Message;
