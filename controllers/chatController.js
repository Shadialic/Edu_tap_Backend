const chatDb = require("../models/chatModel");
const GroupChatDb=require('../models/groupChatModel');
const { uploadToCloudinary } = require("../utils/cloudinary");
const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;
    const chat = await chatDb.findOne({
      members: { $all: [firstId, secondId] },
    });
    console.log();
    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = new chatDb({
      members: [firstId, secondId],
      active:true
    });
    console.log(newChat,'llllllllllllllllllllll');
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
    const chats = await chatDb
      .find({
        members: { $in: [userId] },
      })
      .populate({
        path: "members",
        select: "tutorName image",
        match: { _id: { $ne: userId } },
        model: "tutor",
      });
      const groupchat=await GroupChatDb.find({members:{$in:[userId]}})
      console.log(groupchat,'groupchat');
    res.status(200).json({
      chats: chats,
      groupchat,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("");
  }
};
const findTutorChats = async (req, res) => {
  const tutorId = req.params.tutorId;
  console.log(tutorId, "llllllllllllllll");
  try {
    const chats = await chatDb
      .find({
        members: { $in: [tutorId] },
      })
      .populate({
        path: "members",
        select: "userName image",
        match: { _id: { $ne: tutorId } },
        model: "User",
      });
    console.log(chats, "chatschats");
    const groupchat=await GroupChatDb.find({creator:tutorId})
    console.log(groupchat,'groupchat');
    res.status(200).json({
      chats: chats,
      groupchat,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("");
  }
};
const techerStudents = async (req, res) => {
  const {id} = req.params;
  console.log(id, "llllllllllllllll");
  try {
    const chats = await chatDb
      .find({
        members: { $in: [id] },
      })
      .populate({
        path: "members",
        select: "userName email image",
        match: { _id: { $ne: id } },
        model: "User",
      });
    console.log(chats, "chatschats");
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
  const { firstId, secondId } = req.params;
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
const checkConnection=async(req,res)=>{
  try{
    const { firstId, secondId } = req.body;
    const chat = await chatDb.findOne({
      members: { $all: [firstId, secondId] },
    });
    console.log(chat,'===============');
    if(chat){

      res.json({status:true,chat})
    }

  }catch(err){

    console.log(err);
  }
}

const createGroupChat = async (req, res) => {
  try {
    console.log(req.body, '================================');
    const { groupName, senderId,  receiverIds } = req.body;
    const img = req.file.path;
    console.log(img,'img');
    const data = await uploadToCloudinary(img, "chat");
    console.log(groupName, senderId, '=groupName,senderId,groupName========', receiverIds);

    console.log(data, 'data');
    const exist = await GroupChatDb.find({ groupName: groupName });
    console.log(exist, 'exist');
    if (exist.length > 0) {
      return res.json({ alert: 'group name already exist' });
    }
    const createGroup = await GroupChatDb({
      groupName: groupName,
      creator: senderId,
      image:data.url,
      members: [... receiverIds], 
    });
    console.log(createGroup, 'createGroup');
    const saveData = await createGroup.save();
    console.log(saveData, 'saveData');
    res.json({ alert: 'Group created successfully', data: saveData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = {
  createChat,
  findUserChats,
  findChats,
  findTutorChats,
  techerStudents,
  checkConnection,
  createGroupChat
};
