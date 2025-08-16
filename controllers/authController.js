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
        const token = jwt.sign({ username: newUser.username, id: newUser._id}, KEY, {expiresIn: '15m'});
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: ".aurocore.me",
            maxAge: 15 * 60 * 1000
        });
        console.log(token);
        await newUser.save();
        res.status(201).json({message: 'User created'});
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.login = async (req, res) => {
    const {username,password, rememberMe} = req.body;
    if(!username||!password) return res.status(400).json({message: 'Username and password are required'});

    try {
        const user = await User.findOne({username});
        if(!user) return res.status(401).json({message:'Invalid credentials'});
        if (user.isVerified !== true) return res.status(402).json({message: 'Email not verified'});
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(401).json({message: 'Invalid credentials'});
        const accessToken = jwt.sign({ username: user.username, id: user._id}, KEY, {expiresIn: '15m'});

        const refreshToken = jwt.sign({
            username: user.username, id: user._id
        },
        KEY,
        {expiresIn: rememberMe? '30d' : '1d'});

        user.refreshTokens.push(refreshToken);
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: ".aurocore.me",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: ".aurocore.me",
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        });
        res.status(200).json({message: "Logged in successfully"});
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token'});

    try {
        const user = await User.findOne({ refreshTokens: refreshToken});
        if (!user) return res.status(403).json({ message: 'Invalid refresh token'});

        jwt.verify(refreshToken, KEY, async(err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token'});
            const newAccessToken = jwt.sign(
                {username: decoded.username, id: decoded.id},
                KEY,
                {expiresIn: '15m'}
            );

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                domain: ".aurocore.me",
                maxAge: 15 * 60 * 1000
            });

            res.json({message: "Access token refreshed"});
        });
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    };
};

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    try {
        const user = await User.findOne({ refreshTokens: refreshToken });
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            await user.save();
        }
        res.clearCookie("refreshToken", {httpOnly: true, secure: true, sameSite: 'none', domain: ".aurocore.me"});
        res.clearCookie("accessToken", {httpOnly: true, secure: true, sameSite: 'none', domain: ".aurocore.me"});
        res.sendStatus(204);
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};
