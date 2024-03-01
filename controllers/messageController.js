const messageDb = require("../models/messageModel");
const { getRecipientSocketId,getGroupSocketId, io } = require("../socket/socket");
const GroupChatDb=require('../models/groupChatModel');

const createMessage = async (req, res) => {
  try {
    const { data } = req.body;
    console.log(data,'-=');
    const { chatId, senderId, text, recipientId,groupChat,isGroupChat,userName,userImage} = data;
    const message = new messageDb({
      chatId,
      senderId,
      text,
      userName,
      userImage,
      isGroupChat
    });
    const saveMeassage = await message.save();
    if(isGroupChat){
      const data = await GroupChatDb.find({_id: groupChat});
      console.log(data,'-------data');

      const membersAndCreatorsArray = data.flatMap(item => [item.members.map(member => member.toString()), item.creator.toString()]);

      const recipientSocketId = getGroupSocketId(membersAndCreatorsArray);
      io.to(recipientSocketId).emit("newMessage", saveMeassage);
    }else{
      const recipientSocketId = getRecipientSocketId(recipientId);
      io.to(recipientSocketId).emit("newMessage", saveMeassage);
    }
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
