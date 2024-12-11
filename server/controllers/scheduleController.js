const mongoose = require("mongoose");
const Schedule = require("../models/schedule");

module.exports.getSchedules = async (req, res) => {
  try {
    const { type } = req.params;
    const schedules = await Schedule.find({ type: type }).populate({
      path: "faculty",
      select: "name username profilePic",
    });
    res.status(200).json(schedules);
  } catch (error) {
    console.log("Error in getSchedules : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.addSchedule = async (req, res) => {
  try {
    const { type, link, time, div, branch, year, subject } = req.body;
    const faculty = req.user._id;
    const newSchedule = new Schedule({
      type,
      link,
      time,
      div,
      branch,
      year,
      subject,
      faculty,
    });
    await newSchedule.save();
    res.status(200).json({ success: `${type} scheduled successfully!` });
  } catch (error) {
    console.log("Error in addSchedule : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ error: "Scheduled task not found!" });
    }
    if (schedule.faculty !== userId) {
      return res
        .status(400)
        .json({ error: "You dont have permission to delete!" });
    }
    await Schedule.findByIdAndDelete(id);
    res.status(200).json({ success: "Schedule deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteSchedule : ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
