const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

module.exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized!" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in protectRoute: ", error.message);
  }
};
