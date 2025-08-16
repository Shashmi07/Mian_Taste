const express = require('express');
const { body } = require('express-validator');
const {
  getInventory,
  createInventoryItem,
  updateInventoryQuantity,
  deleteInventoryItem
} = require('../controllers/inventoryController');
// const auth = require('../middleware/auth'); // Comment this out temporarily

const router = express.Router();

// Validation middleware
const inventoryValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('minStock').isNumeric().withMessage('Min stock must be a number')
];

// Routes
router.get('/', getInventory); // Remove auth,
router.post('/', inventoryValidation, createInventoryItem); // Remove auth,
router.put('/:id/quantity', updateInventoryQuantity); // Remove auth,
// router.delete('/:id', auth, deleteInventoryItem); // Comment this out temporarily

module.exports = router;