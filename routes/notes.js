const express = require('express');
const Note = require('../models/Note');
const router = express.Router();
const noteController = require('../controllers/noteController')
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, noteController.createNote);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, noteController.getNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the note to retrieve
 *     responses:
 *       200:
 *         description: Note's info
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, noteController.getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note's info
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, noteController.updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, noteController.deleteNote);

module.exports = router;