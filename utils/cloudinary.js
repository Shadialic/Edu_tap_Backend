const cloudinary = require("cloudinary").v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
});

const uploadToCloudinary = async (path, folder) => {
  try {
    const data = await cloudinary.uploader.upload(path, { folder });
    return { url: data.url, public_id: data.public_id };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const multiUploadCloudinary = async (files, folder) => {
  try {
    const uploadedImages = [];
    for (const file of files) {
      const { path } = file;
      const result = await uploadToCloudinary(path, folder);
      if (result.url) {
        uploadedImages.push(result.url);
      }
    }
    return uploadedImages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { uploadToCloudinary, multiUploadCloudinary };
