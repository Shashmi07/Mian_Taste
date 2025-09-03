const express = require('express');
const { body } = require('express-validator');
const {
  getPreOrders,
  createPreOrder,
  updatePreOrderStatus,
  getPreOrdersByDate
} = require('../controllers/preOrderController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware for preorders
const preOrderValidation = [
  body('orderType').isIn(['dine-in', 'takeaway', 'delivery']).withMessage('Invalid order type'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('scheduledTime').notEmpty().withMessage('Scheduled time is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerPhone').notEmpty().withMessage('Customer phone is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('deliveryAddress').if(body('orderType').equals('delivery')).notEmpty().withMessage('Delivery address is required for delivery orders')
];

// Staff routes (require authentication)
router.get('/', auth, getPreOrders);
router.get('/by-date', auth, getPreOrdersByDate);
router.put('/:id/status', auth, updatePreOrderStatus);

// Public routes (no auth required)
router.post('/', preOrderValidation, createPreOrder); // Public preorder creation

module.exports = router;