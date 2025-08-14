const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload')

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/profile', authenticateToken, userController.getProfile);

/**
 * @swagger
 * /api/user/customization:
 *   patch:
 *     summary: Update user customization settings
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               notifications:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Customization updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch('/customization', authenticateToken, userController.updateCustomization);

router.patch('/profile', authenticateToken, upload.fields([
    { name: 'profilePicture', maxCount: 1},
    { name: 'aiProfilePicture', maxCount: 1}
]), userController.updateProfile);

router.patch('/subscription', authenticateToken, userController.updateSubscription);

module.exports = router;