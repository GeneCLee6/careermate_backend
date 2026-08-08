require("dotenv").config();
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const morganMiddleware = require("./middleware/morgan.middleware");
const rateLimiter = require("./middleware/rateLimit.middleware");
const connectDB = require("./utils/db");

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
app.use(morganMiddleware);
app.use(rateLimiter);
app.use(express.json());
app.use(cors());

connectDB();
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});
