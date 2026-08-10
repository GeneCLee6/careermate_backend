const morgan = require("morgan");
const logger = require("../utils/logger");
const { config } = require("winston");

const morganMiddleware = morgan(
    config.NODE_ENV === "dev" ? "dev" : "combined",
    {
        stream: { write: (msg) => logger.info(msg.trim()) },
    },
);

module.exports = morganMiddleware;
