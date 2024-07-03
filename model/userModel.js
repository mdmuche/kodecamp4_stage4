const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    authToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const userCollection = model("users", userSchema);

module.exports = {
  userCollection,
};
