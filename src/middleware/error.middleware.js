const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something unexpected happened";
    res.status(status).json({
        success: false,
        error: { message: message },
    });
};

module.exports = errorHandler;
