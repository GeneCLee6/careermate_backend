const express = require("express");
const userController = require("./user.controller");
const roleGuard = require("../middleware/roleGuard.middleware");
const { validateBody } = require("../middleware/validation.middleware");
const {
    updateMeSchema,
    updateMyPasswordSchema,
    updateAvatarSchema,
} = require("./user.validation");

const userRouter = express.Router();

userRouter.get("/me", userController.getMe);
userRouter.put("/me", validateBody(updateMeSchema), userController.updateMe);
userRouter.put(
    "/me/password",
    validateBody(updateMyPasswordSchema),
    userController.updateMyPassword,
);
userRouter.post(
    "/me/avatar",
    validateBody(updateAvatarSchema),
    userController.updateAvatar,
);

userRouter.delete("/:id", roleGuard("admin"), userController.deleteUser);
userRouter.post("/:id/restore", roleGuard("admin"), userController.restoreUser);

module.exports = userRouter;
