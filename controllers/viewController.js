const User = require("../models/userModel");
const { uploadToCloudinary } = require("../utils/cloudinary");
const ReviewDb = require("../models/reviewModel");
const chatDb = require("../models/chatModel");
const blogDb = require("../models/blogModel");
const CommnetDb = require("../models/commentModel");
const { getComments } = require("../socket/socket");


const addReview = async (req, res) => {
    try {
      const { data } = req.body;
      const { review, userName, currntDate, courseId } = data;
      const newReview = new ReviewDb({
        description: review,
        author: userName,
        date: currntDate,
        courseId: courseId,
      });
      const savedReview = await newReview.save();
      res.json({ message: "Review successfully added", review: savedReview });
    } catch (err) {
      res.status(500).json({ error: "Failed to add review" });
    }
  };
  
  const fetchReview = async (req, res) => {
    try {
      const data = await ReviewDb.find();
      const chat = await chatDb.find();
      res.json({ data, chat });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const postCommnets = async (req, res) => {
    const { data } = req.body;
    const { comment, auther, Date, chapterId, Image } = data;
    try {
      const comments = new CommnetDb({
        comment: comment,
        auther: auther,
        Date: Date,
        chapterId: chapterId,
        Image: Image,
      });
      const saveComment = await comments.save();
      const users = await User.find({}, '_id'); 
      const userIds = users.map(user => user._id);
      console.log(userIds,'userIds');
      const recipientSocketId = getComments(userIds);
      io.to(recipientSocketId).emit("newComment", saveComment);
      res.json({ status: true, saveComment });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const getCommnets = async (req, res) => {
    const { id } = req.params;
    try {
      const comments = await CommnetDb.find({ chapterId: id });
      res.json({ comments, status: true });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const createBlog = async (req, res) => {
    const {title, author, description, date } = req.body;
    try {
      // console.log(req.body,'req.body');
      const img = req.file.path;
      const data = await uploadToCloudinary(img, "blog");
       console.log(data,'data');
  
      const user = await User.findOne({_id:author });
      console.log(user,'user');
  
      if (user) {
        const blodData = new blogDb({
          title,
          author,
          description,
          date,
          image: data.url,
          authorProfile:user,
          authorName:user.userName
        });
        const blog = await blodData.save();
        console.log(blog,'---==--==--===-===-');
        res
          .status(200)
          .json({ status: true, alert: "successfully created", blog, user });
      }
    } catch (err) {
      console.log(err,'ppppppppppppppp');
      res.status(500).json({ error: "Internal server error" });
    }
  };
  const getBlog=async(req,res)=>{
    try{
      const blogs=await blogDb.find();
      // console.log(blogs,'blogsblogs');
      res.json({blogs})

    }catch(err){
      console.log(err);
    }
  }

  module.exports={
    addReview,
  fetchReview,
  postCommnets,
  getCommnets,
  createBlog,
  getBlog
  }