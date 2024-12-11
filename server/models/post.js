const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxLength: 500,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
