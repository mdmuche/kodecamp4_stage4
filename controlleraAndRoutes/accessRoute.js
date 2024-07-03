const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");

const app = express.Router();

app.get("/profile", authMiddleware, (req, res) => {
  const { fullName, email } = req.userDetails;

  res.send({ message: "profile page", fullName, email });
});

module.exports = app;
