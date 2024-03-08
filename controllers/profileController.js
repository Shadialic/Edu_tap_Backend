const User = require("../models/userModel.js");
const { uploadToCloudinary } = require("../utils/cloudinary.js");

const getUser = async (req, res) => {
  try {
    const userData = await User.find();
    res.json({ userData, alert: "sucsessfully get the data" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const img = req.file.path;
    const data = await uploadToCloudinary(img, "profile");
    const userData = await User.findOneAndUpdate(
      { email: email },
      { $set: { image: data.url } },
      { new: true }
    );

    res.json({ userData, alert: "sucsessfully get the data" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const manageProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const userData = await User.find({ email: email });
    res.json({ userData, alert: "sucsessfully get the data" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const profileUpdate = async (req, res) => {
  try {
    const { userName, phone, Country, email, Qualification, year, Institute } =
      req.body;
    if (!email) {
      return res.status(400).json({ alert: "Email is required" });
    }
    const updatedData = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          userName: userName,
          phone: phone,
          Country: Country,
          Qualification: Qualification,
          year: year,
          Institute: Institute,
        },
      },
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ updatedData, alert: "Your profile is updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  UpdateProfile,
  manageProfile,
  profileUpdate,
};
