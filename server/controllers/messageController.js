const Message = require("../models/message.js");
const Conversation = require("../models/conversation.js");
const { io, getRecipientSocketId } = require("../socket/socket.js");
const cloudinary = require("cloudinary").v2;

module.exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;
    let img = req.body.img;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }
    if (img) {
      const res = await cloudinary.uploader.upload(img);
      img = res.secure_url;
    }
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: { text: message, sender: senderId },
      }),
    ]);
    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in sendMessage: ", error);
  }
};

module.exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation Not Found!" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getMessages: ", error);
  }
};

module.exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic isVerified",
    });

    if (conversations) {
      conversations.forEach((conversation) => {
        // Filter out the current user from the participants array
        conversation.participants = conversation.participants.filter(
          (participant) => participant._id.toString() !== userId.toString()
        );
      });
    }

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getConversations: ", error);
  }
};

module.exports.deleteOldMessages = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messagesToDelete = await Message.find({
      createdAt: { $lt: oneDayAgo },
    });

    // Iterate through messages to clear conversations and destroy images
    for (const message of messagesToDelete) {
      if (message.img) {
        // Destroy image in cloudinary
        await cloudinary.uploader.destroy(
          message.img.split("/").pop().split(".")[0]
        );
      }

      // Clear last message in conversation
      await Conversation.updateOne(
        { _id: message.conversationId },
        { $unset: { lastMessage: "" } }
      );
    }

    // Delete old messages
    const deleteResult = await Message.deleteMany({
      createdAt: { $lt: oneDayAgo },
    });

    console.log(
      "Old messages and associated conversations updated successfully."
    );
  } catch (error) {
    console.error("Error deleting old messages:", error);
  }
};

