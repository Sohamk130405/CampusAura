const mongoose = require("mongoose");
const Notification = require("../models/notification");
module.exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profilePic",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ success: "Notifiactions deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteNotifications : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
