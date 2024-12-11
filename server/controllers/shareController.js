const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Share = require("../models/share");
const User = require("../models/user");

module.exports.postShare = async (req, res) => {
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
    const share = new Share({
      title,
      content,
      sender: req.user._id,
      img,
      div,
      branch,
      year,
      file: file ? fileName : null,
    });
    await share.save();
    res.status(201).json({ success: "Share post successfully" });
  } catch (error) {
    console.log("Error in postShare : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getShares = async (req, res) => {
  try {
    const { div, branch, year } = req.params;
    const shares = await Share.find({ div, branch, year }).populate({
      path: "sender",
      select: "username name profilePic",
    });
    res.status(200).json(shares);
  } catch (error) {
    console.log("Error in getShares : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteShare = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;

    // Find the notice by ID
    const share = await Share.findById(id);

    // Check if the user is the owner of the notice
    if (!share || share.sender.toString() !== userId.toString()) {
      return res.status(400).json({ error: "Unauthorized Access" });
    }

    // Delete uploaded image if it exists
    if (share.img) {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(share.img); // Assuming you can delete images from Cloudinary by URL
    }

    // Delete uploaded file if it exists
    if (share.file) {
      const filePath = __dirname + "/uploads/" + share.file;
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
      }
    }

    // Delete the notice from the database
    await Share.findByIdAndDelete(id);

    res.status(200).json({ success: "Notice deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotice : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
