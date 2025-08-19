const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  acceptOrder,
  deleteOrder,
  trackOrder // Add this new function
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const orderValidation = [
  body('table').notEmpty().withMessage('Table is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number')
];

// Chef routes (require authentication)
router.get('/', auth, getOrders);
router.post('/', auth, orderValidation, createOrder);
router.put('/:id/status', auth, updateOrderStatus);
router.put('/:id/accept', auth, acceptOrder);
router.delete('/:id', auth, deleteOrder);

// Public routes (no auth required)
router.get('/track/:orderId', trackOrder);
router.post('/public', orderValidation, createOrder); // Public order creation

module.exports = router;