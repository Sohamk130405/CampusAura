const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const {
  getNotices,
  sendNotice,
  deleteNotice,
} = require("../controllers/noticeController.js");
const router = express.Router();

router.get("/", protectRoute, getNotices);
router.post("/", protectRoute, sendNotice);
router.delete("/:id", protectRoute, deleteNotice);
module.exports = router;
