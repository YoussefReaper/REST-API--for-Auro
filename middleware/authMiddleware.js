const jwt = require('jsonwebtoken');
const KEY = process.env.KEY;

module.exports = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401).json({message:'Token missing'});
    jwt.verify(token, KEY, (err, user) => {
        if (err) return res.sendStatus(403).json({message: 'Invalid token'});
        req.user = user;
        next();
    });
};