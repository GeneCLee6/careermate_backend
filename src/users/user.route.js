const express = require("express");
const UserController = require("./user.controller");
const roleGuard = require("../middleware/roleGuard.middleware");

const UserRouter = express.Router();

UserRouter.delete("/:id", roleGuard("admin"), UserController.deleteUser);
UserRouter.post("/:id/restore", roleGuard("admin"), UserController.restoreUser);

module.exports = UserRouter;
