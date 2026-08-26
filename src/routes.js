const express = require("express");
const authRouter = require("./auth/auth.route");
const userRouter = require("./users/user.route");
const authGuard = require("./middleware/authGuard.middleware");
const uploadRouter = require("./upload/upload.routes");
const resumeRouter = require("./resumes/resume.routes");

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", authGuard, userRouter);
v1Router.use("/upload", authGuard, uploadRouter);
v1Router.use("/resumes", authGuard, resumeRouter);

module.exports = v1Router;
