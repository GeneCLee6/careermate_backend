const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("./config");

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info("DB connected");
    } catch (e) {
        logger.error(`DB connection failed, ${e.message}`);
        // 0
        process.exit(1);
    }
};

module.exports = connectDB;
