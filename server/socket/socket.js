const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: "GET , POST , PUT , PATCH , DELETE , HEAD",
  },
});
const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }
  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getRecipientSocketId };
