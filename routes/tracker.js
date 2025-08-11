const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const trackerController = require('../controllers/trackerController');

/**
 * @swagger
 * /tracker:
 *   post:
 *     summary: Log a new entry
 *     tags: [Tracker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               activity:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Entry created
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, trackerController.logEntry);

/**
 * @swagger
 * /tracker:
 *   get:
 *     summary: Get all tracking entries
 *     tags: [Tracker]
 *     responses:
 *       200:
 *         description: List of tracking entries
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, trackerController.getTracker);

module.exports = router;