const { error } = require("winston");
const User = require("../users/user.model");
const UnauthorizedException = require("../exceptions/unauthrized.exception");
const ConflictException = require("../exceptions/conflict.exception");

const register = async (req, res) => {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        throw new ConflictException("Email already exists!");
    }
    const user = await User.create({ fullName, email, password });
    res.status(201).json({ success: true, data: { user } });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
        throw new UnauthorizedException("Email and password mismatch");
    }
    if (user.password !== password) {
        throw new UnauthorizedException("Invalid username or password");
    }
    res.json({ success: true, data: { user } });
};

const authController = { register, login };

module.exports = authController;
