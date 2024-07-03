const express = require("express");
require("dotenv").config();

const { conDb } = require("./utils/connectDb");
const authRoute = require("./controlleraAndRoutes/authRoutes");
const app = require("./controlleraAndRoutes/accessRoute");

const port = process.env.PORT || 4000;

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/auth", authRoute);
server.use("/api", app);

conDb(() => {
  server.listen(port, () => {
    console.log(`listening for requests at port ${port}`);
  });
});
