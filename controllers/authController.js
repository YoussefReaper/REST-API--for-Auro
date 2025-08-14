const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const KEY = process.env.KEY;

exports.register = async (req, res) => {
    const {username, password, email} = req.body;
    if(!username || !password || !email) return res.status(400).json({ message: 'Username, password and email are required'});

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(401).json({ message: 'Username already taken'});
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(401).json({ message: 'Email already registered'});
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashed, email, emailVerificationToken: verificationToken, customization: {}});
        newUser.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
        const token = jwt.sign({ username: newUser.username, id: newUser._id}, KEY, {expiresIn: '1h'});
        await newUser.save();
        res.status(201).json({message: 'User created', token});
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.login = async (req, res) => {
    const {username,password} = req.body;
    if(!username||!password) return res.status(400).json({message: 'Username and password are required'});

    try {
        const user = await User.findOne({username});
        if(!user) return res.status(401).json({message:'Invalid credentials'});
        if (user.isVerified !== true) return res.status(402).json({message: 'Email not verified'});
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(401).json({message: 'Invalid credentials'});
        const token = jwt.sign({ username: user.username, id: user._id}, KEY, {expiresIn: '1h'});
        res.status(200).json({token});
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};
