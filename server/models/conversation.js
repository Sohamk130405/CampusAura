const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    lastMessage: {
      sender: { type: mongoose.Types.ObjectId, ref: "User" },
      text: String,
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
