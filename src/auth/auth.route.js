const express = require("express");
const authController = require("./auth.controller");
const { valiateBody } = require("../middleware/validation.middleware");
const { registerSchema, loginSchema } = require("./auth.validation");

const authRouter = express.Router();

authRouter.post(
    "/register",
    valiateBody(registerSchema),
    authController.register,
);
authRouter.post("/login", valiateBody(loginSchema), authController.login);

module.exports = authRouter;
