const { error } = require("winston");
const User = require("../users/user.model");
const UnauthorizedException = require("../exceptions/unauthrized.exception");
const ConflictException = require("../exceptions/conflict.exception");
const { hashPassword, comparePassword } = require("../utils/password");
const { signAccessToken } = require("../utils/jwt");

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
    const accessToken = signAccessToken({ id: user._id });
    res.json({ success: true, data: { user, accessToken } });
};

const authController = { register, login };

module.exports = authController;
