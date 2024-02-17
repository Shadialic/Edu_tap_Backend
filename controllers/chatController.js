const chatDb = require("../models/chatModel");

const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;
    const chat = await chatDb.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }
    const newChat = new chatDb({
      members: [firstId, secondId],
    });
    const response = await newChat.save();
    return res.json({ response });
  } catch (err) {
    console.log(err);
    res.status(500).json("");
  }
};

const findUserChats = async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
      const chats = await chatDb.find({
        members: { $in: [userId] },
      }).populate({
        path: "members",
        select: "tutorName image",
        match: { _id: { $ne: userId } },
        model: "tutor",
      })
      res.status(200).json({
        chats: chats,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json("");
    }
  };
  

const findChats = async (req, res) => {
  const {firstId,secondId }= req.params;
  try {
    const chats = await chatDb.find({
        members: { $all: [firstId, secondId] },
    });
    res.status(200).json({
        chats: chats,
        success: true,
       
      });
  } catch (err) {
    console.log(err);
    res.status(500).json("");
  }
};

module.exports = {
    createChat,
    findUserChats,
    findChats

}
