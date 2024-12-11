const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const {
  getNotifications,
  deleteNotifications,
} = require("../controllers/notificationController.js");
const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
module.exports = router;
