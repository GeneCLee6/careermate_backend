const UnauthorizedException = require("../exceptions/unauthorized.exception");
const { verifyAccessToken } = require("../utils/jwt");

const authGuard = (req, res, next) => {
    // header -> authorization
    const authHeader = req.headers.authorization;

    // Bearer xxxx
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedException("Authentication required");
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = verifyAccessToken(token);
        // role
        req.user = user;
        next();
    } catch (e) {
        throw new UnauthorizedException("Invalid or expired token", { err: e });
    }
};

module.exports = authGuard;
