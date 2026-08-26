require("dotenv").config();

const requiredConfigs = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    S3_BUCKET: process.env.S3_BUCKET,
};

const optionalConfigs = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "dev",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    AWS_REGION: process.env.AWS_REGION || "ap-southeast-2",
    CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN,
};

for (const key in requiredConfigs) {
    if (!requiredConfigs[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const config = { ...requiredConfigs, ...optionalConfigs };

module.exports = config;
