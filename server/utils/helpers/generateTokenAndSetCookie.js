const jwt = require("jsonwebtoken");

module.exports.generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  return token;
};
