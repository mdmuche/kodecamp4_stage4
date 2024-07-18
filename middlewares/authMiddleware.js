const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const authToken = req.headers.authorization.split(" ");
    const strategy = authToken[0];
    const tokenItSeft = authToken[1];

    if (!authToken) {
      res.status(403).send({
        message: "no token present",
      });
      return;
    }

    if (strategy == "Bearer") {
      const userDetails = jwt.verify(tokenItSeft, process.env.SECRET);

      req.userDetails = userDetails;

      next();
    } else {
      return res.status(403).send({ message: "invalid auth strategy" });
    }
  } catch (err) {
    res.status(404).send({
      message: "you are not allowed to view this route",
      error: err.message,
    });
  }
}

module.exports = {
  authMiddleware,
};
