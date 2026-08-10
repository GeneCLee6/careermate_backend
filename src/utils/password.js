const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS); // HASH+HashedPassword
};

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword); // password + HASH === HashedPassword
};

module.exports = {
    hashPassword,
    comparePassword,
};
