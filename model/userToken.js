const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const tokenCollection = model("tokens", tokenSchema);

module.exports = {
  tokenCollection,
};
