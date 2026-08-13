const express = require("express");
const authRouter = require("./auth/auth.route");
const UserRouter = require("./users/user.route");
const authGuard = require("./middleware/authGuard.middleware");

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", authGuard, UserRouter);

module.exports = v1Router;
