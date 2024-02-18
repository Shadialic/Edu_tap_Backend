const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");

const { app,server } = require("./socket/socket");
// app.use(express.json())
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cookieParser());
 app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
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
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});








// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const cookieParser = require("cookie-parser");
// const path = require("path");

// const app = express();
// const { server, io } = require("./websocket/websocket");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // Middleware
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: "*",
//   })
// );

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const userRoutes = require("./routes/userRoutes");
// const vendorRoutes = require("./routes/vendorRotes");
// const adminRoutes = require("./routes/adminRouts");


// app.use("/", userRoutes);
// app.use("/vendor", vendorRoutes);
// app.use("/admin", adminRoutes);

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });