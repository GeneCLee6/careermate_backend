const { rateLimit } = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    skip: () => process.env.NODE_ENV === "dev",
});

module.exports = rateLimiter;
