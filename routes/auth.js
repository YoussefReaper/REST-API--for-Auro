const express = require('express');
const router = express.Router();
const passport = require("passport");
const authController = require('../controllers/authController');
const { forgotPassword, resetPassword, forgotUsername } = require("../controllers/forgotPassword");
const crypto = require("crypto");
const userController = require("../controllers/userController")
const emailRequestLimiter = require("../middleware/rateLimit");
const authenticateToken = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");

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
router.post("/reset-password/:token", resetPassword);
router.post("/forgot-username", emailRequestLimiter, forgotUsername);

router.post('/send-verification-email', emailRequestLimiter, authenticateToken, userController.sendVerificationEmail);
router.get('/verify-email', emailRequestLimiter,userController.verifyEmail);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    console.log("Google User:", req.user);
    const {accessToken, refreshToken} = generateJwt(req.user);
    res.redirect(`${process.env.CLIENT_URL}/home?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    let email = req.user.emails && req.user.emails[0] ? req.user.emails[0].value : null;

    if(!email) {
        email = `github_${req.user.id}@aurocore.com`;
    }
    const { accessToken, refreshToken } = generateJwt(req.user);
    console.log("GitHub User:", req.user);
    res.redirect(
      `${process.env.CLIENT_URL}/home?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
});

router.get("/refresh", authController.refreshToken);
router.post("/logout", emailRequestLimiter, authController.logout);

function generateJwt(user) {
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.KEY,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_KEY,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

module.exports = router;