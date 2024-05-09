const mongoose = require("mongoose");
const Notice = require("../models/notice");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

module.exports.sendNotice = async (req, res) => {
  try {
    const { title, content, div, branch, year, fileName } = req.body;
    let { img, file } = req.body;
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    if (file) {
      const path = __dirname + "/uploads/";
      const bufferData = Buffer.from(file.split(",")[1], "base64");
      // Check if the parent directory exists, if not, create it
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      // Write the file to the uploads directory
      fs.writeFile(path + fileName, bufferData, (err) => {
        if (err) {
          console.error("Error creating file:", err);
        } else {
          console.log("File saved");
        }
      });
    }
    const notice = new Notice({
      title,
      content,
      sender: req.user._id,
      img,
      div,
      branch,
      year,
      file: file ? fileName : null,
    });
    await notice.save();
    res.status(201).json({ success: "Notice sent successfully" });
  } catch (error) {
    console.log("Error in sendNotice : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find();
    res.status(200).json(notices);
  } catch (error) {
    console.log("Error in getNotices : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteNotice = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;

    // Find the notice by ID
    const notice = await Notice.findById(id);
    
    // Check if the user is the owner of the notice
    if (!notice || notice.sender.toString() !== userId.toString()) {
      return res.status(400).json({ error: "Unauthorized Access" });
    }

    // Delete uploaded image if it exists
    if (notice.img) {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(notice.img); // Assuming you can delete images from Cloudinary by URL
    }

    // Delete uploaded file if it exists
    if (notice.file) {
      const filePath = __dirname + "/uploads/" + notice.file;
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
      }
    }

    // Delete the notice from the database
    await Notice.findByIdAndDelete(id);

    res.status(200).json({ success: "Notice deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotice : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
