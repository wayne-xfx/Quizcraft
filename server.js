require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // NEW: Added the JWT package
const User = require('./models/User');

const app = express();
const PORT = 3000;

// Middleware to understand JSON data from the frontend
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to the MongoDB database!"))
    .catch((error) => console.log("Error connecting to database:", error));

// --- ROUTES ---

// 1. Basic Test Route
app.get('/api/status', (req, res) => {
    res.json({ message: "QuizCraft API is running" });
});

// 2. User Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            password_hash: hashedPassword
        });

        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// 3. User Login Route (NEW)
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Step A: Find the user
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Step B: Check the password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Step C: Generate the Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET, // Pulls the secret from your .env file
            { expiresIn: '1h' }
        );

        res.json({ message: "Login successful!", token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});