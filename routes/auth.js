const express = require('express');
const router = express.Router();
const passport = require("passport");
const authController = require('../controllers/authController');
const { forgotPassword, resetPassword, forgotUsername } = require("../controllers/forgotPassword");
const crypto = require("crypto");
const userController = require("../controllers/userController")
const emailRequestLimiter = require("../middleware/rateLimit");
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: username
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Username already taken
 *       500:
 *         description: Server error
 */

router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: username
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: token (JWT)
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', authController.login);
router.post("/forgot-password", emailRequestLimiter, forgotPassword);
router.post("/reset-password/:token", emailRequestLimiter, resetPassword);
router.post("/forgot-username", emailRequestLimiter, forgotUsername);

router.post('/send-verification-email', emailRequestLimiter, authenticateToken, userController.sendVerificationEmail);
router.get('/verify-email', emailRequestLimiter,userController.verifyEmail);
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out successfully" });
});
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    const token = generateJwt(req.user);
    res.redirect(`${process.env.CLIENT_URL}/home?token=${token}`);
});

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

    if(!email) {
        email = `github_${profile.id}@aurocore.com`;
    }
    const token = generateJwt(req.user);
    res.redirect(`${process.env.CLIENT_URL}/home?token=${token}`);
});

function generateJwt(user) {
    return jwt.sign({ id: user._id, username: user.username}, process.env.KEY, { expiresIn: "1h" });
}

module.exports = router;