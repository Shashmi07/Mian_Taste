const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  acceptOrder,
  deleteOrder
} = require('../controllers/orderController');
// const auth = require('../middleware/auth'); // Comment this out temporarily

const router = express.Router();

// Validation middleware
const orderValidation = [
  body('table').notEmpty().withMessage('Table is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number')
];

// Routes
router.get('/', getOrders); // Remove auth, 
router.post('/', orderValidation, createOrder); // Remove auth, 
router.put('/:id/status', updateOrderStatus); // Remove auth, 
router.put('/:id/accept', acceptOrder); // Remove auth, 
// router.delete('/:id', auth, deleteOrder); // Comment this out temporarily

module.exports = router;