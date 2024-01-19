const UserDb = require("../models/userModel");
const TutorDb = require("../models/tutorModel");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const loadloagin = async (req, res) => {
  try {
    const { credential, password } = req.body;
    console.log(req.body, "eq.body");
    const exist = await UserDb.findOne({ email: credential });
    console.log(exist, "exist");
    if (exist) {
      if (exist.is_admin) {
        const compared = await bycrypt.hash(password, exist.password);
        if (compared) {
          const admintoken = jwt.sign(
            {
              adminId: exist._id,
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );
          res.json({ loginData: exist, status: true, admintoken });
        } else {
          res.json({ alert: "Enterd email is wrong!" });
        }
      } else {
        res.json({ alert: "Not valid admin" });
      }
    } else {
      res.json({ alert: "Email is not existing" });
    }
  } catch (err) {
    console.log(err);
  }
};

const loaduser = async (req, res) => {
  try {
    const userdata = await UserDb.find({ is_admin: false });
    if (userdata) {
      res.json({ userdata, status: true });
    } else {
      res.json({ userdata, status: false });
    }
  } catch (err) {
    console.log(err);
  }
};

const loadtutor = async (req, res) => {
  try {
    const tutordata = await TutorDb.find();
    if (tutordata) {
      res.json({ tutordata, status: true });
    } else {
      res.json({ tutordata, status: false });
    }
  } catch (err) {
    console.log(err);
  }
};

const blockuser = async (req, res) => {
  try {
    let id = req.body._id;
    console.log(id, "id");

    // Convert the string id to ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Use the objectId to find the user
    let user = await UserDb.findOne({ _id: objectId });
    console.log(user, "@@@@@@@@@@@@@@@@");

    if (user.is_Active == "true") {
      const newData = await UserDb.updateOne(
        { _id: objectId },
        { $set: { is_Active: false } }
      );
      res.json({
        newData,
        status: true,
        alert: "User Blocked",
      });
    } else {
      const newData = await UserDb.updateOne(
        { _id: objectId },
        { $set: { is_Active: true } }
      );
      res.json({
        newData,
        status: true,
        alert: "Unblocked User",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ alert: "Internal Server Error" });
  }
};
const blocktutor = async (req, res) => {
  try {
    let id = req.body._id;
    console.log(id, "id");

    // Convert the string id to ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Use the objectId to find the user
    let tutor = await TutorDb.findOne({ _id: objectId });
    console.log(tutor, "@@@@@@@@@@@@@@@@");

    if (tutor.is_Actived == "true") {
      const newData = await TutorDb.updateOne(
        { _id: objectId },
        { $set: { is_Actived: false } }
      );
      res.json({
        newData,
        status: true,
        alert: "Tutor Blocked",
      });
    } else {
      const newData = await TutorDb.updateOne(
        { _id: objectId },
        { $set: { is_Actived: true } }
      );
      res.json({
        newData,
        status: true,
        alert: "Unblocked Tutor",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ alert: "Internal Server Error" });
  }
};
const approveTutor = async (req, res) => {
  try {
    let id = req.body._id;
    console.log(id,'ssa');
    const objectId = new mongoose.Types.ObjectId(id);
    console.log(objectId,'ssssssss');

    const tutorData = await TutorDb.findById({ _id:objectId });
    console.log(tutorData);
    if(tutorData){
      tutorData.is_Actived = "true";
      tutorData.save();
      console.log(tutorData,'after');
      res.status(200).json({ tutorData, alert: "approved tutor" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  loadloagin,
  loaduser,
  loadtutor,
  blockuser,
  blocktutor,
  approveTutor
};
