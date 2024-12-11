const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const router = express.Router();

const {
  getAssignments,
  getParticularAssignment,
  sendAssignment,
  updateAssignment,
  deleteAssignment,
  sendSubmission,
  getSubmisions,
  updateSubmission,
} = require("../controllers/assignmentController.js");

// assignments operation by faculty
router.get("/", protectRoute, getAssignments);
router.get("/:id", protectRoute, getParticularAssignment);
router.post("/", protectRoute, sendAssignment);
router.put("/:id", protectRoute, updateAssignment);
router.delete("/:id", protectRoute, deleteAssignment);

// submissions operations by student
router.get("/submissions/:id", protectRoute, getSubmisions);
router.post("/submissions/:id", protectRoute, sendSubmission);
router.put("/submissions/:id", protectRoute, updateSubmission);

module.exports = router;
