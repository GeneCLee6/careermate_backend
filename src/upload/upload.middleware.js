const { rateLimit } = require("express-rate-limit");
const config = require("../utils/config");

const uploadRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skip: () => config.NODE_ENV === "dev",
});

module.exports = uploadRateLimiter;
