const { rateLimit } = require("express-rate-limit");
const { config } = require("winston");

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    skip: () => config.NODE_ENV === "dev" || config.NODE_ENV === "test",
});

module.exports = rateLimiter;
