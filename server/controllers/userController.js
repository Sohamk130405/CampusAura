const User = require("../models/user.js");
const Assignment = require("../models/assignment.js");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const {
  generateTokenAndSetCookie,
} = require("../utils/helpers/generateTokenAndSetCookie.js");
const Post = require("../models/post.js");
const Notification = require("../models/notification.js");

module.exports.getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query }).select("-password -updatedAt");
    } else {
      user = await User.findOne({ username: query }).select(
        "-password -updatedAt"
      );
    }

    if (!user) return res.status(400).json({ error: "User not found!" });
    // Convert user object to plain JavaScript object (removes circular references)
    const userObject = user.toObject();
    res.status(200).json(userObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getUserProfile: ", error.message);
  }
};

module.exports.signUpUser = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      prn,
      phone,
      branch,
      year,
      type,
      div,
    } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      prn,
      phone,
      branch,
      year,
      type,
      div,
    });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        prn: newUser.prn,
        phone: newUser.phone,
        branch: newUser.branch,
        year: newUser.year,
        type: newUser.type,
        linkedIn: newUser.linkedIn,
        div: newUser.div,
      });
    } else {
      res.status(400).json({ error: "Invalid User Credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in signUpUser: ", error.message);
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect User Credentials!" });
    }
    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
      prn: user.prn,
      phone: user.phone,
      branch: user.branch,
      year: user.year,
      type: user.type,
      linkedIn: user.linkedIn,
      div: user.div,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

module.exports.logoutUser = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in logoutUser: ", error.message);
  }
};

module.exports.followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself!" });
    }
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found!" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      res.status(200).json({ message: `You unfollowed ${userToModify.name}` });
    } else {
      // follow user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      const notification = new Notification({
        from: req.user._id,
        to: id,
        type: "follow",
      });
      await notification.save();
      res.status(200).json({ message: `You followed ${userToModify.name}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in followUnFollowUser: ", error.message);
  }
};

module.exports.updateUser = async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    bio,
    linkedIn,
    prn,
    phone,
    branch,
    year,
    div,
  } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(500).json({ message: "User not found!" });
    }
    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You can't modify profile of others" });
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (profilePic) {
      if (user.profilePic) {
        // delete old profile pic
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.linkedIn = linkedIn || user.linkedIn;
    user.profilePic = profilePic || user.profilePic;
    user.prn = prn || user.prn;
    user.phone = phone || user.phone;
    user.year = year || user.year;
    user.div = div || user.div;
    user.branch = branch || user.branch;
    user.isRejected = false;
    user = await user.save();
    user.password = null;

    await Post.updateMany(
      { "comments.userId": userId },
      {
        $set: {
          "comments.$[comment].username": user.username,
          "comments.$[comment].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "comment.userId": userId }] }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in UpdateUser: ", error.message);
  }
};

module.exports.getSuggestedUsers = async (req, res) => {
  try {
    //exclude current user from suggested ones
    const userId = req.user._id;
    const usersFollowedByYou = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
          type: { $ne: "admin" },
        },
      },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getSuggestedUsers: ", error.message);
  }
};

module.exports.freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    user.isFrozen = true;
    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getSuggestedUsers: ", error.message);
  }
};

module.exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    if (user.profilePic) {
      await cloudinary.uploader.destroy(
        user.profilePic.split("/").pop().split(".")[0]
      );
    }
    const posts = await Post.find({ postedBy: user._id });

    for (const post of posts) {
      if (post.img) {
        await cloudinary.uploader.destroy(
          post.img.split("/").pop().split(".")[0]
        );
      }
    }
    await Post.deleteMany({ postedBy: user._id });
    await User.findByIdAndDelete(user._id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in deleteAccount: ", error.message);
  }
};

module.exports.getUnverifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ isVerified: false, isRejected: false });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getUnverifiedUsers: ", error.message);
  }
};

module.exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    user.isVerified = true;
    await user.save();

    const notification = new Notification({
      from: req.user._id,
      to: req.params.id,
      type: "verify",
    });
    await notification.save();

    const assignments = await Assignment.find({
      div: user.div,
      branch: user.branch,
      year: user.year,
    });

    // Append the user to each assignment
    for (const assignment of assignments) {
      assignment.sendTo.push({ student: user._id, isSubmitted: false });
      await assignment.save();
    }

    res.status(200).json({ success: "User Verified Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in verifyUser: ", error.message);
  }
};

module.exports.rejectVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    user.isRejected = true;
    await user.save();
    const notification = new Notification({
      from: req.user._id,
      to: req.params.id,
      type: "reject",
    });
    await notification.save();
    res.status(200).json({ success: "User Rejected Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in rejectVerification: ", error.message);
  }
};
