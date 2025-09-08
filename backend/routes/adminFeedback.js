const express = require('express');
const {
  getAllFeedback,
  getFeedbackByOrder,
  getFeedbackStats
} = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

const router = express.Router();

// All admin feedback routes require authentication
router.use(auth);

// Get all feedback with optional filtering
// Query parameters: ?orderType=qr|pre|reservation|all&limit=50&sortBy=createdAt&order=desc
router.get('/', getAllFeedback);

// Get feedback statistics
router.get('/stats', getFeedbackStats);

// Get feedback by order ID
router.get('/order/:orderId', getFeedbackByOrder);

module.exports = router;