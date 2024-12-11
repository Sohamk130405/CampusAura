const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const {
  getSchedules,
  addSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController.js");
const router = express.Router();

router.get("/:type", protectRoute, getSchedules);
router.post("/", protectRoute, addSchedule);
router.delete("/:id", protectRoute, deleteSchedule);

module.exports = router;
