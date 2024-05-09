const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const router = express.Router();
const {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  commentToPost,
  getFeedPost,
  getUserPost,
} = require("../controllers/postController.js");

router.get("/feed", protectRoute, getFeedPost);

router.get("/user/:username", getUserPost); // Move this route before the route for fetching liked posts
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/comment/:id", protectRoute, commentToPost);
router.get("/:id", getPost);
module.exports = router;
