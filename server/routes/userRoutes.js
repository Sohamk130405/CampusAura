const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const router = express.Router();
const {
  signUpUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
  deleteAccount,
  getUnverifiedUsers,
  verifyUser,
  rejectVerification,
} = require("../controllers/userController.js");
router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);
router.delete("/delete", protectRoute, deleteAccount);
router.get("/getUnverifiedUsers", protectRoute, getUnverifiedUsers);
router.put("/verify/:id", protectRoute, verifyUser);
router.put("/reject/:id", protectRoute, rejectVerification);
module.exports = router;
