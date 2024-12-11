const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute.js");
const {
  getShares,
  postShare,
  deleteShare,
} = require("../controllers/shareController.js");
const router = express.Router();

router.get("/:div/:branch/:year", protectRoute, getShares);
router.post("/", protectRoute, postShare);
router.delete("/:id", protectRoute, deleteShare);
module.exports = router;
