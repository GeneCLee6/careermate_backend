const logger = require("../utils/logger");
const BadRequestException = require("../exceptions/badRequest.exception");
const NotFoundException = require("../exceptions/NotFound.exception");
const UnauthoriedException = require("../exceptions/unauthorized.exception");
const User = require("./user.model");
const { MAX_PASSWORD_HISTORY } = require("./constants");

const getMe = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).exec();
    if (!user) {
        throw new NotFoundException("User not found");
    }
    res.json({
        success: true,
        data: user,
    });
};

const updateMe = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new NotFoundException("User not found");
    }
    res.json({
        success: true,
        data: user,
    });
};

const updateMyPassword = async (req, res) => {
    const { newPassword, currentPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).exec();
    if (!user) {
        throw new NotFoundException("User not found");
    }
    const isMatched = await comparePassword(currentPassword, user.password);
    if (!isMatched) {
        throw new UnauthoriedException("Invalid username or password");
    }
    for (const oldHash of user.passwordHistory) {
        const isSame = await comparePassword(newPassword, oldHash);
        if (isSame) {
            throw new BadRequestException(
                "New password must not be the same as the recent passwords",
            );
        }
    }
    const hashedPassword = await hashedPassword(newPassword);
    user.password = hashedPassword;
    let passwordHistory = [...user.passwordHistory, hashedPassword];
    if (passwordHistory.length > MAX_PASSWORD_HISTORY) {
        passwordHistory = passwordHistory.slice(-MAX_PASSWORD_HISTORY);
    }
    user.passwordHistory = passwordHistory;
    await user.save();

    logger.info("Password updated successful", { userId: user._id });

    res.json({
        success: true,
        message: "Password updated",
    });
};

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
        throw new NotFoundException("User not found");
    }
    if (user.deletedAt) {
        throw new BadRequestException("User is already deleted");
    }
    user.deletedAt = new Date();
    await user.save();

    logger.info("User soft deleted", {
        userId: user._id,
        operator: req.user.id,
    });
    res.json({
        success: true,
        message: "User has been soft deleted",
    });
};

const restoreUser = async (req, res) => {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
        throw new NotFoundException("User not found");
    }
    if (!user.deletedAt) {
        throw new BadRequestException("User is not deleted");
    }
    user.deletedAt = undefined;
    await user.save();

    logger.info("User restored", {
        userId: user._id,
        operator: req.user.id,
    });
    res.json({
        success: true,
        message: "User has been restored",
    });
};

const UserController = {
    deleteUser,
    restoreUser,
    getMe,
    updateMe,
    updateMyPassword,
};

module.exports = UserController;
