const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 500,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: {
      type: String,
    },
    file: {
      type: String,
    },
    div: { type: String },
    branch: { type: String },
    year: { type: String },
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);
module.exports = Notice;
