const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://www.malefashion.fun",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

let onlineUsers = [];

const getRecipientSocketId = (recipientId) => {
  const socket = onlineUsers.find((user) => user.userId === recipientId);
  return socket.socketId;
};
const getGroupSocketId = (recipientIdsArray) => {
  const socketIds = [];
  for (const recipientIds of recipientIdsArray) {
    if (Array.isArray(recipientIds)) {
      for (const recipientId of recipientIds) {
        const socket = onlineUsers.find(
          (user) => user.userId.toString() === recipientId.toString()
        );
        if (socket) {
          socketIds.push(socket.socketId);
        }
      }
    } else {
      const socket = onlineUsers.find(
        (user) => user.userId.toString() === recipientIds.toString()
      );
      if (socket) {
        socketIds.push(socket.socketId);
      }
    }
  }
  return socketIds;
};

io.on("connection", (socket) => {
  socket.on("addNewUser", (newUserId) => {
    if (!onlineUsers.some((user) => user.userId === newUserId)) {
      onlineUsers.push({ userId: newUserId, socketId: socket.id });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

module.exports = {
  app,
  server,
  getRecipientSocketId,
  getGroupSocketId,
  io,
};
