const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  getConversations,
} = require("../controllers/messageController.js");

router.post("/", protectRoute, sendMessage);
router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);

module.exports = router;
