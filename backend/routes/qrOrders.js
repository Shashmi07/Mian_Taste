const express = require('express');
const { body } = require('express-validator');
const {
  getQrOrders,
  createQrOrder,
  updateQrOrderStatus,
  trackQrOrder,
  deleteQrOrder
} = require('../controllers/qrOrderController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware for QR orders
const qrOrderValidation = [
  body('table').notEmpty().withMessage('Table is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number')
];

// Staff routes (require authentication)
router.get('/', auth, getQrOrders);
router.post('/', auth, qrOrderValidation, createQrOrder);
router.put('/:id/status', auth, updateQrOrderStatus);
router.delete('/:id', auth, deleteQrOrder);

// Public routes (no auth required)
router.get('/track/:orderId', trackQrOrder);
router.post('/public', qrOrderValidation, createQrOrder); // Public QR order creation

module.exports = router;