const mongoose = require("mongoose");

const groupChatSchema = mongoose.Schema(
  {
    groupName: { 
      type: String,
    },
    creator: { 
      type: String,
    },
    image:{
        type: String,
    },
    members: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    }]
  },
  {
    timestamps: true,
  }
);

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
module.exports = GroupChat;
