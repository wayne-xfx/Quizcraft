const mongoose = require('mongoose');

// 1. Define the rules (The Schema)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // They MUST provide a username
        unique: true    // No two people can have the same username
    },
    password_hash: {
        type: String,
        required: true  // They MUST provide a password
    },
    created_at: {
        type: Date,
        default: Date.now // Automatically stamps the current time when they register
    }
});

// 2. Turn the rules into a usable Model and export it
module.exports = mongoose.model('User', userSchema);