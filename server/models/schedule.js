const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    div: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["meet", "quiz"],
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
