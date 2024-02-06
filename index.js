const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const { server, io } = require("./websocket/websocket");
// Middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "*",
  })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRotes");
const adminRoutes = require("./routes/adminRouts");

app.use("/", userRoutes);
app.use("/vendor", vendorRoutes);
app.use("/admin", adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const cookieParser = require('cookie-parser');
// const path = require('path');

// // const app = express();
// const { server, app, io } = require('./websocket/websocket');

// // Middleware
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Use cors middleware with specific methods
// app.use(
//     cors({
//         origin: 'http://localhost:5173',
//         credentials: true,
//         methods: ['GET', 'POST'],
//     })
// );

// // Attach WebSocket server to the Express app
// server.on('request', app);

// // Routes
// const userRoutes = require('./routes/userRoutes');
// const vendorRoutes = require('./routes/VendorRotes');
// const adminRoutes = require('./routes/adminRouts');

// app.use('/', userRoutes);
// app.use('/vendor', vendorRoutes);
// app.use('/admin', adminRoutes);

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     return res.status(500).send('Something went wrong!');
// });

// // Start the server
// const port = process.env.PORT || 3000;

// // Connect to MongoDB using mongoose if needed
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// });
