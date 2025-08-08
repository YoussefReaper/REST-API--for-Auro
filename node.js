const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const KEY = process.env.KEY || 'your_secret_key';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://arabymohammedyoussef123:203213you@cluster0.yqqzwd3.mongodb.net/mydatabase?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true},
    password: { type: String, required: true},
    badHabits: [String],
    goodHabits: [String]
});

const User = mongoose.model('User', userSchema);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing'});

    jwt.verify(token, KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, badHabits: [], goodHabits: []});
        await newUser.save();

        res.status(201).json({ message: 'User created'});
    } catch (err) {
        res.status(500).json({ message: 'Server error'})
    }
})