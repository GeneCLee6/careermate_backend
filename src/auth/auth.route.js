const express = require("express");
const authController = require("./auth.controller");
const { valiateBody } = require("../middleware/validation.middleware");
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    verifyCodeSchema,
    resetPasswordSchema,
} = require("./auth.validation");
const authGuard = require("../middleware/authGuard.middleware");
const roleGuard = require("../middleware/roleGuard.middleware");

const authRouter = express.Router();

authRouter.post(
    "/register",
    valiateBody(registerSchema),
    authController.register,
);
authRouter.post("/login", valiateBody(loginSchema), authController.login);
authRouter.post(
    "/forgot-password",
    valiateBody(forgotPasswordSchema),
    authController.forgotPassword,
);
authRouter.post(
    "/verify-code",
    valiateBody(verifyCodeSchema),
    authController.verifyCode,
);
authRouter.post(
    "/reset-password",
    valiateBody(resetPasswordSchema),
    authController.resetPassword,
);

authRouter.get("/admin", authGuard, roleGuard("admin"), (req, res) => {
    res.json("admin only");
});
authRouter.get(
    "/admin-or-user",
    authGuard,
    roleGuard("admin", "user"),
    (req, res) => {
        res.json("admin or user access granted");
    },
);

module.exports = authRouter;
