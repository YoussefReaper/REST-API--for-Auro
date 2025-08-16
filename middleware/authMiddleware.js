const jwt = require('jsonwebtoken');
const KEY = process.env.KEY;

module.exports = function authenticateToken(req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};
