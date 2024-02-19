const {Server}=require('socket.io')
const http=require('http')
const express=require('express')
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",  // Allow requests from this origin
      methods: ["GET", "POST","PUT"],
      credentials: true,
    },
  });

  let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("addNewUser",(newUserId) => {
    if (!onlineUsers.some((user) => user.userId === newUserId)) {
        onlineUsers.push({userId:newUserId,socketId: socket.id});
    }
    console.log(onlineUsers,'llll');
    io.emit("getOnlineUsers",onlineUsers);
  });
    

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
  

  socket.on("sendMessage", (data) => {
    
    const { recipientId } = data;
    
    console.log(data,'sendMessagedata');

    console.log(recipientId,'recipientId');
    console.log(onlineUsers,'onlineUsers');

    const user = onlineUsers.find((u) => u.socketId === recipientId);


    console.log(user,"iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
      // io.to(user.socketId).emit("getNotification", {
      //   senderId:data.senderId,
      //   isRead:false,
      //   date:new Date()
      // });
    }
  });
 
});



module.exports ={ app,server };
