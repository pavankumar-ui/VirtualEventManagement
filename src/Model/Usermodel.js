const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        unique: true,
    },
    role:{
        type: String,
        enum: ["Organizer", "attendee"],
        default: "attendee",
        required:true
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

