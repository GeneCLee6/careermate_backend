const jwt = require("jsonwebtoken");
const config = require("./config");

const signAccessToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};

module.exports = {
    signAccessToken,
    verifyAccessToken,
};
