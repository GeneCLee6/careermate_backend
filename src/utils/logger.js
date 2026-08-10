const winston = require("winston");
const config = require("./config");

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format((meta) => {
            if (meta.req) {
                meta.req = {
                    method: meta.req.method,
                    url: meta.req.url,
                };
            }
            if (meta.err) {
                meta.err = {
                    message: meta.err.message,
                    // stack: meta.err.stack
                };
            }
            return meta;
        })(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            let log = `[${timestamp}] [${level}]: ${message}`;
            if (Object.keys(meta).length > 0) {
                log += ` ${JSON.stringify(meta)}`;
            }
            return log;
        }),
    ),
    transports: [new winston.transports.Console()],
});

module.exports = logger;
