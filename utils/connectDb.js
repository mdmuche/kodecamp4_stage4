const mongoose = require("mongoose");

exports.conDb = async function (cb) {
  try {
    let db = mongoose.connect(process.env.URL);
    db.then(() => {
      console.log("connection to db was successful");
      cb();
    }).catch((err) => {
      console.log("connection to db wasn't successful", err);
    });
  } catch (err) {
    console.error("connection to db failed", err);
  }
};
