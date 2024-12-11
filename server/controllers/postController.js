const Notification = require("../models/notification.js");
const Post = require("../models/post.js");
const User = require("../models/user.js");
const cloudinary = require("cloudinary").v2;

module.exports.createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and text fileds are required!" });
    }
    const user = await User.findById(postedBy);
    if (!user) return res.status(400).json({ error: "User not found!" });
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ messsage: "Unauthorised to create post!" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters!` });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      postedBy,
      text,
      img,
    });
    await newPost.save();
    for (const follower of user.followers) {
      const notification = new Notification({
        from: user._id,
        to: follower,
        type: "new-post",
      });
      await notification.save();
    }
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in createPost: ", error);
  }
};

module.exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getPost: ", error);
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ messsage: "Unauthorised to delete this post!" });
    }

    if (post.img) {
      // delete image post
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in deletePost: ", error);
  }
};

module.exports.likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully!" });
    } else {
      post.likes.push(userId);
      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.postedBy,
        type: "like",
      });
      await notification.save();
      res.status(200).json({ message: "Post liked successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in likeUnlikePost: ", error);
  }
};

module.exports.commentToPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Comment is empty!" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    const comment = { userId, text, userProfilePic, username };
    post.comments.push(comment);
    await post.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in commentToPost: ", error);
  }
};

module.exports.getFeedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getFeedPost: ", error);
  }
};

module.exports.getUserPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {}
};
