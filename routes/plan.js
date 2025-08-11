const express = require('express');
const Plan = require('../models/Plan');
const router = express.Router();
const planController = require('../controllers/planController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, planController.createPlan);
router.get('/', authenticateToken, planController.getPlans);
router.get('/:id', authenticateToken, planController.getPlanById);
router.put('/:id', authenticateToken, planController.updatePlan);
router.delete('/:id', authenticateToken, planController.deletePlan);

module.exports = router;
