const express = require("express");
const { validateBody } = require("../middleware/validation.middleware");
const { presignedUploadSchema } = require("./upload.validation");
const uploadController = require("./upload.controller");
const uploadRateLimiter = require("./upload.middleware");

const uploadRouter = express.Router();

uploadRouter.post(
    "/presigned-url",
    uploadRateLimiter,
    validateBody(presignedUploadSchema),
    uploadController.getPresignedUploadUrl,
);

module.exports = uploadRouter;
