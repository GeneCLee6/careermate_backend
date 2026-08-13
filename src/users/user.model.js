const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        displayName: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["Student", "Other"],
        },
        field: {
            type: String,
            enum: ["FE", "BE"],
        },
        goal: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
        },
        accountType: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        resetCode: {
            type: String,
        },
        resetCodeExpiry: {
            type: Date,
        },
        resetToken: {
            type: String,
        },
        resetTokenExpiry: {
            type: Date,
        },
        passwordHistory: {
            type: [String],
            default: [],
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, user) => {
                delete user.password;
                delete user.__v;
                delete user.accountType;
                delete user.passwordHistory;
            },
        },
    },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
