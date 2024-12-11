const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    content: {
      type: String,
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
    div: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: String, required: true },
  },
  { timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);
module.exports = Share;
