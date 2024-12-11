const cloudinary = require("cloudinary").v2;
const Assignment = require("../models/assignment.js");
const Notification = require("../models/notification.js");
const Submission = require("../models/submission.js");
const User = require("../models/user.js");
const fs = require("fs");

module.exports.getAssignments = async (req, res) => {
  const userId = req.user._id; // Assuming you have user information in req.user
  const userType = req.user.type; // Assuming you have a role property in your user model

  try {
    let assignments;
    if (userType === "student") {
      // For students, find assignments assigned to them
      assignments = await Assignment.find({
        sendTo: {
          $elemMatch: { student: userId },
        },
      }).populate({
        path: "faculty",
        select: "name username profilePic",
      });
    } else if (userType === "faculty") {
      // For faculty, find assignments created by them
      assignments = await Assignment.find({ faculty: userId })
        .populate({
          path: "faculty",
          select: "name username profilePic",
        })
        .populate({
          path: "sendTo.student",
          select: "name username profilePic prn",
        });
    } else {
      // Handle other user roles if needed
      return res.status(403).json({ error: "Forbidden" });
    }

    // Iterate over assignments to check submission status for students
    const assignmentsWithSubmissionStatus = assignments.map((assignment) => {
      if (userType === "student") {
        const sendToEntry = assignment.sendTo.find((entry) =>
          entry.student.equals(userId)
        );
        const isSubmitted = sendToEntry ? sendToEntry.isSubmitted : false;
        return {
          ...assignment.toObject(),
          isSubmitted,
        };
      } else {
        // For faculty, return assignments as they are
        return assignment.toObject();
      }
    });

    res.status(200).json(assignmentsWithSubmissionStatus);
  } catch (err) {
    console.error("Error in getAssignments : ", err.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

module.exports.getParticularAssignment = async (req, res) => {
  try {
    const { assignId } = req.params;
    const assignment = Assignment.findById(assignId);
    res.status(200).json(assignment);
  } catch (error) {
    console.error("Error in getParticularAssignment : ", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

module.exports.sendAssignment = async (req, res) => {
  try {
    const faculty = req.user._id;
    const { subject, year, div, branch, text, deadline } = req.body;
    let { img, file, fileName } = req.body;

    const user = await User.findById(faculty);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    const isFaculty = user.type === "faculty";
    if (!isFaculty) {
      return res.status(400).json({ error: "Unauthorized Access" });
    }

    if (file) {
      const path = __dirname + "/uploads/";
      const bufferData = Buffer.from(file.split(",")[1], "base64");
      // Check if the parent directory exists, if not, create it
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      // Write the file to the uploads directory
      fs.writeFile(path + fileName, bufferData, (err) => {
        if (err) {
          console.error("Error creating file:", err);
        } else {
          console.log("File saved");
        }
      });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const sendTo = await User.find({
      type: "student",
      branch: branch,
      year: year,
      div: div,
    });

    // Create the new assignment
    const newAssignment = new Assignment({
      faculty: faculty,
      subject: subject,
      year: year,
      div: div,
      branch: branch,
      text: text,
      img: img,
      file: fileName,
      sendTo: sendTo.map((student) => ({
        student: student._id,
        isSubmitted: false,
      })),
      deadline: deadline,
    });

    // Save the assignment to the database
    await newAssignment.save();
    for (const student of sendTo) {
      const notification = new Notification({
        from: faculty,
        to: student._id,
        type: "assignment",
      });
      await notification.save();
    }
    res.status(200).json({ success: "Assignment Sent Successfully!" });
  } catch (error) {
    console.error("Error in sendAssignment : ", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

module.exports.updateAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { subject, text, deadline, extendReq } = req.body;
    let { img, file, fileName } = req.body;

    // Find the assignment by ID
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found!" });
    }

    assignment.subject = subject || assignment.subject;
    assignment.text = text || assignment.text;
    assignment.deadline = deadline || assignment.deadline;

    if (extendReq) {
      console.log(assignment);
      const isVoted = assignment.extendRequests.includes(extendReq);
      if (isVoted) {
        return res.status(400).json({ error: "You voted already!" });
      }
      assignment.extendRequests.push(extendReq);
      await assignment.save();
      return res.status(200).json({ success: "You voted successfully!" });
    }
    // Process file and image uploads
    if (file) {
      // Delete old file if it exists
      if (assignment.file) {
        const oldFilePath = __dirname + "/uploads/" + assignment.file;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("Old file deleted");
        }
      }

      const path = __dirname + "/uploads/";
      const bufferData = Buffer.from(file.split(",")[1], "base64");
      // Check if the parent directory exists, if not, create it
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      // Write the file to the uploads directory
      fs.writeFile(path + fileName, bufferData, (err) => {
        if (err) {
          console.error("Error creating file:", err);
        } else {
          console.log("File saved");
        }
      });
      assignment.file = fileName;
    }
    if (img) {
      // Process image upload
      if (assignment.img) {
        await cloudinary.uploader.destroy(
          assignment.img.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(img);
      assignment.img = uploadedResponse.secure_url;
    }

    // Save the updated assignment to the database
    await assignment.save();

    res.status(200).json({ success: "Assignment Updated Successfully!" });
  } catch (error) {
    console.error("Error in updateAssignment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // Find the assignment by ID
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found!" });
    }

    // Delete files and images associated with each submission
    const submissions = await Submission.find({ assignmentId: assignmentId });
    if (submissions.length > 0) {
      for (const submission of submissions) {
        if (submission.file) {
          const filePath = __dirname + "/uploads/" + submission.file;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Submission file deleted");
          }
        }
      }
      await Submission.deleteMany({ assignmentId: assignmentId });
    }

    // Delete the assignment's file and image
    if (assignment.file) {
      const filePath = __dirname + "/uploads/" + assignment.file;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Assignment file deleted");
      }
    }
    if (assignment.img) {
      await cloudinary.uploader.destroy(
        assignment.img.split("/").pop().split(".")[0]
      );
      console.log("Assignment image deleted from cloudinary");
    }

    // Delete the assignment from the database
    await Assignment.findByIdAndDelete(assignmentId);

    res.status(200).json({ success: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAssignment:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.sendSubmission = async (req, res) => {
  try {
    const { file, fileName } = req.body;
    const assignmentId = req.params.id;
    const studentId = req.user._id; // Assuming user ID is stored in req.user._id after authentication
    const assignment = await Assignment.findById(assignmentId);
    // Check if assignmentId is provided
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found!" });
    }

    const existingSubmission = await Submission.findOne({
      assignmentId: assignmentId,
      student: studentId,
    });
    if (existingSubmission) {
      // Delete the existing submission
      const oldFilename = existingSubmission.file;

      if (oldFilename) {
        const oldFilePath = __dirname + "/uploads/" + oldFilename;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("Old file deleted");
        }
      }

      await Submission.findOneAndDelete({
        assignmentId: assignmentId,
        student: studentId,
      });
    }

    // Update isSubmitted field in Assignment for the specific student
    const sendToIndex = assignment.sendTo.findIndex(
      (entry) => entry.student.toString() === studentId.toString()
    );
    if (sendToIndex !== -1) {
      assignment.sendTo[sendToIndex].isSubmitted = true;
      await assignment.save();
    } else {
      return res.status(400).json({ error: "This Assignments is not for you" });
    }

    if (file) {
      const path = __dirname + "/uploads/";
      const bufferData = Buffer.from(file.split(",")[1], "base64");
      // Check if the parent directory exists, if not, create it
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      // Write the file to the uploads directory
      fs.writeFile(path + fileName, bufferData, (err) => {
        if (err) {
          console.error("Error creating file:", err);
        } else {
          console.log("File saved");
        }
      });
    }

    // Create the new submission
    const newSubmission = new Submission({
      assignmentId: assignmentId,
      student: studentId,

      file: fileName,
    });

    // Save the submission to the database
    await newSubmission.save();

    res.status(200).json({ success: "Submission made successfully!" });
  } catch (error) {
    console.error("Error in sendSubmission:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.getSubmisions = async (req, res) => {
  try {
    const assignId = req.params.id;
    const submissions = await Submission.find({
      assignmentId: assignId,
    }).populate({
      path: "student",
      select: "name username profilePic prn",
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error in getSubmissions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports.updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks } = req.body;
    const submission = await Submission.findByIdAndUpdate(id, { marks: marks });
    res.status(200).json({ success: "Marks Updated Successfully!" });
  } catch (error) {
    console.error("Error in updateSubmission:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
