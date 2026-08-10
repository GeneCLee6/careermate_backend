const { registerSchema } = require("../auth/auth.validation");
const ValidationException = require("../exceptions/validation.exception");

const valiateBody = (schema) => async (req, res, next) => {
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
        const message = result.error.issues
            .map((issue) => issue.message)
            .join(", ");
        throw new ValidationException(message);
    }
    req.body = result.data;
    next();
};

module.exports = { valiateBody };
