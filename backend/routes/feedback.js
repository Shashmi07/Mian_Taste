const express = require('express');
const { body } = require('express-validator');
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackByOrder,
  getFeedbackStats
} = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware for feedback
const feedbackValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('orderNumber').notEmpty().withMessage('Order number is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('table').notEmpty().withMessage('Table is required'),
  body('itemFeedback').isArray({ min: 1 }).withMessage('Item feedback must be a non-empty array'),
  body('itemFeedback.*.itemName').notEmpty().withMessage('Item name is required'),
  body('itemFeedback.*.rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

// Public route - submit feedback (no auth required)
router.post('/', feedbackValidation, submitFeedback);

// Admin routes (require authentication)
router.get('/', auth, getAllFeedback);
router.get('/stats', auth, getFeedbackStats);
router.get('/order/:orderId', auth, getFeedbackByOrder);

module.exports = router;