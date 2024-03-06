const chatDb = require("../models/chatModel");
const GroupChatDb = require("../models/groupChatModel");
const { uploadToCloudinary } = require("../utils/cloudinary");
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
      active: true,
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
    const groupchat = await GroupChatDb.find({ members: { $in: [userId] } });
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
    const groupchat = await GroupChatDb.find({ creator: tutorId });
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
  const { id } = req.params;
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
const checkConnection = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;
    const chat = await chatDb.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      res.json({ status: true, chat });
    }
  } catch (err) {
    console.log(err);
  }
};

const createGroupChat = async (req, res) => {
  try {
    const { groupName, senderId, receiverIds } = req.body;
    const img = req.file.path;
    const data = await uploadToCloudinary(img, "chat");

    const exist = await GroupChatDb.find({ groupName: groupName });
    if (exist.length > 0) {
      return res.json({ alert: "group name already exist" });
    }
    const createGroup = await GroupChatDb({
      groupName: groupName,
      creator: senderId,
      image: data.url,
      members: [...receiverIds],
    });
    const saveData = await createGroup.save();
    res.json({ alert: "Group created successfully", data: saveData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChats,
  findTutorChats,
  techerStudents,
  checkConnection,
  createGroupChat,
};
