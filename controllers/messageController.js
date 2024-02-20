const messageDb = require("../models/messageModel");
const { getRecipientSocketId, io } = require("../socket/socket");

const createMessage = async (req, res) => {
  try {
    const { data} = req.body;
    const { chatId, senderId, text ,recipientId} =data;
    const message = new messageDb({
      chatId,
      senderId,
      text,
    });
    const saveMeassage = await message.save();
    const recipientSocketId = getRecipientSocketId(recipientId)
    io.to(recipientSocketId).emit('newMessage',saveMeassage)
    res.status(200).json({
      saveMeassage,
      success: true,
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json(err);
  }
};

const getMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const message = await messageDb.find({ chatId });
    res.status(200).json({
      message,
      success: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
    createMessage,
    getMessage,
};
