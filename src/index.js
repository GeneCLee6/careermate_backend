const config = require("./utils/config");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const morganMiddleware = require("./middleware/morgan.middleware");
const rateLimiter = require("./middleware/rateLimit.middleware");
const connectDB = require("./utils/db");
const v1Router = require("./routes");
const errorHandler = require("./middleware/error.middleware");

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
app.use(morganMiddleware);
app.use(rateLimiter);
app.use(express.json());
app.use(cors());

app.use("/v1", v1Router);

app.use(errorHandler);

connectDB();
app.listen(config.PORT, () => {
    logger.info(`Server listening on port ${config.PORT}`);
});
