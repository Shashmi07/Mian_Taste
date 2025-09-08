const express = require('express');
const { body } = require('express-validator');
const {
  submitFeedback,
  getOrderForFeedback
} = require('../controllers/feedbackController');

const router = express.Router();

// Legacy validation middleware for QR feedback
const legacyFeedbackValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('orderNumber').notEmpty().withMessage('Order number is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('table').notEmpty().withMessage('Table is required'),
  body('itemFeedback').isArray({ min: 1 }).withMessage('Item feedback must be a non-empty array'),
  body('itemFeedback.*.itemName').notEmpty().withMessage('Item name is required'),
  body('itemFeedback.*.rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

// New validation middleware for universal feedback
const universalFeedbackValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('orderType').isIn(['qr', 'pre', 'reservation']).withMessage('Invalid order type'),
  body('ratings.food').isInt({ min: 1, max: 5 }).withMessage('Food quality rating is required and must be between 1 and 5'),
  body('ratings.service').isInt({ min: 1, max: 5 }).withMessage('Service quality rating is required and must be between 1 and 5')
];

// Public routes - submit feedback (no auth required)
router.post('/', (req, res, next) => {
  // Use different validation based on whether it's legacy or new format
  if (req.body.itemFeedback) {
    // Legacy QR feedback format
    legacyFeedbackValidation.forEach(validation => validation(req, res, () => {}));
  } else {
    // New universal feedback format
    universalFeedbackValidation.forEach(validation => validation(req, res, () => {}));
  }
  next();
}, submitFeedback);

// Public route for getting order details for feedback
router.get('/order/:orderId', getOrderForFeedback);

module.exports = router;