const express = require("express");
const { userCollection } = require("../model/userModel");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { tokenCollection } = require("../model/userToken");

const authRouter = express.Router();

const saltRounds = 10;

authRouter.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const token = v4();

  await userCollection.create({
    fullName,
    email,
    password: hashedPassword,
    authToken: token,
  });

  res.status(201).send({
    isSuccessful: true,
    message: "user account created successful, login to continue",
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userCollection.findOne({ email });

  if (!user) {
    res.status(404).send({
      isSuccessful: false,
      message: "user does not exist",
    });
    return;
  }

  const doesPasswordExists = bcrypt.compareSync(password, user.password);

  if (!doesPasswordExists) {
    res.status(404).send({
      isSuccessful: false,
      message: "invalid user credential",
    });
  }

  const token = jwt.sign(
    {
      userID: user._id,
      email: user.email,
    },
    process.env.SECRET
  );

  res.send({
    isSuccessful: true,
    userDetails: {
      fullName: user.fullName,
      email: user.email,
    },
    token,
    message: "loggin successful!",
  });
});

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userCollection.findOne({ email });

    if (!user) {
      res.status(404).send({
        isSuccessful: false,
        message: "user not found",
      });
      return;
    }

    const token = v4();

    await tokenCollection.create({
      userId: user._id,
      token,
    });

    res.status(201).send({
      isSuccessful: true,
      message: "Password reset token generated",
      token,
    });
  } catch (err) {
    res.status(500).send("server error", err.message);
  }
});

authRouter.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetToken = await tokenCollection.findOne({ token });
    if (!resetToken) {
      res.status(404).send({
        isSuccessful: true,
        message: "invalid or expired token",
      });
      return;
    }

    const user = await userCollection.findById(resetToken.userId);
    if (!user) {
      res.status(404).send({
        isSuccessful: false,
        message: "user not found",
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    // updating users password
    user.password = hashedPassword;
    await user.save();

    // delete the token after successful password reset;
    await tokenCollection.deleteOne({ token });

    res.send({
      isSuccessful: true,
      message: "password reset was successful",
    });
  } catch (err) {
    res.status(500).send({ message: "server error", error: err.message });
  }
});

module.exports = authRouter;