const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    marks: {
      type: Number,
      default: 0,
    },
    img: {
      type: String, // Store image/ path or URL
    },
    file: {
      type: String, // Store /file path or URL
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
