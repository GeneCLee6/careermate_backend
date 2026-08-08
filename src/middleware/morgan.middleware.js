const morgan = require("morgan");
const logger = require("../utils/logger");

const morganMiddleware = morgan(
    process.env.NODE_ENV === "dev" ? "dev" : "combined",
    {
        stream: { write: (msg) => logger.info(msg.trim()) },
    },
);

module.exports = morganMiddleware;
