
// const http = require('http');
// const cors = require('cors');
// const socketIO = require('socket.io');
// const express = require('express');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ['GET', 'POST'],
//     }
// });

// app.use(cors());
// let users = [];

// io.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);

//     socket.on("message", data => {
//         console.log(data);
//         io.emit("messageResponse", data);
//     });

//     socket.on("typing", data => {
//         socket.broadcast.emit("typingResponse", data);
//     });

//     socket.on("newUser", data => {
//         users.push(data);
//         io.emit("newUserResponse", users);
//     });

//     socket.on('disconnect', () => {
//         console.log('🔥: A user disconnected');
//         users = users.filter(user => user.socketID !== socket.id);
//         io.emit("newUserResponse", users);
//         // No need to call socket.disconnect() here
//     });
// });

// module.exports = { server,app, io };
