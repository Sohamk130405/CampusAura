const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    year: {
      type: String,
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
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    file: {
      type: String,
    },
    sendTo: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        isSubmitted: {
          type: Boolean,
          default: false,
        },
        marks: {
          type: Number,
          default: 0,
        },
      },
    ],
    deadline: {
      type: Date,
      required: true,
    },
    extendRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
