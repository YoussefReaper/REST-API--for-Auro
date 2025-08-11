const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
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
 * /api/auth/login:
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

module.exports = router;