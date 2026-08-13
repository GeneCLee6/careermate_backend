const AppException = require("./app.exception");

class NotFoundException extends AppException {
    constructor(message = "Not found error", context = {}) {
        super(404, message, context);
    }
}

module.exports = NotFoundException;
