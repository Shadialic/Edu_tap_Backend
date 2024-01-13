const express=require('express');
const cors=require('cors')
const mongoose=require('mongoose')
const app=express();
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow credentials (cookies)
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Lumos_M', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userRoutes = require('./routes/userRoutes');
app.use('/',userRoutes)

const vendorRoutes=require('./routes/VendorRotes');
app.use('/vendor',vendorRoutes)

const adminRotes = require('./routes/adminRouts');
app.use('/admin', adminRotes);



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});



// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


