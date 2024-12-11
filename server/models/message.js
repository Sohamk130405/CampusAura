const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    text: String,
    seen: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
