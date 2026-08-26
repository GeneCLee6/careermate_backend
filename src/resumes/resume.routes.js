const express = require("express");
const { validateBody } = require("../middleware/validation.middleware");
const { createResumeSchema } = require("./resume.validation");
const resumeController = require("./resume.controller");

const resumeRouter = express.Router();

resumeRouter.post(
    "/",
    validateBody(createResumeSchema),
    resumeController.createResume,
);
resumeRouter.get("/", resumeController.getResumes);
resumeRouter.get("/:id/download", resumeController.downloadResume);
resumeRouter.delete("/:id", resumeController.deleteResume);

module.exports = resumeRouter;
