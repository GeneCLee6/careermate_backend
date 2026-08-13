// magic string
// magic number
// const CONSTANTS =
// const ROLES = {USER: "user", ADMIN:"admin"}
// roleGuard(["user","admin"])

const ForbiddenException = require("../exceptions/forbidden.exception");

// roleGuard("user","admin")
const roleGuard =
    (...allowedAccountTypes) =>
    (req, res, next) => {
        if (!req.user || !allowedAccountTypes.includes(req.user.accountType)) {
            throw new ForbiddenException("Insufficient permissions");
        }
        next();
    };

module.exports = roleGuard;
