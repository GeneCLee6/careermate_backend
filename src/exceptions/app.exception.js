class AppException extends Error {
    constructor(
        statusCode = 500,
        message = "Internal Server Error",
        context = {},
    ) {
        super(message);
        this.name = this.constructor.name;
        this.status = statusCode;
        this.message = message;
        this.context = context;
    }
}

module.exports = AppException;
