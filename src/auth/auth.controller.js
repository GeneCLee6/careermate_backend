const { error } = require("winston");
const crypto = require("crypto");
const User = require("../users/user.model");
const UnauthorizedException = require("../exceptions/unauthorized.exception");
const ConflictException = require("../exceptions/conflict.exception");
const { hashPassword, comparePassword } = require("../utils/password");
const { signAccessToken } = require("../utils/jwt");
const logger = require("../utils/logger");
const BadRequestException = require("../exceptions/badRequest.exception");
const { MAX_PASSWORD_HISTORY } = require("../users/constants");

const RESET_ACTION_EXPIRY_TIME = 10 * 60 * 1000;

const register = async (req, res) => {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        throw new ConflictException("Email already exists!");
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        passwordHistory: [hashedPassword],
    });
    const accessToken = signAccessToken({ id: user._id });
    res.status(201).json({ success: true, data: { user, accessToken } });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
        throw new UnauthorizedException("Email and password mismatch");
    }
    const isMatched = await comparePassword(password, user.password);
    if (!isMatched) {
        throw new UnauthorizedException("Invalid username or password");
    }
    if (user.deletedAt) {
        throw new UnauthorizedException("Account has been deleted");
    }
    const accessToken = signAccessToken({
        id: user._id,
        accountType: user.accountType,
    });
    res.json({ success: true, data: { user, accessToken } });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
        // PII
        // hash
        logger.info(`user try to reset password with email: ${email}`);
        return res.json({
            success: true,
            message: "If the email exists, a verification code will be sent",
        });
    }
    // Generate reset token and expiry
    const code = Math.random().toString().slice(2, 8);
    const resetCodeExpiry = new Date(Date.now() + RESET_ACTION_EXPIRY_TIME);

    user.resetCode = code;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    // Send reset code to user's email (implementation for sending email is omitted)
    res.json({ success: true, message: "verification code has been sent" });
};

const verifyCode = async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user || user.resetCode !== code || user.resetCodeExpiry < new Date()) {
        throw new UnauthorizedException("Invalid or expired verification code");
    }
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + RESET_ACTION_EXPIRY_TIME);

    await user.save();

    res.json({ success: true, data: { resetToken } });
};

const resetPassword = async (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    const user = await User.findOne({ email }).exec();
    if (
        !user ||
        user.resetToken !== resetToken ||
        user.resetTokenExpiry < new Date()
    ) {
        throw new UnauthorizedException("Invalid or expired reset token");
    }

    for (const oldPassword of user.passwordHistory) {
        const isSame = await comparePassword(newPassword, oldPassword);
        if (isSame) {
            throw new BadRequestException(
                "New password cannot be the same as any of the previous passwords",
            );
        }
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    let passwordHistory = [...user.passwordHistory, hashedPassword];
    if (passwordHistory.length > MAX_PASSWORD_HISTORY) {
        passwordHistory = passwordHistory.slice(-MAX_PASSWORD_HISTORY);
    }
    user.passwordHistory = passwordHistory;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
};

const authController = {
    register,
    login,
    forgotPassword,
    verifyCode,
    resetPassword,
};

module.exports = authController;
