const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  createOrder,
  createPreorder,
  updateOrderStatus,
  acceptOrder,
  deleteOrder,
  trackOrder
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

// Preorder validation middleware
const preorderValidation = [
  body('orderType').isIn(['dine-in', 'takeaway', 'delivery']).withMessage('Invalid order type'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('scheduledTime').notEmpty().withMessage('Scheduled time is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerPhone').notEmpty().withMessage('Customer phone is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('deliveryAddress').if(body('orderType').equals('delivery')).notEmpty().withMessage('Delivery address is required for delivery orders'),
  body('table').if(body('orderType').equals('dine-in')).notEmpty().withMessage('Table is required for dine-in orders')
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
router.post('/preorder', preorderValidation, createPreorder); // Public preorder creation

module.exports = router;