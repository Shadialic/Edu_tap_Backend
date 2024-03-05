import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    reciever: {
      type: ObjectId,
      required: true,
    },
    sender: {
      type: ObjectId,
      required: true,
    },
    link: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
