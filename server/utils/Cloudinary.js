const cloudinary = require('cloudinary').v2;
const fs = require('fs');


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME_CLOUD ,
  api_key:process.env.API_KEY_CLOUD ,
  api_secret: process.env.API_SECRET_CLOUD
});



const uploadOnCloudinary = async (folderName, filePath) => {
  console.log("Uploading:", folderName, filePath);

  try {
    if (!filePath) return null;

    const response = await cloudinary.uploader.upload(filePath, {
      folder: `medease/${folderName}`, 
      resource_type: 'auto',
    });

    console.log("File uploaded on Cloudinary successfully 👌");
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};



module.exports = {uploadOnCloudinary}