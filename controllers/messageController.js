const messageDb = require("../models/messageModel");

const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const message = new messageDb({
      chatId,
      senderId,
      text,
    });
    const saveMeassage = await message.save();
    res.status(200).json({
      saveMeassage,
      success: true,
    });
  } catch (err) {
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
